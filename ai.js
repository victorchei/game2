import { aStar } from './pathfinding.js';
import { DIRS, log } from './util.js';

export class Agent {
  constructor(world) {
    this.world = world;
    this.x = 5;
    this.y = 5;
    this.queue = [];
    this.busy = false;
    this.inventory = { dirt: 0, stone: 0, wood: 0 };
  }
  enqueue(fn) {
    this.queue.push(fn);
  }
  tick() {
    if (this.busy) return;
    const job = this.queue.shift();
    if (job) {
      job();
    }
  }
  move(dx, dy) {
    const nx = this.x + dx,
      ny = this.y + dy;
    const tile = this.world.get(nx, ny);
    if (tile === 'tree') {
      log('Blocked by tree');
      return;
    }
    if (this.world.inBounds(nx, ny)) {
      this.x = nx;
      this.y = ny;
    }
  }
  pathTo(tx, ty) {
    const path = aStar(this.world, { x: this.x, y: this.y }, { x: tx, y: ty });
    if (!path) {
      log('No path');
      return;
    }
    for (const step of path.slice(1)) {
      this.enqueue(() => this.move(step.x - this.x, step.y - this.y));
    }
  }
  mine(dir) {
    const d = DIRS[dir];
    if (!d) {
      log('Bad dir');
      return;
    }
    const tx = this.x + d.x,
      ty = this.y + d.y;
    const t = this.world.get(tx, ty);
    if (t === 'stone') {
      this.inventory.stone++;
    }
    if (t === 'tree') {
      this.inventory.wood++;
    }
    if (t) {
      this.world.remove(tx, ty);
      log('Mined ' + t);
    }
  }
  place(dir) {
    const d = DIRS[dir];
    if (!d) {
      log('Bad dir');
      return;
    }
    const tx = this.x + d.x,
      ty = this.y + d.y;
    if (this.world.get(tx, ty) === 'tree') {
      log('Cannot place on tree');
      return;
    }
    this.world.place(tx, ty, 'dirt');
    log('Placed dirt');
  }
  scan() {
    let out = [];
    for (let yy = this.y - 2; yy <= this.y + 2; yy++) {
      let row = [];
      for (let xx = this.x - 2; xx <= this.x + 2; xx++) {
        row.push(this.world.get(xx, yy)?.[0] ?? ' ');
      }
      out.push(row.join(''));
    }
    log('Scan:\n' + out.join('\n'));
  }
  buildTower(height = 3) {
    for (let i = 1; i <= height; i++) {
      this.enqueue(() => {
        this.world.place(this.x, this.y - i, 'dirt');
        log('Built layer ' + i);
      });
    }
  }
}

export function parseAndExecute(agent, text) {
  const raw = text.trim().toLowerCase();
  if (!raw) {
    return;
  }
  // Patterns
  if (/^move /.test(raw)) {
    // move north 3
    const parts = raw.split(/\s+/);
    const dir = parts[1];
    const steps = parseInt(parts[2] || '1', 10);
    const d = DIRS[dir];
    if (!d) {
      log('Unknown direction');
      return;
    }
    for (let i = 0; i < steps; i++) agent.enqueue(() => agent.move(d.x, d.y));
    log('Queued move ' + dir + ' ' + steps);
    return;
  }
  if (/^go to /.test(raw)) {
    // go to x y
    const parts = raw.split(/\s+/);
    const x = parseInt(parts[2], 10);
    const y = parseInt(parts[3], 10);
    if (isNaN(x) || isNaN(y)) {
      log('Bad coords');
      return;
    }
    agent.pathTo(x, y);
    log('Path requested');
    return;
  }
  if (/^mine /.test(raw)) {
    const dir = raw.split(/\s+/)[1];
    agent.enqueue(() => agent.mine(dir));
    log('Queued mine ' + dir);
    return;
  }
  if (/^place /.test(raw)) {
    const dir = raw.split(/\s+/)[1];
    agent.enqueue(() => agent.place(dir));
    log('Queued place ' + dir);
    return;
  }
  if (/^scan/.test(raw)) {
    agent.enqueue(() => agent.scan());
    log('Queued scan');
    return;
  }
  if (/^build tower/.test(raw)) {
    agent.buildTower(4);
    log('Queued tower');
    return;
  }
  if (/^inventory/.test(raw)) {
    log('Inventory ' + JSON.stringify(agent.inventory));
    return;
  }
  log('Unknown command');
}
