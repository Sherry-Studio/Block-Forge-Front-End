import { readJSON, writeJSON, StorageKeys } from './mmkv';

export interface LocalStats {
  bestScore: number;
  runsPlayed: number;
  totalLinesCleared: number;
  totalBlocksPlaced: number;
  bestCombo: number;
}

export interface StreakInfo {
  lastPlayedISODate?: string;
  currentStreak: number;
}

const emptyStats: LocalStats = {
  bestScore: 0,
  runsPlayed: 0,
  totalLinesCleared: 0,
  totalBlocksPlaced: 0,
  bestCombo: 0,
};

/**
 * Local (offline-first) score/stats history. A future ScoreSyncService can
 * push these to the backend leaderboard when the outbox flushes; the screens
 * only ever read/write through this repository.
 */
export const ScoreRepository = {
  getStats(): LocalStats {
    return readJSON<LocalStats>(StorageKeys.statsLocal) ?? emptyStats;
  },

  recordRunEnd(input: {
    score: number;
    linesCleared: number;
    blocksPlaced: number;
    bestCombo: number;
  }): LocalStats {
    const prev = this.getStats();
    const next: LocalStats = {
      bestScore: Math.max(prev.bestScore, input.score),
      runsPlayed: prev.runsPlayed + 1,
      totalLinesCleared: prev.totalLinesCleared + input.linesCleared,
      totalBlocksPlaced: prev.totalBlocksPlaced + input.blocksPlaced,
      bestCombo: Math.max(prev.bestCombo, input.bestCombo),
    };
    writeJSON(StorageKeys.statsLocal, next);
    return next;
  },

  getStreak(): StreakInfo {
    return readJSON<StreakInfo>(StorageKeys.streak) ?? { currentStreak: 0 };
  },

  recordDailyCompletion(isoDate: string): StreakInfo {
    const prev = this.getStreak();
    const yesterday = new Date(isoDate);
    yesterday.setUTCDate(yesterday.getUTCDate() - 1);
    const wasConsecutive = prev.lastPlayedISODate === yesterday.toISOString().slice(0, 10);
    const next: StreakInfo = {
      lastPlayedISODate: isoDate,
      currentStreak: wasConsecutive ? prev.currentStreak + 1 : 1,
    };
    writeJSON(StorageKeys.streak, next);
    return next;
  },
};
