const ringCount = 5;
const ringSpacing = 5000000;
const ringSegments = 100;

const planetConfig = {
  Tatooine: { tooltip: "Desert world" },
  Pyke: { tooltip: "Trade and spice route hub." },
  Jakku: { tooltip: "Remote desert planet." },
  Bastion: { tooltip: "Imperial stronghold." },
  Mandalore: { tooltip: "Homeworld of Mandalorians." },
  Crait: { tooltip: "Salt-covered planet." },
  Bespin: { tooltip: "Gas giant" },
  Mustafar: { tooltip: "Volcanic world." },
  Ilum: { tooltip: "Jedi Kyber crystal source." },
  Korriban: { tooltip: "Ancient Sith homeworld." },
  Corellia: { tooltip: "Shipbuilding planet." },
  Naboo: { tooltip: "Peaceful planet with lakes." },
  Tython: { tooltip: "Ancient Jedi world." }
};

const hyperlaneConfig = [
  { from: 'Tatooine', to: 'Pyke', color: '#FF9900', tooltip: 'Tatooine Run' },
  { from: 'Pyke', to: 'Jakku', color: '#00FF00', tooltip: 'Main Ring' },
  { from: 'Jakku', to: 'Bastion', color: '#00FF00', tooltip: 'Main Ring' },
  { from: 'Bastion', to: 'Mandalore', color: '#00FF00', tooltip: 'Main Ring' },
  { from: 'Mandalore', to: 'Crait', color: '#00FF00', tooltip: 'Main Ring' },
  { from: 'Crait', to: 'Pyke', color: '#00FF00', tooltip: 'Main Ring' },

  { from: 'Jakku', to: 'Bespin', color: '#00FF99', tooltip: 'Spice Corridor' },
  { from: 'Bespin', to: 'Mustafar', color: '#00FF99', tooltip: 'Spice Corridor' },

  { from: 'Bastion', to: 'Ilum', color: '#6699FF', tooltip: 'Kyber Path' },
  { from: 'Crait', to: 'Korriban', color: '#FF0000', tooltip: 'Sith Trail' },

  { from: 'Corellia', to: 'Naboo', color: '#33CCCC', tooltip: 'Core Link 1' },
  { from: 'Corellia', to: 'Jakku', color: '#33CCCC', tooltip: 'Core Link 2' },
  { from: 'Corellia', to: 'Tython', color: '#33CCCC', tooltip: 'Core Link 3' },
  { from: 'Naboo', to: 'Crait', color: '#CCCC33', tooltip: 'Hidden Passage' }
];

const rawGPS = `
GPS:Tatooine:-29606794.27:156033.19:-9151843.11:#FF75C9F1:Planet:
GPS:Pyke:-13920710.13:13101655.64:4785605.51:#FF75C9F1:Planet:
GPS:Jakku:-3373702.94:15480524.55:12708161.67:#FF75C9F1:Planet:
GPS:Bastion:10717941.65:10012582.79:7284448.57:#FF75C9F1:Planet:
GPS:Mandalore:12390854.08:-19771538.72:-18193121.65:#FF75C9F1:Planet:
GPS:Crait:-12807650.86:-3493638.27:-7557217.55:#FF75C9F1:Planet:
GPS:Bespin:-9790758.94:26297767.47:23050251.97:#FF75C9F1:Planet:
GPS:Mustafar:-15102791.61:30764249.49:26189435.53:#FF75C9F1:Planet:
GPS:Ilum:24265279.98:554487.17:8810240.2:#FF75C9F1:Planet:
GPS:Korriban:6637184.57:-33819435.99:-34221584.72:#FF75C9F1:Planet:
GPS:Corellia:4500000:-15000000:5000000:#FF75C9F1:Planet:
GPS:Naboo:-9072091.47:-3860666.85:-6775230.74:#FF75C9F1:Planet:
GPS:Tython:-186164.01:-2062907.33:-2442934.75:#FF75C9F1:Planet:
`;

function createRing(radius) {
  const step = (2 * Math.PI) / ringSegments;
  const x = [], y = [], z = [];
  for (let i = 0; i <= ringSegments; i++) {
    const angle = i * step;
    x.push(Math.cos(angle) * radius);
    y.push(0); // Rings are flat on Y=0
    z.push(Math.sin(angle) * radius);
  }
  return { x, y, z };
}

const planetData = rawGPS.trim().split('\n').map(line => {
  const parts = line.split(':');
  const name = parts[1];
  return {
    name,
    x: parseFloat(parts[2]),
    y: parseFloat(parts[3]),
    z: parseFloat(parts[4]),
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

const hyperlaneTraces = hyperlaneConfig.map((lane, i) => {
  const a = planetMap[lane.from];
  const b = planetMap[lane.to];
  if (!a || !b) return null;
  return {
    x: [a.x, b.x],
    y: [a.y, b.y],
    z: [a.z, b.z],
    mode: 'lines',
    type: 'scatter3d',
    line: {
      color: lane.color || '#FF9900',
      width: 2
    },
    hovertext: lane.tooltip || `${lane.from} ↔ ${lane.to}`,
    hoverinfo: 'text',
    name: i === 0 ? 'Hyperlanes' : undefined,
    showlegend: i === 0,
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
      eye: { x: 1.7, y: 1.2, z: 1.5 }
    }
  },
  paper_bgcolor: '#000',
  plot_bgcolor: '#000',
  title: 'Space Engineers Planet Map (3D)'
};

Plotly.newPlot('map', [
  planetTrace,
  ...ringTraces,
  ...hyperlaneTraces
], layout);
