import { Agent, parseAndExecute } from './ai.js';
import { log } from './util.js';
import { initVoice } from './voice.js';
import { World } from './world.js';

const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');

const world = new World();
const agent = new Agent(world);

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  const tileSize = 16;
  const offsetX = 0,
    offsetY = 0;
  for (let y = 0; y < world.h; y++) {
    for (let x = 0; x < world.w; x++) {
      const t = world.get(x, y);
      let color = '#654';
      if (t === 'dirt') color = '#7b5e2a';
      if (t === 'stone') color = '#888';
      if (t === 'tree') color = '#0a5';
      ctx.fillStyle = color;
      ctx.fillRect(offsetX + x * tileSize, offsetY + y * tileSize, tileSize, tileSize);
    }
  }
  // agent
  ctx.fillStyle = '#ff0';
  ctx.fillRect(offsetX + agent.x * tileSize, offsetY + agent.y * tileSize, tileSize, tileSize);
  requestAnimationFrame(draw);
}

function loop() {
  agent.tick();
  setTimeout(loop, 150);
}

document.getElementById('runBtn').addEventListener('click', () => {
  const val = document.getElementById('commandInput').value;
  parseAndExecute(agent, val);
  document.getElementById('commandInput').value = '';
});

initVoice(agent);
draw();
loop();
log('Ready. Try: move north 2 | mine east | place south | scan | build tower | go to 10 10');
