// Import necessary packages
const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');

// Initialize Express app
const app = express();
const port = process.env.PORT || 10000;

// Middleware for CORS
app.use(cors());

// Array of planets (you may want to extend this with your full list of planets)
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
  { name: 'Coruscant', ip: '71.187.19.128', port: 30217 }
];

// Function to check server status
async function getServerStatus(ip, port) {
  try {
    const res = await fetch(`http://${ip}:${port}/status`);
    if (res.ok) {
      const status = await res.json();
      return status;
    } else {
      return { status: 'offline' };
    }
  } catch (err) {
    return { status: 'offline' };
  }
}

// Route to get the status of all planets
app.get('/status', async (req, res) => {
  const planetStatuses = {};

  // Iterate through all the planets and fetch their status
  for (const planet of planets) {
    const status = await getServerStatus(planet.ip, planet.port);
    planetStatuses[planet.name] = status;
  }

  res.json(planetStatuses); // Return the status of all planets
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
