import { create } from 'zustand';
import { GAME_REGISTRY } from '@/games/registry';
import { GameDefinition } from '@/games/types';

interface CatalogStore {
  games: GameDefinition[];
  setGames: (games: GameDefinition[]) => void;
}

/** Thin Zustand mirror of the catalog query result, so non-hook consumers
 * (e.g. deep link resolution) can read the current catalog synchronously. */
export const useCatalogStore = create<CatalogStore>((set) => ({
  games: GAME_REGISTRY,
  setGames: (games) => set({ games }),
}));
