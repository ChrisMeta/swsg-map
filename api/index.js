const express = require('express');
const cors = require('cors');
const Gamedig = require('gamedig');

const app = express();
app.use(cors());

const servers = {
  Tatooine: { ip: "71.187.19.128", port: 30202 },
  Mandalore: { ip: "71.187.19.128", port: 30205 },
  Naboo: { ip: "71.187.19.128", port: 30203 },
  // Add all other planets...
};

app.get('/status', async (req, res) => {
  const results = {};

  await Promise.all(Object.entries(servers).map(async ([name, { ip, port }]) => {
    try {
      const state = await Gamedig.query({
        type: 'spaceengineers',
        host: ip,
        port
      });
      results[name] = {
        status: 'online',
        players: state.players.length,
        maxPlayers: state.maxplayers
      };
    } catch (e) {
      results[name] = { status: 'offline' };
    }
  }));

  res.json(results);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`API running on port ${PORT}`));
