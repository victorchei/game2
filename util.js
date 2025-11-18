export const DIRS = {
  north: { x: 0, y: -1 },
  south: { x: 0, y: 1 },
  west: { x: -1, y: 0 },
  east: { x: 1, y: 0 },
};

export function clamp(v, min, max) {
  return v < min ? min : v > max ? max : v;
}

export function log(msg) {
  const el = document.getElementById('log');
  const div = document.createElement('div');
  div.className = 'msg';
  div.textContent = msg;
  el.appendChild(div);
  el.scrollTop = el.scrollHeight;
}

export function randInt(a, b) {
  return Math.floor(Math.random() * (b - a + 1)) + a;
}
