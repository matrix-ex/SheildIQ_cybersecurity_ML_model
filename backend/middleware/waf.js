const activeBlocks = new Map();

// Structure: Map(ip -> { action, expiresAt, requestCount, lastRequestAt })

const MAX_RATE_LIMIT_REQUESTS = 10; // Max requests per minute when rate limited

/**
 * Applies an active enforcement block or rate limit to an IP address.
 * @param {string} ip - The source IP address.
 * @param {string} action - The prevention action (e.g., DROP_CONNECTION, RATE_LIMIT).
 * @param {number} timeoutSeconds - How long the penalty should last in seconds.
 */
function applyBlock(ip, action, timeoutSeconds) {
  if (!ip || ip === "0.0.0.0" || action === "ALLOW" || action === "FLAG_FOR_REVIEW") {
    return;
  }

  // Ensure timeout is a valid number, default to 1 hour if not provided
  const duration = (Number.isFinite(Number(timeoutSeconds)) && Number(timeoutSeconds) > 0) ? Number(timeoutSeconds) : 3600;
  
  const expiresAt = Date.now() + duration * 1000;

  activeBlocks.set(ip, {
    action,
    expiresAt,
    requestCount: 0,
    lastRequestAt: Date.now()
  });

  console.log(`[WAF] Active penalty applied: IP ${ip} | Action: ${action} | Expires in: ${duration}s`);
}

/**
 * Express middleware to actively drop or rate-limit requests from penalized IPs.
 */
function wafMiddleware(req, res, next) {
  const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress || req.ip;
  const sourceIp = ip ? ip.split(',')[0].trim() : "0.0.0.0";

  const blockRecord = activeBlocks.get(sourceIp);

  if (blockRecord) {
    // Check if block has expired
    if (Date.now() > blockRecord.expiresAt) {
      activeBlocks.delete(sourceIp);
      return next();
    }

    if (blockRecord.action === "DROP_CONNECTION" || blockRecord.action === "QUARANTINE" || blockRecord.action === "BLOCK_AND_LOG") {
      console.warn(`[WAF] Blocked request from ${sourceIp} (${blockRecord.action})`);
      return res.status(403).json({
        error: "Forbidden. Your connection has been blocked by the active security policy.",
        action: blockRecord.action
      });
    }

    if (blockRecord.action === "RATE_LIMIT") {
      // Basic rate limiting: reset count if > 1 minute since last request
      if (Date.now() - blockRecord.lastRequestAt > 60000) {
        blockRecord.requestCount = 0;
        blockRecord.lastRequestAt = Date.now();
      }

      blockRecord.requestCount++;

      if (blockRecord.requestCount > MAX_RATE_LIMIT_REQUESTS) {
        console.warn(`[WAF] Rate limited request from ${sourceIp} (${blockRecord.requestCount} req/min)`);
        return res.status(429).json({
          error: "Too Many Requests. Rate limit exceeded due to suspicious activity.",
          action: "RATE_LIMIT"
        });
      }
    }
  }

  next();
}

module.exports = {
  applyBlock,
  wafMiddleware,
};
