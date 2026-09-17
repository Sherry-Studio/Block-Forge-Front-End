import { RunState } from '@/game/engine';
import { readJSON, remove, StorageKeys, writeJSON } from './mmkv';

/**
 * Persists the single in-progress run. Classic play is fully offline and
 * never touches the network — this repository is the only thing gameplay
 * talks to for save/resume.
 */
export const GameRepository = {
  saveActiveRun(run: RunState): void {
    writeJSON(StorageKeys.runActive, run);
  },
  loadActiveRun(): RunState | undefined {
    return readJSON<RunState>(StorageKeys.runActive);
  },
  clearActiveRun(): void {
    remove(StorageKeys.runActive);
  },
  hasActiveRun(): boolean {
    return this.loadActiveRun() !== undefined;
  },
};
