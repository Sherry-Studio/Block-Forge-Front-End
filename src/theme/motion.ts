/**
 * Motion durations/specs shared across the app. Components should read these
 * through the `useMotion` hook (src/game/hooks or per-screen) which zeroes
 * durations when reduced-motion is on, rather than importing raw numbers.
 */
export const motion = {
  pieceLift: { duration: 120, scaleTo: 0.86, opacityTo: 0.35 },
  snapPlace: { damping: 18, stiffness: 220 },
  invalidDrop: { duration: 200 },
  lineClear: { duration: 230 },
  scorePop: { duration: 700, rise: 38 },
  comboAppear: { duration: 250, rise: 14 },
  almostFullPulse: { duration: 1200 },
  noValidMoveShake: { duration: 400 },
  gameOverCard: { duration: 280, rise: 14 },
  revived: { duration: 1100 },
} as const;

export type MotionKey = keyof typeof motion;
