// Import necessary packages
const express = require('express');
const cors = require('cors');
const Gamedig = require('gamedig');

// Initialize Express app
const app = express();
const port = process.env.PORT || 10000;

// Middleware for CORS
app.use(cors());

// Array of planets with their server information
const planets = [
  { name: 'Mandalore', ip: '71.187.19.128', port: 30205 },
  { name: 'Tatooine', ip: '71.187.19.128', port: 30202 },
  { name: 'Naboo', ip: '71.187.19.128', port: 30203 },
  { name: 'Crait', ip: '71.187.19.128', port: 30204 },
  { name: 'Bespin', ip: '71.187.19.128', port: 30206 },
  { name: 'Ilum', ip: '71.187.19.128', port: 30207 },
  { name: 'Geonosis', ip: '71.187.19.128', port: 30208 },
  { name: 'Pyke', ip: '71.187.19.128', port: 30215 },
  { name: 'Tython', ip: '71.187.19.128', port: 30211 },
  { name: 'Mustafar', ip: '71.187.19.128', port: 30212 },
  { name: 'Jakku', ip: '71.187.19.128', port: 30213 },
  { name: 'Bastion', ip: '71.187.19.128', port: 30214 },
  { name: 'Corellia', ip: '71.187.19.128', port: 30216 },
  { name: 'Coruscant', ip: '71.187.19.128', port: 30217 },
  { name: 'Korriban', ip: '71.187.19.128', port: 30218 }
];

// Function to check server status with a shorter timeout
async function getServerStatus(ip, port) {
  console.log(`Checking server at ${ip}:${port}...`);
  try {
    const state = await Gamedig.query({
      type: 'spaceengineers',
      host: ip,
      port: port,
      timeout: 3000, // Shorter timeout to prevent hanging
      maxAttempts: 1  // Only try once
    });
    
    console.log(`${ip}:${port} is online - ${state.name}`);
    return 'online';
  } catch (e) {
    console.warn(`${ip}:${port} is offline or unreachable`);
    return 'offline';
  }
}

// Basic health check route
app.get('/', (req, res) => {
  res.send('Space Engineers Server Status API is running');
});

// Simple status check route - returns immediately with cached data if available
let statusCache = {};
let lastCheck = 0;
const CACHE_DURATION = 60000; // 1 minute cache

app.get('/status', async (req, res) => {
  // Check if we need to refresh cache
  const now = Date.now();
  if (now - lastCheck > CACHE_DURATION || Object.keys(statusCache).length === 0) {
    console.log("Cache expired or empty, starting background refresh");
    
    // Return cached data immediately if available, otherwise initialize with all offline
    if (Object.keys(statusCache).length === 0) {
      planets.forEach(planet => {
        statusCache[planet.name] = 'offline';
      });
    }
    
    // Start background refresh
    refreshStatusCache();
  }
  
  // Return current cache state
  res.json(statusCache);
});

// Function to refresh the cache in the background
async function refreshStatusCache() {
  lastCheck = Date.now();
  
  for (const planet of planets) {
    try {
      const status = await getServerStatus(planet.ip, planet.port);
      statusCache[planet.name] = status;
    } catch (err) {
      console.error(`Error checking ${planet.name}:`, err);
      statusCache[planet.name] = 'offline';
    }
  }
  
  console.log("Cache refresh complete");
}

// Start the server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
  
  // Initialize the cache on startup
  refreshStatusCache();
});

// Handle unhandled exceptions and rejections
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
});