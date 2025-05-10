const ringCount = 5;
const ringSpacing = 5000000;
const ringSegments = 100;

// Planet definitions
const planetConfig = {
  Tatooine: {
    tooltip: "Phrik mining world",
    info: `**Tatooine**\nA remote desert world with twin suns, known for its harsh climate and lawless settlements. Significant in galactic history due to its connection to Anakin and Luke Skywalker.\nOres: Doonium, Zersium, Titanium, Alum, Bondar Crystals, Thorilide, Nova Crystals\nMines: 2x Phrik`
  },
  ObaDiah: {
    tooltip: "Hfredium source",
    info: `**Oba Diah**\nHome of the Pyke Syndicate, this planet serves as a critical node in the galaxy’s spice trade. Rugged terrain conceals rich mining veins.\nOres: Doonium, Zersium, Titanium, Alum, Bondar Crystals\nMines: 1x Hfredium`
  },
  Jakku: {
    tooltip: "Wreckage and deserts",
    info: `**Jakku**\nA backwater desert world littered with the remains of Imperial and Rebel ships. A symbol of the galaxy’s past conflicts.\nOres: Doonium, Zersium, Titanium, Alum, Bondar Crystals`
  },
  Bastion: {
    tooltip: "Imperial stronghold",
    info: `**Bastion**\nOne of the last bastions of the Empire, known for its fortified infrastructure and resilience.\nOres: Doonium, Zersium, Titanium, Alum, Bondar Crystals`
  },
  Mandalore: {
    tooltip: "Beskar source",
    info: `**Mandalore**\nA war-torn world central to Mandalorian culture and known for its resilient people.\nOres: Doonium, Zersium, Titanium, Alum, Bondar Crystals\nMines: 1x Beskar`
  },
  Crait: {
    tooltip: "Salt-covered world",
    info: `**Crait**\nAn uninhabited planet with a surface covered in white salt and a red mineral crust. Site of a key Resistance battle.\nOres: Doonium, Zersium, Titanium, Alum, Bondar Crystals`
  },
  Bespin: {
    tooltip: "Gas giant",
    info: `**Bespin**\nA gas giant famous for Cloud City and tibanna gas mining. Economically valuable to the surrounding systems.\nOres: Doonium, Zersium, Titanium, Alum, Bondar Crystals, Nova Crystals`
  },
  Mustafar: {
    tooltip: "Volcanic planet",
    info: `**Mustafar**\nA lava-ridden world tied to the Sith. Once home to Vader's castle. Dangerous yet rich in minerals.\nOres: Doonium, Zersium, Titanium, Alum, Bondar Crystals, Thorilide`
  },
  Ilum: {
    tooltip: "Kyber crystal mine",
    info: `**Ilum**\nFrozen world and sacred site to the Jedi, where many sought their lightsaber Kyber crystals.\nOres: Doonium, Zersium, Titanium, Alum, Bondar Crystals\nMines: 1x Kyber Crystal`
  },
  Korriban: {
    tooltip: "Sith homeworld",
    info: `**Korriban**\nAncient Sith world known for tombs of dark lords and powerful artifacts.\nOres: Doonium, Zersium, Titanium, Alum, Bondar Crystals\nMines: 1x Kyber Crystal`
  },
  Corellia: {
    tooltip: "Shipbuilding hub",
    info: `**Corellia**\nA major industrial center, home to renowned starship engineers and factories.\nOres: Doonium, Zersium, Titanium, Alum, Bondar Crystals\nMines: 2x Agrinium`
  },
  Naboo: {
    tooltip: "Plasma-rich",
    info: `**Naboo**\nA lush world with beautiful landscapes and deep cultural history. Home of Padmé Amidala and Emperor Palpatine.\nOres: Doonium, Zersium, Titanium, Alum, Bondar Crystals\nMines: 2x Plasma`
  },
  Tython: {
    tooltip: "Jedi origin world",
    info: `**Tython**\nBelieved to be one of the first homes of the Jedi Order. A spiritual and isolated place with strong Force presence.\nOres: Doonium, Zersium, Titanium, Alum, Bondar Crystals`
  },
  Geonosis: {
    tooltip: "Tech foundry world",
    info: `**Geonosis**\nAn arid, rocky planet known for its droid foundries and hostile wildlife. Crucial to Separatist droid armies.\nOres: Doonium, Zersium, Titanium, Alum, Bondar Crystals\nMines: 1x Phrik`
  },
  Coruscant: {
    tooltip: "Galactic capital",
    info: `**Coruscant**\nThe capital of the Galactic Republic and later the Empire, it’s a planet-wide city with towering skyscrapers.\nOres: Doonium, Zersium, Titanium, Alum, Bondar Crystals\nMines: 1x Hfredium`
  },
  Concordia: {
    tooltip: "Beskar moon",
    info: `**Concordia**\nMoon of Mandalore, historically tied to Mandalorian culture. Known for rich Beskar deposits.\nOres: Doonium, Zersium, Titanium, Alum, Bondar Crystals\nMines: 2x Beskar`
  }
};

