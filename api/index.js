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
const Gamedig = require('gamedig');

async function getServerStatus(ip, port) {
  try {
    const state = await Gamedig.query({
      type: 'ase', // or whatever game type you're using (e.g. 'arkse', 'valheim', 'quakelive')
      host: ip,
      port: port
    });
    return {
      status: 'online',
      name: state.name,
      players: state.players.length,
      maxPlayers: state.maxplayers
    };
  } catch (e) {
    return { status: 'offline' };
  }
}
