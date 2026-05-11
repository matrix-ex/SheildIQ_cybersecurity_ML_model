const PREVENTION_RULES = {
  0: {
    label: "Normal",
    action: "ALLOW",
    timeout: 0,
    severity: "none",
    prevention_actions: ["Passive monitoring only", "No enforcement required"],
    reason: "Traffic behavior is normal. VAULTO continues monitoring without active blocking.",
  },
  1: {
    label: "Brute Force",
    action: "RATE_LIMIT",
    timeout: 1800,
    severity: "high",
    prevention_actions: [
      "Account lockout after 5 fails",
      "IP rate limiting (max 10 req/min)",
      "CAPTCHA triggered",
      "MFA enforcement",
    ],
    reason: "Repeated authentication attempts indicate brute-force behavior. Access is rate-limited and account-protection controls are enforced.",
  },
  2: {
    label: "Dictionary Attack",
    action: "RATE_LIMIT",
    timeout: 1800,
    severity: "high",
    prevention_actions: [
      "Account lockout after 5 fails",
      "IP rate limiting (max 10 req/min)",
      "CAPTCHA triggered",
      "MFA enforcement",
    ],
    reason: "Automated credential spraying is suspected. Login traffic is throttled and anti-automation controls are enabled.",
  },
  3: {
    label: "DoS",
    action: "DROP_CONNECTION",
    timeout: 3600,
    severity: "critical",
    prevention_actions: [
      "Rate limiting per source IP",
      "Auto-block offending IP",
      "Connection timeout reduction",
      "Traffic shaping/throttling",
    ],
    reason: "DoS traffic pattern detected. Active network protection drops suspicious flows to preserve availability.",
  },
  4: {
    label: "DDoS",
    action: "DROP_CONNECTION",
    timeout: 7200,
    severity: "critical",
    prevention_actions: [
      "CDN/DDoS mitigation activation",
      "Traffic scrubbing at edge",
      "Auto-scaling infrastructure",
      "GeoIP blocking",
    ],
    reason: "Distributed attack indicators detected. Edge mitigation and connection dropping are applied to reduce blast radius.",
  },
  5: {
    label: "SYN Flood",
    action: "DROP_CONNECTION",
    timeout: 3600,
    severity: "critical",
    prevention_actions: [
      "SYN cookies enabled",
      "Rate limit SYN packets per IP",
      "Half-open timeout reduced to 10s",
    ],
    reason: "SYN flood behavior identified. Half-open connection defenses and SYN controls are enforced immediately.",
  },
  6: {
    label: "Port Scan",
    action: "RATE_LIMIT",
    timeout: 900,
    severity: "medium",
    prevention_actions: [
      "Rate limiting per source IP",
      "Auto-block offending IP",
      "Connection timeout reduction",
      "Traffic shaping/throttling",
    ],
    reason: "Reconnaissance scanning pattern detected. Source probing traffic is rate-limited and monitored.",
  },
  7: {
    label: "SQL Injection",
    action: "BLOCK_AND_LOG",
    timeout: 7200,
    severity: "critical",
    prevention_actions: [
      "Parameterized queries enforced",
      "WAF rule activation",
      "Input validation (whitelist)",
      "Error message suppression",
    ],
    reason: "SQL injection indicators found in request behavior. Requests are blocked and forensic logging is enabled.",
  },
  8: {
    label: "XSS",
    action: "BLOCK_AND_LOG",
    timeout: 7200,
    severity: "high",
    prevention_actions: [
      "Content Security Policy (CSP)",
      "Output encoding/escaping",
      "HTTPOnly cookie flag",
      "X-XSS-Protection header",
    ],
    reason: "Cross-site scripting activity is likely. Payloads are blocked and browser-hardening policies are reinforced.",
  },
  9: {
    label: "R2L",
    action: "BLOCK_AND_LOG",
    timeout: 3600,
    severity: "high",
    prevention_actions: [
      "Account lockout after 5 fails",
      "IP rate limiting (max 10 req/min)",
      "CAPTCHA triggered",
      "MFA enforcement",
    ],
    reason: "Remote-to-local intrusion behavior detected. Access attempts are blocked and escalated for investigation.",
  },
  10: {
    label: "Botnet",
    action: "QUARANTINE",
    timeout: 86400,
    severity: "critical",
    prevention_actions: [
      "C2 server IP/domain blocking",
      "DNS sinkholing",
      "Host isolation/quarantine",
      "Egress filtering",
    ],
    reason: "Botnet communication pattern identified. Host/network quarantine controls are activated to stop lateral movement.",
  },
};

const ipStrikeMap = new Map();
const STRIKE_WINDOW_MS = 5 * 60 * 1000; // 5 minutes
const STRIKE_THRESHOLD = 3;

function getPreventionAction(predictionClass, ip, confidence) {
  const classNum = Number.isFinite(Number(predictionClass))
    ? parseInt(predictionClass, 10)
    : 0;
  const normalizedConfidence = Number.isFinite(Number(confidence))
    ? Number(confidence)
    : 0;
  const sourceIp = ip || "0.0.0.0";
  const rule = PREVENTION_RULES[classNum] || PREVENTION_RULES[0];

  let action = rule.action;
  let severity = rule.severity;
  let prevention_actions = rule.prevention_actions;
  let reason = rule.reason;
  let timeout = rule.timeout;

  // Confidence check override
  if (normalizedConfidence < 0.75 && classNum !== 0) {
    action = "FLAG_FOR_REVIEW";
    timeout = 0;
    prevention_actions = [
      "Escalate event to SOC analyst",
      "Collect additional telemetry",
      "Keep source under temporary watchlist",
    ];
    reason = `Model confidence is ${(normalizedConfidence * 100).toFixed(
      1
    )}%. Automatic enforcement is overridden and flagged for manual review.`;
  }

  // Stateful Tracking: Three Strikes Rule
  if (action === "RATE_LIMIT" || action === "FLAG_FOR_REVIEW" || action === "BLOCK_AND_LOG") {
    const now = Date.now();
    let strikes = ipStrikeMap.get(sourceIp) || [];
    
    // Filter out old strikes outside the window
    strikes = strikes.filter(s => now - s.timestamp < STRIKE_WINDOW_MS);
    
    // Add current strike
    strikes.push({ timestamp: now });
    ipStrikeMap.set(sourceIp, strikes);

    // Escalate if threshold met
    if (strikes.length >= STRIKE_THRESHOLD) {
      console.warn(`[Prevention Engine] IP ${sourceIp} hit ${strikes.length} strikes. Escalating to DROP_CONNECTION.`);
      action = "DROP_CONNECTION";
      severity = "critical";
      timeout = 7200; // 2 hour block
      prevention_actions = [
        "Auto-block offending IP (Three Strikes Rule)",
        "Connection dropped instantly by Active WAF",
        "Escalated to CRITICAL due to repeated violations"
      ];
      reason = `IP has triggered ${strikes.length} warnings within 5 minutes. Threat automatically escalated to CRITICAL and active blocking applied.`;
    }
  }

  return {
    attack_class: classNum,
    attack_label: rule.label,
    action,
    timeout,
    severity,
    prevention_actions,
    reason,
    ip: sourceIp,
    confidence: normalizedConfidence,
  };
}

module.exports = {
  getPreventionAction,
  PREVENTION_RULES,
};
