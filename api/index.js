const express = require('express');
const Gamedig = require('gamedig');
const app = express();
const port = process.env.PORT || 3000;

app.get('/status/:ip/:port', async (req, res) => {
  const { ip, port } = req.params;
  try {
    const state = await Gamedig.query({
      type: 'spaceengineers',
      host: ip,
      port: parseInt(port)
    });
    res.json({
      online: true,
      name: state.name,
      players: state.players.length,
      maxPlayers: state.maxplayers
    });
  } catch (err) {
    res.json({ online: false, error: err.message });
  }
});

app.get('/', (req, res) => {
  res.send('Space Engineers Server Status API');
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
