import { create } from 'zustand';
import { LocalStats, ScoreRepository, StreakInfo } from '@/storage/ScoreRepository';

interface UserStore {
  stats: LocalStats;
  streak: StreakInfo;
  refresh: () => void;
}

export const useUserStore = create<UserStore>((set) => ({
  stats: ScoreRepository.getStats(),
  streak: ScoreRepository.getStreak(),
  refresh: () => set({ stats: ScoreRepository.getStats(), streak: ScoreRepository.getStreak() }),
}));
