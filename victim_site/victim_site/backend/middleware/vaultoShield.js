const axios = require('axios');

const VAULTO_API_URL = process.env.VAULTO_API_URL || 'http://localhost:4000';
const VAULTO_API_KEY = process.env.VAULTO_API_KEY || 'nexus-bank-demo-key';
const VAULTO_TIMEOUT = Number(process.env.VAULTO_TIMEOUT || 5000);

const ipTracker = new Map();
const WINDOW_MS = 60 * 1000;

function pruneTracker() {
  const now = Date.now();
  for (const [trackedIp, data] of ipTracker.entries()) {
    if (now - data.firstSeen.getTime() > WINDOW_MS) {
      ipTracker.delete(trackedIp);
    }
  }
}

module.exports = async function vaultoShield(req, res, next) {
  try {
    pruneTracker();

    const ip = req.headers['x-forwarded-for']?.split(',')[0]?.trim()
      || req.ip
      || '127.0.0.1';

    let tracker = ipTracker.get(ip);
    if (!tracker || (Date.now() - tracker.firstSeen.getTime()) > WINDOW_MS) {
      tracker = {
        count: 0,
        firstSeen: new Date(),
        paths: new Set(),
        lastPath: req.url,
      };
    }

    tracker.count += 1;
    tracker.paths.add(req.url);
    tracker.lastPath = req.url;
    ipTracker.set(ip, tracker);

    const elapsed = (Date.now() - tracker.firstSeen.getTime()) / 1000;
    const requestRate = tracker.count / Math.max(elapsed, 1);
    const bodySize = parseInt(req.headers['content-length'], 10) || 0;
    const urlLen = req.url.length;

    const urlAndBody = req.url + JSON.stringify(req.body || {});
    const isLogin = /login|signin|auth/.test(req.url) ? 1 : 0;
    const isAdmin = /admin|panel|dashboard/.test(req.url) ? 1 : 0;
    const isSearch = /search|query|find/.test(req.url) ? 1 : 0;
    const hasSQLi = /union|select|drop|insert|--|'|%27/i.test(urlAndBody) ? 1 : 0;
    const hasXSS = /<script|javascript:|onerror=/i.test(urlAndBody) ? 1 : 0;

    const features = [
      requestRate * 1000,
      tracker.count,
      Math.floor(tracker.count * 0.3),
      bodySize * tracker.count,
      bodySize * 0.3,
      bodySize || 64,
      48,
      requestRate * (bodySize || 64),
      requestRate,
      1000 / (requestRate + 0.1),
      3000 / (requestRate + 0.1),
      requestRate * 10,
      isLogin * tracker.count,
      0,
      hasSQLi + hasXSS,
      isLogin * tracker.count * 2,
      Math.floor(tracker.count * 0.8),
      tracker.paths.size * 3,
      Math.min(elapsed, 60),
      1 / (requestRate + 0.1),
    ];

    const response = await axios.post(
      `${VAULTO_API_URL}/api/analyze`,
      {
        features,
        ip,
        source_url: req.url,
        triggered_by: 'shield',
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'x-vaulto-api-key': VAULTO_API_KEY,
        },
        signal: AbortSignal.timeout(VAULTO_TIMEOUT),
      }
    );

    const result = response.data || {};

    if (result.blocked === true) {
      if (result.prevention?.action === 'RATE_LIMIT') {
        return res.status(429).json({
          blocked: true,
          vaulto: true,
          action: result.prevention.action,
          reason: result.prevention.reason,
          attack: result.prediction?.label || result.prediction?.prediction_label || 'Unknown',
          confidence: result.prediction?.confidence ?? 0,
          retryAfter: result.prevention.timeout,
        });
      }

      return res.status(403).json({
        blocked: true,
        vaulto: true,
        action: result.prevention?.action || 'BLOCK_AND_LOG',
        reason: result.prevention?.reason || 'Suspicious traffic blocked by VAULTO Shield',
        attack: result.prediction?.label || result.prediction?.prediction_label || 'Unknown',
        confidence: result.prediction?.confidence ?? 0,
        prevention_actions: result.prevention?.prevention_actions || [],
      });
    }

    return next();
  } catch (err) {
    console.warn('[VAULTO Shield] Fail-open:', err.message);
    return next();
  }
};
