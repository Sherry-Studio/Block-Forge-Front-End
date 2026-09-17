export type GameCategory =
  | 'Puzzle'
  | 'Strategy'
  | 'Action'
  | 'Arcade'
  | 'Racing'
  | 'Adventure';

export type GameStatus = 'playable' | 'coming_soon' | 'locked';

export interface GameDefinition {
  id: string;
  title: string;
  category: GameCategory;
  description: string;
  /** Name of an icon glyph rendered by the games hub / cards. */
  icon: string;
  /** Artwork key; falls back to a gradient placeholder when absent. */
  artwork?: string;
  status: GameStatus;
  playable: boolean;
  /** Route name within the app's navigation graph, if playable. */
  route?: string;
  /** Accent color (hex) used for this game's cards, badges and glows. */
  accent: string;
  version: string;
  features: string[];
}
