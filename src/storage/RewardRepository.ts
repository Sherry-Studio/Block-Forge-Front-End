import { readJSON, writeJSON } from './mmkv';

export interface Achievement {
  id: string;
  title: string;
  description: string;
  state: 'locked' | 'in_progress' | 'unlocked' | 'claimed';
  progress: number;
  target: number;
}

const KEY = 'rewards.achievements';

const DEFAULT_ACHIEVEMENTS: Achievement[] = [
  { id: 'first-clear', title: 'First Clear', description: 'Clear your first line.', state: 'locked', progress: 0, target: 1 },
  { id: 'combo-4', title: 'Combo Master', description: 'Reach a x4 combo.', state: 'locked', progress: 0, target: 4 },
  { id: 'score-5000', title: 'High Roller', description: 'Score 5,000 points in one run.', state: 'locked', progress: 0, target: 5000 },
  { id: 'daily-streak-7', title: 'Week Streak', description: 'Complete 7 daily challenges in a row.', state: 'locked', progress: 0, target: 7 },
  { id: 'blocks-500', title: 'Block Layer', description: 'Place 500 blocks total.', state: 'locked', progress: 0, target: 500 },
];

/** Read-only-until-claim rewards store; claims get queued via the outbox when offline. */
export const RewardRepository = {
  getAchievements(): Achievement[] {
    return readJSON<Achievement[]>(KEY) ?? DEFAULT_ACHIEVEMENTS;
  },
  updateProgress(id: string, progress: number): Achievement[] {
    const list = this.getAchievements().map((a) => {
      if (a.id !== id) return a;
      const clamped = Math.min(progress, a.target);
      const state: Achievement['state'] =
        a.state === 'claimed' ? 'claimed' : clamped >= a.target ? 'unlocked' : clamped > 0 ? 'in_progress' : 'locked';
      return { ...a, progress: clamped, state };
    });
    writeJSON(KEY, list);
    return list;
  },
  claim(id: string): Achievement[] {
    const list = this.getAchievements().map((a) =>
      a.id === id && a.state === 'unlocked' ? { ...a, state: 'claimed' as const } : a,
    );
    writeJSON(KEY, list);
    return list;
  },
};
