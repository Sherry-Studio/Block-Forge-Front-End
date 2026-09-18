import { create } from 'zustand';
import { readJSON, writeJSON, StorageKeys } from '@/storage/mmkv';

/**
 * Minimal Alpha wallet/level stub — a local coin balance and level derived
 * from lifetime score, persisted via MMKV. Not a real economy backend; just
 * enough state for the header coin pill / home level bar / rewards claims
 * introduced in this visual pass to have something real to bind to.
 */
interface WalletState {
  coins: number;
  level: number;
  levelProgress: number; // 0..1
  addCoins: (amount: number) => void;
  spendCoins: (amount: number) => boolean;
}

const STARTING_COINS = 1240;

function readCoins(): number {
  return readJSON<number>(StorageKeys.walletCoins) ?? STARTING_COINS;
}

export const useWalletStore = create<WalletState>((set, get) => ({
  coins: readCoins(),
  level: 7,
  levelProgress: 0.62,
  addCoins: (amount: number) => {
    const next = get().coins + amount;
    writeJSON(StorageKeys.walletCoins, next);
    set({ coins: next });
  },
  spendCoins: (amount: number) => {
    const current = get().coins;
    if (current < amount) return false;
    const next = current - amount;
    writeJSON(StorageKeys.walletCoins, next);
    set({ coins: next });
    return true;
  },
}));