const rawGPS = `
GPS:Pyke-762741754d70752:-601046.86:1631977.20:-2986847.82:
GPS:Mustafar-371072463d70193:1850206.13:-1840830.52:-4096797.85:
GPS:Bespin-1835941367d120000:1892706.49:-2282629.51:-2149592.10:
GPS:Crait-653645433d55662:1429743.13:-2614953.50:266699.28:
GPS:Naboo-1098188105d70472:950737.19:-2572347.33:1566047.11:
GPS:Tatooine-295449821d80812:-172826.30:-539367.41:2459851.46:
GPS:Geonosis-1282927802d70193:296896.77:312057.09:2691786.13:
GPS:Ilum-1773475286d60413:-203241.78:-1614472.99:-1494671.61:
GPS:Mandalore-1777397045d80532:-819872.83:1457962.13:-996840.15:
GPS:Coruscant-167939322d40852:-512967.06:-755235.49:341871.25:
GPS:Tython-560922880d79973:234625.84:-149726.82:118430.77:
GPS:Jakku-1884689095d70193:906322.90:418410.19:-1069854.10:
GPS:Corellia-88518661d70752:-962544.42:422187.43:480072.42:
GPS:Korriban-2017251185d60133:841417.23:1834876.65:1664115.32:
GPS:Bastion-1683874392d80532:3522416.92:-1229098.36:1944917.46:
`;

function createRing(radius) {
  const step = (2 * Math.PI) / ringSegments;
  const x = [], y = [], z = [];
  for (let i = 0; i <= ringSegments; i++) {
    const angle = i * step;
    x.push(Math.cos(angle) * radius);
    y.push(0);
    z.push(Math.sin(angle) * radius);
  }
  return { x, y, z };
}

const planetData = rawGPS.trim().split('\n').map(line => {
  const parts = line.split(':');
  const nameWithID = parts[1];
  const name = nameWithID.split('-')[0];
  return {
    name,
    x: parseFloat(parts[2]) * 10,
    y: parseFloat(parts[3]) * 10,
    z: parseFloat(parts[4]) * 10,
    tooltip: (planetConfig[name]?.tooltip) || name
  };
});

const planetMap = Object.fromEntries(planetData.map(p => [p.name, p]));

const planetTrace = {
  x: planetData.map(p => p.x),
  y: planetData.map(p => p.y),
  z: planetData.map(p => p.z),
  text: planetData.map(p => p.name),
  hovertext: planetData.map(p => p.tooltip),
  hoverinfo: 'text',
  mode: 'markers+text',
  type: 'scatter3d',
  marker: {
    size: 6,
    color: '#75C9F1',
    line: { color: 'black', width: 1 }
  },
  textposition: 'top center',
  name: 'Planets',
  showlegend: true,
  legendgroup: 'planets'
};

