import { create } from 'zustand';
import { RunState, createRun, place as engineePlace } from '@/game/engine';
import { GameRepository } from '@/storage/GameRepository';
import { ScoreRepository } from '@/storage/ScoreRepository';

interface GameStore {
  run: RunState | null;
  lastGain: number;
  lastClearedIndices: number[];
  isGameOver: boolean;
  startNewRun: (seed?: number) => void;
  resumeRun: () => boolean;
  placeAt: (trayIndex: number, row: number, col: number) => void;
  endRun: () => void;
  clearRun: () => void;
}

export const useGameStore = create<GameStore>((set, get) => ({
  run: null,
  lastGain: 0,
  lastClearedIndices: [],
  isGameOver: false,

  startNewRun: (seed) => {
    const run = createRun(seed);
    GameRepository.saveActiveRun(run);
    set({ run, lastGain: 0, lastClearedIndices: [], isGameOver: false });
  },

  resumeRun: () => {
    const saved = GameRepository.loadActiveRun();
    if (!saved) return false;
    set({ run: saved, lastGain: 0, lastClearedIndices: [], isGameOver: false });
    return true;
  },

  placeAt: (trayIndex, row, col) => {
    const { run } = get();
    if (!run) return;
    const result = engineePlace(run, trayIndex, row, col);
    GameRepository.saveActiveRun(result.nextState);
    set({
      run: result.nextState,
      lastGain: result.gain,
      lastClearedIndices: result.clearedIndices,
      isGameOver: result.isGameOver,
    });
  },

  endRun: () => {
    const { run } = get();
    if (run) {
      ScoreRepository.recordRunEnd({
        score: run.score,
        linesCleared: run.lines,
        blocksPlaced: run.placed,
        bestCombo: run.bestCombo,
      });
    }
    GameRepository.clearActiveRun();
    set({ run: null, isGameOver: false });
  },

  clearRun: () => {
    GameRepository.clearActiveRun();
    set({ run: null, isGameOver: false, lastGain: 0, lastClearedIndices: [] });
  },
}));
