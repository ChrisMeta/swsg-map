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

// Function to check server status with error handling
async function getServerStatus(ip, port) {
  console.log(`Checking server at ${ip}:${port}...`);
  try {
    const state = await Gamedig.query({
      type: 'spaceengineers',
      host: ip,
      port: port,
      timeout: 5000 // 5 seconds timeout to avoid long waits
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

// Basic home route
app.get('/', (req, res) => {
  res.send('Space Engineers Server Status API');
});

// Status endpoint
app.get('/status', async (req, res) => {
  try {
    // Create a status object with all planets initialized as offline
    const statusData = {};
    planets.forEach(planet => {
      statusData[planet.name] = 'offline';
    });

    // Only check a few planets at a time to avoid overloading
    const planetBatches = [];
    const batchSize = 3;
    
    for (let i = 0; i < planets.length; i += batchSize) {
      planetBatches.push(planets.slice(i, i + batchSize));
    }

    // Process each batch sequentially
    for (const batch of planetBatches) {
      const batchPromises = batch.map(planet => 
        getServerStatus(planet.ip, planet.port)
          .then(result => {
            statusData[planet.name] = result.status;
          })
          .catch(err => {
            console.error(`Error checking ${planet.name}: ${err.message}`);
            // Status already set to offline by default
          })
      );
      
      // Wait for this batch to complete before starting the next one
      await Promise.all(batchPromises);
    }
    
    res.json(statusData);
  } catch (error) {
    console.error('Error in /status route:', error);
    res.status(500).json({ error: 'An error occurred while checking server statuses' });
  }
});

// Start the server with error handling
const server = app.listen(port, () => {
  console.log(`Server running on port ${port}`);
}).on('error', (err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});

// Handle uncaught exceptions and unhandled rejections to prevent crashing
process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
  // Don't exit the process, but log the error
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
  // Don't exit the process, but log the error
});