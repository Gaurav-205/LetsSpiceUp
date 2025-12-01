/**
 * Keep-Alive Script for Render Free Tier
 * 
 * This script pings your backend health endpoint every 14 minutes
 * to prevent the service from spinning down due to inactivity.
 * 
 * Run this script on a separate service (like a free Render cron job)
 * or use an external monitoring service like UptimeRobot (free tier available)
 * 
 * Usage:
 * 1. Set BACKEND_URL environment variable
 * 2. Run: node scripts/keep-alive.js
 * 
 * Or use UptimeRobot (recommended):
 * - Sign up at https://uptimerobot.com (free tier: 50 monitors)
 * - Add a new monitor
 * - Type: HTTP(s)
 * - URL: https://your-backend-url.onrender.com/health
 * - Interval: 5 minutes (free tier minimum)
 */

const https = require('https');
const http = require('http');

const BACKEND_URL = process.env.BACKEND_URL || 'https://your-backend-url.onrender.com';
const INTERVAL_MINUTES = 14; // Ping every 14 minutes (before 15 min timeout)
const INTERVAL_MS = INTERVAL_MINUTES * 60 * 1000;

function pingHealthEndpoint() {
  const url = new URL(BACKEND_URL);
  const protocol = url.protocol === 'https:' ? https : http;
  const path = url.pathname.endsWith('/health') ? url.pathname : url.pathname + '/health';
  
  const options = {
    hostname: url.hostname,
    port: url.port || (url.protocol === 'https:' ? 443 : 80),
    path: path,
    method: 'GET',
    timeout: 10000,
    headers: {
      'User-Agent': 'Keep-Alive-Script/1.0'
    }
  };

  const req = protocol.request(options, (res) => {
    let data = '';
    
    res.on('data', (chunk) => {
      data += chunk;
    });
    
    res.on('end', () => {
      const timestamp = new Date().toISOString();
      if (res.statusCode === 200) {
        console.log(`[${timestamp}] ✅ Health check successful - Status: ${res.statusCode}`);
      } else {
        console.warn(`[${timestamp}] ⚠️  Health check returned status: ${res.statusCode}`);
      }
    });
  });

  req.on('error', (error) => {
    const timestamp = new Date().toISOString();
    console.error(`[${timestamp}] ❌ Health check failed:`, error.message);
  });

  req.on('timeout', () => {
    req.destroy();
    const timestamp = new Date().toISOString();
    console.error(`[${timestamp}] ❌ Health check timeout`);
  });

  req.end();
}

// Ping immediately on start
console.log(`🚀 Keep-alive script started`);
console.log(`📍 Backend URL: ${BACKEND_URL}`);
console.log(`⏰ Interval: ${INTERVAL_MINUTES} minutes`);
console.log(`\nPinging health endpoint...`);
pingHealthEndpoint();

// Then ping every INTERVAL_MINUTES
setInterval(() => {
  pingHealthEndpoint();
}, INTERVAL_MS);

// Keep the process alive
process.on('SIGINT', () => {
  console.log('\n👋 Keep-alive script stopped');
  process.exit(0);
});

