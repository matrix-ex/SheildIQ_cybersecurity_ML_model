/**
 * VAULTO Prevention Engine
 * Maps ML prediction classes to automated prevention actions.
 * This is the "brain" that decides what to do when an attack is detected.
 */

const PREVENTION_RULES = {
  0: {
    action: "ALLOW",
    timeout: 0,
    severity: "none",
    reason: "Normal traffic — no action required.",
  },
  1: {
    action: "RATE_LIMIT",
    timeout: 1800,
    severity: "medium",
    reason: "Brute Force detected — rate limiting login attempts, enforcing account lockout after 5 failures.",
  },
  2: {
    action: "RATE_LIMIT",
    timeout: 1800,
    severity: "medium",
    reason: "Dictionary Attack detected — rate limiting per-account login, enforcing strong password policy.",
  },
  3: {
    action: "DROP_CONNECTION",
    timeout: 3600,
    severity: "high",
    reason: "DoS attack detected — dropping connection, enabling SYN cookies, throttling source IP.",
  },
  4: {
    action: "DROP_CONNECTION",
    timeout: 7200,
    severity: "high",
    reason: "DDoS attack detected — dropping connection, activating edge traffic scrubbing, enabling auto-scaling.",
  },
  5: {
    action: "DROP_CONNECTION",
    timeout: 3600,
    severity: "high",
    reason: "SYN Flood detected — dropping connection, enabling SYN proxy, reducing half-open timeout.",
  },
  6: {
    action: "RATE_LIMIT",
    timeout: 900,
    severity: "medium",
    reason: "Port Scan detected — rate limiting, activating firewall stealth mode, deploying honeypot.",
  },
  7: {
    action: "BLOCK_AND_LOG",
    timeout: 7200,
    severity: "high",
    reason: "SQL Injection detected — blocking request, activating WAF rules, enforcing parameterized queries.",
  },
  8: {
    action: "BLOCK_AND_LOG",
    timeout: 7200,
    severity: "high",
    reason: "XSS attack detected — blocking request, enforcing Content Security Policy, sanitizing input.",
  },
  9: {
    action: "BLOCK_AND_LOG",
    timeout: 3600,
    severity: "medium",
    reason: "R2L intrusion detected — blocking remote access, enforcing zero-trust model, isolating segment.",
  },
  10: {
    action: "QUARANTINE",
    timeout: 86400,
    severity: "critical",
    reason: "Botnet activity detected — quarantining host, blocking C2 server communication, initiating DNS sinkhole.",
  },
};

/**
 * Determine the prevention action for a given prediction.
 * @param {number} predictionClass - ML prediction class (0-10)
 * @param {string} ip - Source IP address
 * @param {number} confidence - Model confidence (0.00-1.00)
 * @returns {object} Prevention action payload
 */
function getPreventionAction(predictionClass, ip, confidence) {
  const classNum = parseInt(predictionClass, 10);
  const rule = PREVENTION_RULES[classNum] || PREVENTION_RULES[0];

  // Low confidence override: never auto-block if model isn't sure
  if (confidence < 0.75 && classNum !== 0) {
    return {
      action: "FLAG_FOR_REVIEW",
      timeout: 0,
      severity: rule.severity,
      reason: `Low confidence (${(confidence * 100).toFixed(1)}%) — flagged for manual review. Original action would be: ${rule.action}.`,
      ip: ip || "0.0.0.0",
    };
  }

  return {
    action: rule.action,
    timeout: rule.timeout,
    severity: rule.severity,
    reason: rule.reason,
    ip: ip || "0.0.0.0",
  };
}

module.exports = { getPreventionAction, PREVENTION_RULES };