const ringTraces = [];
for (let i = 1; i <= ringCount; i++) {
  const ring = createRing(i * ringSpacing);
  ringTraces.push({
    x: ring.x,
    y: ring.y,
    z: ring.z,
    mode: 'lines',
    type: 'scatter3d',
    line: { color: 'white', width: 1, dash: 'dot' },
    hoverinfo: 'none',
    name: i === 1 ? 'Orbit Rings' : undefined,
    showlegend: i === 1,
    legendgroup: 'rings'
  });
}

// --- Hyperlanes config ---
const hyperlanes = [
  //Main Way
  ['Mustafar', 'Bespin', '#db8127', 'Main Way'],
  ['Bespin', 'Crait', '#db8127', 'Main Way'],
  ['Crait', 'Naboo', '#db8127', 'Main Way'],
  ['Naboo', 'Tatooine', '#db8127', 'Main Way'],
  ['Tatooine', 'Geonosis', '#db8127', 'Main Way'],
  ['Geonosis', 'Mandalore', '#db8127', 'Main Way'],
  ['Mandalore', 'Pyke', '#db8127', 'Main Way'],
  ['Pyke', 'Mustafar', '#db8127', 'Main Way'],
  // Jedi Passage
  ['Jakku', 'Tython', '#10ada8', 'Jedi Passage'],
  ['Tython', 'Coruscant', '#10ada8', 'Jedi Passage'],
  ['Coruscant', 'Ilum', '#10ada8', 'Jedi Passage'],
  // Beskar Smuggling Lane
  ['Coruscant', 'Corellia', '#0e1a82', 'Beskar Smuggling Lane'],
  ['Corellia', 'Mandalore', '#0e1a82', 'Beskar Smuggling Lane'],
  //Sith Passage
  ['Tython', 'Korriban', '#661212', 'Hidden Sith Passage'],
  //Naboo Lane
  ['Coruscant', 'Naboo', '#15e645', 'Naboo Lane'],
  //Bastion Bypass
  ['Crait', 'Bastion', '#e6e610', 'Bastion Bypass'],
  ['Bastion', 'Geonosis', '#e6e610', 'Bastion Bypass'],

  ['Mandalore', 'Korriban', '#661212', 'Korriban Run'],
];


const hyperlaneTraces = hyperlanes.map(([from, to, color, tooltip]) => {
  const p1 = planetMap[from];
  const p2 = planetMap[to];
  if (!p1 || !p2) return null;

  return {
    x: [p1.x, p2.x],
    y: [p1.y, p2.y],
    z: [p1.z, p2.z],
    mode: 'lines',
    type: 'scatter3d',
    line: { color, width: 3 },
    text: tooltip || `${from} → ${to}`,
    hoverinfo: 'text',
    name: tooltip || `${from} → ${to}`,
    showlegend: false,
    legendgroup: 'hyperlanes'
  };
}).filter(Boolean);


const layout = {
  margin: { l: 0, r: 0, b: 0, t: 30 },
  scene: {
    xaxis: { visible: false },
    yaxis: { visible: false },
    zaxis: { visible: false },
    camera: {
      center: { x: 0, y: 0, z: 0 },
      eye: { x: 2, y: 2, z: 1.5 }
    }
  },
  paper_bgcolor: '#000',
  plot_bgcolor: '#000',
  title: 'Space Engineers Planet Map'
};

Plotly.newPlot('map', [planetTrace, ...ringTraces, ...hyperlaneTraces], layout);

// --- Handle Click and Sidebar ---
const mapDiv = document.getElementById('map');
const sidebar = document.getElementById('sidebar');
const planetNameEl = document.getElementById('planet-name');
const planetDetailsEl = document.getElementById('planet-details');

mapDiv.on('plotly_click', function (data) {
  const pt = data.points[0];
  if (!pt || pt.data.type !== 'scatter3d') return;

  const name = pt.text;
  const planet = planetMap[name];
  if (!planet) return;

  // Show detailed info in sidebar
  sidebar.style.display = 'block';
  planetNameEl.textContent = planet.name;
  planetDetailsEl.innerHTML = (planetConfig[planet.name]?.info || planet.tooltip)
    .replace(/\*\*(.*?)\*\*/g, '<b>$1</b>')
    .replace(/\n/g, '<br>');
});
