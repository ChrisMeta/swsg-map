// Import necessary packages
const express = require('express');
const cors = require('cors');
const Gamedig = require('gamedig');

// Initialize Express app
const app = express();
const port = process.env.PORT || 10000;

// Middleware for CORS
app.use(cors());

// Array of planets
const planets = [
  { name: 'Mandalore', ip: '71.187.19.128', port: 30205 },
  { name: 'Tatooine', ip: '71.187.19.128', port: 30202 },
  { name: 'Naboo', ip: '71.187.19.128', port: 30203 },
  { name: 'Crait', ip: '71.187.19.128', port: 30204 },
  { name: 'Bespin', ip: '71.187.19.128', port: 30206 },
  { name: 'Ilum', ip: '71.187.19.128', port: 30207 },
  { name: 'Geonosis', ip: '71.187.19.128', port: 30208 },
  { name: 'Deep Space', ip: '71.187.19.128', port: 30209 },
  { name: 'Tython', ip: '71.187.19.128', port: 30211 },
  { name: 'Mustafar', ip: '71.187.19.128', port: 30212 },
  { name: 'Jakku', ip: '71.187.19.128', port: 30213 },
  { name: 'Bastion', ip: '71.187.19.128', port: 30214 },
  { name: 'Pyke', ip: '71.187.19.128', port: 30215 },
  { name: 'Corellia', ip: '71.187.19.128', port: 30216 },
  { name: 'Coruscant', ip: '71.187.19.128', port: 30201 }
];

// Cache to store planet statuses
let planetStatusCache = {};
let lastUpdated = null;

// Function to query status for all planets
async function updatePlanetStatuses() {
  console.log('Updating planet statuses...');

  const newStatuses = {};

  for (const planet of planets) {
    const status = await getServerStatus(planet.ip, planet.port);
    newStatuses[planet.name] = status;
  }

  planetStatusCache = newStatuses;
  lastUpdated = new Date();
  console.log(`Planet statuses updated at ${lastUpdated.toISOString()}`);
}

// Call update immediately on startup
updatePlanetStatuses();

// Refresh every 60 seconds
setInterval(updatePlanetStatuses, 60 * 1000);

// Endpoint to get status from cache
app.get('/status', (req, res) => {
  res.json(planetStatusCache);
});

// Optional: Endpoint to get metadata
app.get('/status-meta', (req, res) => {
  res.json({
    lastUpdated,
    nextUpdateInSeconds: 60
  });
});

// Start server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

// Function to query a single server
async function getServerStatus(ip, port) {
  console.log(`Checking server at ${ip}:${port}...`);

  try {
    const state = await Gamedig.query({
      type: 'spaceengineers',
      host: ip,
      port: port
    });

    console.log(` ${ip}:${port} is online - Name: ${state.name}, Players: ${state.players.length}/${state.maxplayers}`);

    return {
      status: 'online',
      name: state.name,
      players: state.players.length,
      maxPlayers: state.maxplayers
    };
  } catch (e) {
    console.warn(` ${ip}:${port} is offline or unreachable. Error: ${e.message}`);
    return { status: 'offline' };
  }
}
