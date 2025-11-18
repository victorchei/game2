import { randInt } from './util.js';

export class World {
  constructor(w = 50, h = 38) {
    this.w = w;
    this.h = h;
    this.grid = Array.from({ length: h }, (_, y) => Array.from({ length: w }, (_, x) => this.genTile(x, y)));
  }
  genTile(x, y) {
    if (y > this.h / 2 + randInt(-2, 3)) return 'stone';
    if (randInt(0, 100) < 4) return 'tree';
    return 'dirt';
  }
  inBounds(x, y) {
    return x >= 0 && y >= 0 && x < this.w && y < this.h;
  }
  get(x, y) {
    return this.inBounds(x, y) ? this.grid[y][x] : null;
  }
  set(x, y, val) {
    if (this.inBounds(x, y)) this.grid[y][x] = val;
  }
  isPassable(x, y) {
    const t = this.get(x, y);
    return t !== null && (t === 'dirt' || t === 'stone' || t === null || t === undefined); // tree blocks movement
  }
  remove(x, y) {
    if (!this.inBounds(x, y)) return false;
    this.grid[y][x] = 'dirt';
    return true;
  }
  place(x, y, type = 'dirt') {
    if (!this.inBounds(x, y)) return false;
    this.grid[y][x] = type;
    return true;
  }
}
