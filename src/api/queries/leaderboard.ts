import { useQuery } from '@tanstack/react-query';
import { ScoreRepository } from '@/storage/ScoreRepository';

export type LeaderboardScope = 'global' | 'weekly' | 'friends';

export interface LeaderboardEntry {
  rank: number;
  name: string;
  score: number;
  isLocalPlayer?: boolean;
}

/**
 * Mock/local leaderboard repository. Real backend integration slots in here
 * later without screens changing — Leaderboard.tsx only calls this hook.
 */
async function fetchLeaderboard(scope: LeaderboardScope): Promise<LeaderboardEntry[]> {
  // No backend yet: throw so callers fall back to the offline/local view.
  throw new Error('offline');
}

export function useLeaderboard(scope: LeaderboardScope) {
  return useQuery({
    queryKey: ['leaderboard', scope],
    queryFn: () => fetchLeaderboard(scope),
    retry: false,
  });
}

export function getLocalBestEntry(): LeaderboardEntry {
  const stats = ScoreRepository.getStats();
  return { rank: 0, name: 'You', score: stats.bestScore, isLocalPlayer: true };
}
