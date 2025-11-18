export function aStar(world, start, goal) {
  const key = (p) => p.x + ',' + p.y;
  const open = new Set([key(start)]);
  const came = new Map();
  const g = new Map([[key(start), 0]]);
  const h = (p) => Math.abs(p.x - goal.x) + Math.abs(p.y - goal.y);
  const f = new Map([[key(start), h(start)]]);
  function neighbors(p) {
    return [
      { x: p.x + 1, y: p.y },
      { x: p.x - 1, y: p.y },
      { x: p.x, y: p.y + 1 },
      { x: p.x, y: p.y - 1 },
    ].filter((n) => world.inBounds(n.x, n.y) && world.get(n.x, n.y) !== 'tree');
  }
  while (open.size) {
    let current = null,
      cf = Infinity;
    for (const k of open) {
      const fv = f.get(k) ?? Infinity;
      if (fv < cf) {
        cf = fv;
        current = k;
      }
    }
    const [cx, cy] = current.split(',').map(Number);
    if (cx === goal.x && cy === goal.y) {
      const path = [];
      let ck = current;
      while (ck) {
        const [px, py] = ck.split(',').map(Number);
        path.push({ x: px, y: py });
        ck = came.get(ck);
      }
      return path.reverse();
    }
    open.delete(current);
    for (const n of neighbors({ x: cx, y: cy })) {
      const nk = key(n);
      const tentative = (g.get(current) || Infinity) + 1;
      if (tentative < (g.get(nk) || Infinity)) {
        came.set(nk, current);
        g.set(nk, tentative);
        f.set(nk, tentative + h(n));
        open.add(nk);
      }
    }
  }
  return null;
}
