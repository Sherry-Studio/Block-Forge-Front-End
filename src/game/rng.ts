/**
 * Small deterministic PRNGs used by the game engine. `mulberry32` is used to
 * seed the daily challenge from the UTC date so every player sees the same
 * sequence of pieces that day.
 */

export type RngFn = () => number;

export function mulberry32(seed: number): RngFn {
  let a = seed >>> 0;
  return function next() {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Deterministic seed derived from a UTC calendar date, e.g. for daily challenges. */
export function seedFromUTCDate(date: Date = new Date()): number {
  const y = date.getUTCFullYear();
  const m = date.getUTCMonth() + 1;
  const d = date.getUTCDate();
  // Simple, stable numeric hash of YYYYMMDD.
  return y * 10000 + m * 100 + d;
}

export function randomSeed(): number {
  return Math.floor(Math.random() * 0xffffffff);
}

export function pickInt(rng: RngFn, maxExclusive: number): number {
  return Math.floor(rng() * maxExclusive);
}
