import { TextStyle } from 'react-native';

type TypeSpec = {
  size: number;
  weight: TextStyle['fontWeight'];
  tracking?: number;
  lineHeight?: number;
  upper?: boolean;
};

export const type: Record<'display' | 'h1' | 'h2' | 'body' | 'caption' | 'badge', TypeSpec> = {
  display: { size: 42, weight: '600', tracking: -1.2 },
  h1: { size: 26, weight: '600', tracking: -0.5 },
  h2: { size: 18, weight: '600' },
  body: { size: 12.5, weight: '400', lineHeight: 1.55 },
  caption: { size: 10.5, weight: '400' },
  badge: { size: 9, weight: '500', tracking: 1.3, upper: true },
};

/** Converts a token into a RN TextStyle. `scale` supports dynamic type up to 1.3x. */
export function textStyle(token: keyof typeof type, scale = 1): TextStyle {
  const spec = type[token];
  const clampedScale = Math.min(scale, 1.3);
  const style: TextStyle = {
    fontSize: spec.size * clampedScale,
    fontWeight: spec.weight,
    letterSpacing: spec.tracking,
    textTransform: spec.upper ? 'uppercase' : undefined,
  };
  if (spec.lineHeight) {
    style.lineHeight = spec.size * clampedScale * spec.lineHeight;
  }
  return style;
}

/** Tabular numerals for scores/coins/counters. */
export const tabularNums: TextStyle = {
  fontVariant: ['tabular-nums'],
};
