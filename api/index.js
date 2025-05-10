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
  { name: 'Korriban', ip: '71.187.19.128', port: 30201 }
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
    return {
      status: 'online',
      players: state.players.length,
      maxPlayers: state.maxplayers,
      name: state.name
    };
  } catch (e) {
    console.warn(`${ip}:${port} is offline or unreachable`);
    return {
      status: 'offline',
      players: 0,
      maxPlayers: 0
    };
  }
}

// Basic health check route
app.get('/', (req, res) => {
  res.send('Space Engineers Server Status API is running');
});

// API endpoint to get status for all planets
app.get('/api/planets', (req, res) => {
  const now = Date.now();
  
  // If cache is still fresh, return it
  if (now - lastCheck < CACHE_DURATION) {
    return res.json(statusCache);
  }
  
  // Otherwise tell client to try again in a moment while we refresh
  res.status(202).json({
    message: 'Refreshing server data. Please try again in a few seconds.',
    planets: statusCache // Return current cache even if stale
  });
  
  // Refresh in background
  refreshStatusCache();
});

// Get status for a specific server
app.get("/api/server-status", async (req, res) => {
  const { ip, port } = req.query;
  
  if (!ip || !port) {
    return res.status(400).json({ error: "IP and port are required" });
  }
  
  try {
    const state = await Gamedig.query({
      type: "spaceengineers",
      host: ip,
      port: parseInt(port),
      timeout: 3000,
      maxAttempts: 1
    });
    
    res.json({ 
      online: true, 
      players: state.players.length, 
      maxPlayers: state.maxplayers,
      name: state.name
    });
  } catch (e) {
    res.json({ online: false });
  }
});

// Cache variables
let statusCache = {};
let lastCheck = 0;
const CACHE_DURATION = 60000; // 1 minute cache

// Function to refresh the cache in the background
async function refreshStatusCache() {
  console.log("Starting cache refresh...");
  lastCheck = Date.now();
  
  const newCache = {};
  
  for (const planet of planets) {
    try {
      const serverInfo = await getServerStatus(planet.ip, planet.port);
      newCache[planet.name] = serverInfo;
    } catch (err) {
      console.error(`Error checking ${planet.name}:`, err);
      newCache[planet.name] = {
        status: 'offline',
        players: 0,
        maxPlayers: 0
      };
    }
  }
  
  // Update the cache only after all checks are complete
  statusCache = newCache;
  console.log("Cache refresh complete");
}

// Schedule regular cache updates
setInterval(refreshStatusCache, CACHE_DURATION);

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