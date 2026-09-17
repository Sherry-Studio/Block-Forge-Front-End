/**
 * Design tokens for Block Forge. Never hardcode a hex value in a component —
 * import from here so the whole app stays visually consistent and themeable.
 */

export const color = {
  bg: '#161826',
  boardWell: '#1a1c29',
  card: '#1d1f2e',
  raised: '#232532',
  hairline: '#2a2d3d',
  border: '#33364a',
  text: '#e9e9ed',
  textMuted: '#9397ab',
  textFaint: '#75798c',
  textDim: '#595d6c',
  accent: '#9184d9',
  accent300: '#d2cefd',
  accent100: '#e7e5fe',
  teal: '#3fb9a6',
  gold: '#e0c03c',
  danger: '#e0687f',
} as const;

/** [top-light, bottom-dark] gradient pairs, one per block color family. */
export const blocks: [string, string][] = [
  ['#8b7ff0', '#5a4ec2'],
  ['#3fb9a6', '#208276'],
  ['#e0a33c', '#ae7420'],
  ['#e0687f', '#a83e56'],
  ['#4aa8e6', '#2a74ac'],
  ['#9dc44a', '#6b8e2c'],
];

export const radius = { sm: 5, md: 8, lg: 12, xl: 20, pill: 999 } as const;

export const space = { xs: 4, sm: 8, md: 10, lg: 14, xl: 18, xxl: 22 } as const;

export const cellState = {
  emptyFill: color.card,
  emptyInset: '#262a3a',
  validAlpha: 0.53,
  invalidFill: 'rgba(224,104,127,.12)',
  invalidBorder: '#a83e56',
  clearFill: color.accent100,
};

export type ColorToken = keyof typeof color;
