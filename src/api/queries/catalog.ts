import { useQuery } from '@tanstack/react-query';
import { GAME_REGISTRY } from '@/games/registry';
import { GameDefinition } from '@/games/types';
import { readJSON, writeJSON } from '@/storage/mmkv';

const CACHE_KEY = 'catalog.cache';

interface CatalogCache {
  games: GameDefinition[];
  fetchedAt: number;
}

/**
 * Placeholder catalog fetch. In a real deployment this would hit the backend
 * for live game metadata/art; for now it resolves the local registry so the
 * app has a real network+cache path to build on. Falls back to the cached
 * payload (or the bundled registry) when offline.
 */
async function fetchCatalog(): Promise<GameDefinition[]> {
  // No live catalog endpoint yet — resolve the local registry as the source
  // of truth and cache it, matching the shape a future API response would take.
  return Promise.resolve(GAME_REGISTRY);
}

export function useCatalog() {
  return useQuery({
    queryKey: ['catalog'],
    queryFn: async () => {
      try {
        const games = await fetchCatalog();
        writeJSON<CatalogCache>(CACHE_KEY, { games, fetchedAt: Date.now() });
        return games;
      } catch (err) {
        const cached = readJSON<CatalogCache>(CACHE_KEY);
        if (cached) return cached.games;
        return GAME_REGISTRY;
      }
    },
    initialData: () => readJSON<CatalogCache>(CACHE_KEY)?.games ?? GAME_REGISTRY,
    staleTime: 5 * 60 * 1000,
  });
}
