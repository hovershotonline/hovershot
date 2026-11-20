// Hover Shot — Lab 02: deterministic local artillery experiment.
// All gameplay values and graphics are original; the historical game is a mechanics reference.
export const WORLD = Object.freeze({ width: 1200, height: 620, floor: 607, gravity: 440, step: 1 / 90 });
export const MOBILES = Object.freeze([
  { id: 'aduka', name: 'Aduka', class: 'Eletricidade', color: '#7ed5fb', accent: '#a68bff', hp: 110, speed: 1.0,
    shots: [
      { label: 'Pulso', damage: 29, radius: 33, speed: 1, count: 1, spread: 0, color: '#7bdaff', charge: 0 },
      { label: 'Trio Thor', damage: 17, radius: 25, speed: 1, count: 3, spread: 3.8, color: '#b69bff', charge: 1 },
      { label: 'Tempestade SS', damage: 60, radius: 67, speed: .91, count: 1, spread: 0, color: '#dbb1ff', charge: 3 }
    ] },
  { id: 'bastiao', name: 'Bastião', class: 'Armadura', color: '#ffc176', accent: '#eb7958', hp: 130, speed: .91,
    shots: [
      { label: 'Projétil', damage: 33, radius: 37, speed: 1, count: 1, spread: 0, color: '#ffc176', charge: 0 },
      { label: 'Artilharia', damage: 28, radius: 54, speed: .88, count: 1, spread: 0, color: '#ff8768', charge: 0 },
      { label: 'Meteoro SS', damage: 65, radius: 80, speed: .85, count: 1, spread: 0, color: '#ffe4a7', charge: 0 }
    ] },
  { id: 'cometa', name: 'Cometa', class: 'Precisão', color: '#afe68b', accent: '#6abf90', hp: 100, speed: 1.1,
    shots: [
      { label: 'Lança', damage: 33, radius: 24, speed: 1.09, count: 1, spread: 0, color: '#c3f88e', charge: 0 },
      { label: 'Fragmentação', damage: 18, radius: 23, speed: 1.02, count: 3, spread: 5.3, color: '#9dfacc', charge: 0 },
      { label: 'Supernova SS', damage: 56, radius: 61, speed: 1.0, count: 1, spread: 0, color: '#defba0', charge: 0 }
    ] },
  { id: 'sentinela', name: 'Sentinela', class: 'Controle', color: '#ff9bba', accent: '#db6cbd', hp: 115, speed: .98,
    shots: [
      { label: 'Íon', damage: 30, radius: 32, speed: 1, count: 1, spread: 0, color: '#ffa0ce', charge: 0 },
      { label: 'Satélites', damage: 22, radius: 30, speed: .97, count: 2, spread: 5, color: '#e9b4f3', charge: 0 },
      { label: 'Eclipse SS', damage: 62, radius: 68, speed: .93, count: 1, spread: 0, color: '#fca4ee', charge: 0 }
    ] }
]);
export const clamp = (x, min, max) => Math.min(max, Math.max(min, x));
export function makeRng(seed) {
  let x = (Number(seed) >>> 0) || 1;
  return () => { x = (x + 0x6D2B79F5) | 0; let t = Math.imul(x ^ (x >>> 15), 1 | x); t ^= t + Math.imul(t ^ (t >>> 7), 61 | t); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
}
export function makeTerrain(seed) {
  const rand = makeRng(seed);
  const a = rand() * 6.28, b = rand() * 6.28, c = rand() * 6.28;
  const heights = Array.from({ length: WORLD.width }, (_, x) => {
    let h = 427 + Math.sin(x / 126 + a) * 42 + Math.sin(x / 65 + b) * 21 + Math.sin(x / 29 + c) * 7;
    h += Math.exp(-(((x - 605) / 190) ** 2)) * 40;
    return Math.round(clamp(h, 350, 510));
  });
  for (const cx of [180, 1020]) {
    const base = heights[cx];
    for (let x = cx - 45; x <= cx + 45; x++) if (x >= 0 && x < heights.length) {
      const strength = clamp((45 - Math.abs(x - cx)) / 15, 0, 1);
      heights[x] = Math.round(heights[x] * (1 - strength) + base * strength);
    }
  }
  return heights;
}
export function createMatch({ seed = 20261119, mobiles = ['aduka', 'bastiao'] } = {}) {
  const terrain = makeTerrain(seed);
  const ids = mobiles.map(id => MOBILES.find(m => m.id === id) ? id : 'aduka');
  const players = [0, 1].map(i => {
    const mobile = MOBILES.find(m => m.id === ids[i]);
    const x = i === 0 ? 180 : 1020;
    return { id: i, mobile: mobile.id, name: i === 0 ? 'AZUL' : 'LARANJA',
      x, y: terrain[x] - 18, hp: mobile.hp, maxHp: mobile.hp, angle: i === 0 ? 50 : 130,
      power: 75, moved: 0, ssReadyAt: 3 };
  });
  const state = { seed, rng: makeRng(seed + 17), terrain, players, active: 0, turn: 1,
    phase: 'aim', wind: 0, thorLevel: 0, thorCharge: 0, weapon: 0, dual: false,
    shells: [], impacts: [], logs: [], settleTicks: 0, winner: null };
  state.wind = Math.round((state.rng() - .5) * 24);
  return state;
}
export function getMobile(player) { return MOBILES.find(m => m.id === player.mobile) ?? MOBILES[0]; }
export function selectWeapon(state, index) {
  if (state.phase !== 'aim' || !Number.isInteger(index) || index < 0 || index > 2) return false;
  if (index === 2 && state.turn < state.players[state.active].ssReadyAt) return false;
  state.weapon = index;
  if (index === 2) state.dual = false;
  return true;
}
export function toggleDual(state) {
  if (state.phase !== 'aim' || state.weapon === 2) return false;
  state.dual = !state.dual; return true;
}
export function setAim(state, angle, power) {
  if (state.phase !== 'aim') return false;
  const p = state.players[state.active];
  p.angle = clamp(Number(angle) || 0, 10, 170);
  p.power = clamp(Number(power) || 0, 10, 100);
  return true;
}
export function movePlayer(state, dx) {
  if (state.phase !== 'aim') return false;
  const p = state.players[state.active], target = clamp(Math.round(p.x + dx), 30, WORLD.width - 30);
  const other = state.players[1 - state.active];
  if (Math.abs(target - other.x) < 55 || p.moved + Math.abs(target - p.x) > 48) return false;
  p.moved += Math.abs(target - p.x); p.x = target; p.y = state.terrain[target] - 18;
  return true;
}
export function launch(state) {
  if (state.phase !== 'aim') return false;
  const player = state.players[state.active];
  const mobile = getMobile(player), shot = mobile.shots[state.weapon];
  const theta = player.angle * Math.PI / 180;
  const speed = (290 + player.power * 3.65) * mobile.speed * shot.speed;
  const salvos = state.dual && state.weapon !== 2 ? 2 : 1;
  state.shells = [];
  for (let salvo = 0; salvo < salvos; salvo++) {
    for (let i = 0; i < shot.count; i++) {
      const offset = (i - (shot.count - 1) / 2) * shot.spread * Math.PI / 180;
      const angle = theta + offset;
      state.shells.push({ x: player.x + Math.cos(angle) * 27, y: player.y - 12 - Math.sin(angle) * 27,
        vx: Math.cos(angle) * speed, vy: -Math.sin(angle) * speed,
        life: 0, delay: salvo * .3 + i * .07, owner: state.active,
        damage: shot.damage, radius: shot.radius, color: shot.color, charge: shot.charge,
        type: state.weapon });
    }
  }
  state.logs.unshift({ turn: state.turn, owner: state.active, mobile: mobile.name,
    weapon: state.weapon, dual: state.dual, angle: player.angle, power: player.power, wind: state.wind });
  state.logs.length = Math.min(20, state.logs.length);
  if (state.weapon === 2) player.ssReadyAt = state.turn + 6;
  state.phase = 'flight'; state.dual = false;
  return true;
}
function explosion(state, shell, x, y) {
  const r = shell.radius;
  for (let i = Math.max(0, Math.floor(x-r)); i < Math.min(WORLD.width, Math.ceil(x+r)); i++) {
    const dx = (i - x) / r;
    const deformation = Math.sqrt(Math.max(0, 1-dx*dx)) * r * .72;
    state.terrain[i] = Math.min(WORLD.floor, state.terrain[i] + deformation);
  }
  state.impacts.push({ x, y, radius: r, damage: shell.damage, color: shell.color, ticks: 55, flash: 1 });
  for (const p of state.players) {
    const d = Math.hypot(p.x - x, (p.y - 8) - y);
    if (d < r + 24) {
      const damage = Math.max(0, Math.round(shell.damage * clamp(1 - d / (r + 24), 0, 1)));
      p.hp = Math.max(0, p.hp - damage);
      if (damage) state.impacts.push({ x:p.x, y:p.y-48, text:'−'+damage, ticks:65, color:'#fff7cc' });
    }
  }
  if (shell.charge && state.players[shell.owner].mobile === 'aduka') {
    state.thorCharge += shell.charge;
    while (state.thorCharge >= 3) {
      state.thorCharge -= 3; state.thorLevel = Math.min(5, state.thorLevel + 1);
    }
    if (state.thorLevel) {
      const enemy = state.players[1 - shell.owner];
      const d = Math.abs(enemy.x - x);
      if (d < r + 26) {
        const extra = Math.round(3 + state.thorLevel * 3);
        enemy.hp = Math.max(0, enemy.hp - extra);
        state.impacts.push({ x:enemy.x,y:enemy.y-72,text:'⚡ −'+extra,ticks:75,color:'#d3acff' });
      }
    }
  }
  for (const p of state.players) {
    const drop = state.terrain[Math.round(p.x)] - 18 - p.y;
    if (drop > 25) p.hp = Math.max(0, p.hp - Math.round((drop-25)*.08));
    p.y = state.terrain[Math.round(p.x)] - 18;
  }
}
export function stepMatch(state, dt = WORLD.step) {
  if (state.phase !== 'flight' && state.phase !== 'settle') return;
  for (const impact of state.impacts) impact.ticks -= 1;
  state.impacts = state.impacts.filter(x => x.ticks > 0);
  if (state.phase === 'flight') {
    const next = [];
    for (const shell of state.shells) {
      if (shell.delay > 0) { shell.delay -= dt; next.push(shell); continue; }
      shell.life += dt; shell.vx += state.wind * 2.3 * dt; shell.vy += WORLD.gravity * dt;
      shell.x += shell.vx * dt; shell.y += shell.vy * dt;
      const xi = Math.round(shell.x);
      if (shell.life > 7 || xi < 0 || xi >= WORLD.width || shell.y >= WORLD.floor + 25) continue;
      let hit = shell.y >= state.terrain[xi];
      if (!hit) for (const p of state.players) if (Math.hypot(shell.x - p.x, shell.y - p.y) < 17 && shell.life > .15) { hit = true; break; }
      if (hit) explosion(state, shell, shell.x, Math.min(shell.y, state.terrain[xi]));
      else next.push(shell);
    }
    state.shells = next;
    if (!next.length) { state.phase = 'settle'; state.settleTicks = 76; }
  } else {
    state.settleTicks--;
    if (state.settleTicks <= 0) {
      const survivors = state.players.filter(p => p.hp > 0);
      if (survivors.length <= 1) {
        state.winner = survivors[0]?.id ?? -1; state.phase = 'over'; return;
      }
      state.turn++; state.active = 1 - state.active; state.weapon = 0; state.dual = false;
      state.wind = Math.round((state.rng() - .5) * 24);
      state.players[state.active].moved = 0; state.phase = 'aim'; state.impacts = [];
    }
  }
}
export function skipTurn(state) {
  if (state.phase !== 'aim') return false;
  state.phase = 'settle'; state.settleTicks = 1; return true;
}
