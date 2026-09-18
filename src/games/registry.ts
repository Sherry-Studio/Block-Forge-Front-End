import { color } from '@/theme/tokens';
import { GameDefinition } from './types';

/**
 * The single source of truth for every game on the platform. Home and
 * GamesHub render entirely from this list — adding a new game means adding
 * an entry here (see ARCHITECTURE.md), never touching those screens.
 */
export const GAME_REGISTRY: GameDefinition[] = [
  {
    id: 'blockforge',
    title: 'Block Forge',
    category: 'Puzzle',
    description:
      'Drag and drop blocks onto an 8x8 grid, clear rows and columns, and chain combos for a high score.',
    icon: 'grid',
    glyph: '▚',
    gradient: ['#3a3f7d', '#1b1d2e'],
    status: 'playable',
    playable: true,
    route: 'ClassicIntro',
    accent: color.accent,
    version: '1.0.0',
    features: ['Classic mode', 'Daily challenge', 'Leaderboards', 'Combo system'],
  },
  {
    id: 'color-shift',
    title: 'Color Shift',
    category: 'Puzzle',
    description: 'Match and shift color tiles across a shrinking board before time runs out.',
    icon: 'droplet',
    glyph: '◑',
    gradient: ['#4a2f63', '#1b1d2e'],
    status: 'coming_soon',
    playable: false,
    accent: color.teal,
    version: '0.0.0',
    features: ['Match-3 mechanics', 'Timed rounds'],
  },
  {
    id: 'grid-command',
    title: 'Grid Command',
    category: 'Strategy',
    description: 'Command units across a hex grid in turn-based tactical battles.',
    icon: 'shield',
    glyph: '⬢',
    gradient: ['#2b4160', '#1b1d2e'],
    status: 'coming_soon',
    playable: false,
    accent: color.gold,
    version: '0.0.0',
    features: ['Turn-based tactics', 'Unit customization'],
  },
  {
    id: 'empire-tactic',
    title: 'Empire Tactic',
    category: 'Strategy',
    description: 'Build and defend a sprawling empire against rival factions.',
    icon: 'castle',
    glyph: '▲',
    gradient: ['#2f4a49', '#1b1d2e'],
    status: 'coming_soon',
    playable: false,
    accent: color.gold,
    version: '0.0.0',
    features: ['Base building', 'Faction warfare'],
  },
  {
    id: 'neon-raid',
    title: 'Neon Raid',
    category: 'Action',
    description: 'Fast twin-stick combat through a neon-drenched cityscape.',
    icon: 'zap',
    glyph: '✦',
    gradient: ['#5c2b44', '#1b1d2e'],
    status: 'coming_soon',
    playable: false,
    accent: color.danger,
    version: '0.0.0',
    features: ['Twin-stick combat', 'Boss rushes'],
  },
  {
    id: 'orbit-rush',
    title: 'Orbit Rush',
    category: 'Arcade',
    description: 'Slingshot around orbiting planets to rack up an endless high score.',
    icon: 'orbit',
    glyph: '◎',
    gradient: ['#2b4f5c', '#1b1d2e'],
    status: 'coming_soon',
    playable: false,
    accent: color.accent,
    version: '0.0.0',
    features: ['Endless arcade loop', 'Global leaderboard'],
  },
  {
    id: 'street-pulse',
    title: 'Street Pulse',
    category: 'Racing',
    description: 'Drift through neon-lit streets in high-stakes underground races.',
    icon: 'flag',
    glyph: '➤',
    gradient: ['#5c4a2b', '#1b1d2e'],
    status: 'coming_soon',
    playable: false,
    accent: color.teal,
    version: '0.0.0',
    features: ['Drift racing', 'Car customization'],
  },
  {
    id: 'lost-signal',
    title: 'Lost Signal',
    category: 'Adventure',
    description: 'Explore a derelict station and piece together what happened to its crew.',
    icon: 'radio',
    glyph: '◈',
    gradient: ['#33355e', '#1b1d2e'],
    status: 'coming_soon',
    playable: false,
    accent: color.textMuted,
    version: '0.0.0',
    features: ['Narrative exploration', 'Puzzle solving'],
  },
];

export function getGameById(id: string): GameDefinition | undefined {
  return GAME_REGISTRY.find((g) => g.id === id);
}

export function getGamesByCategory(category: string): GameDefinition[] {
  return GAME_REGISTRY.filter((g) => g.category === category);
}

export function getPlayableGames(): GameDefinition[] {
  return GAME_REGISTRY.filter((g) => g.playable);
}

export const CATEGORIES: GameDefinition['category'][] = [
  'Puzzle',
  'Strategy',
  'Action',
  'Arcade',
  'Racing',
  'Adventure',
];
