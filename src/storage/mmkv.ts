import { MMKV } from 'react-native-mmkv';

/** Single shared MMKV instance. All access must go through repositories in
 * src/storage/*Repository.ts — never call this directly from components. */
export const storage = new MMKV({ id: 'block-forge' });

export function readJSON<T>(key: string): T | undefined {
  const raw = storage.getString(key);
  if (raw === undefined) return undefined;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return undefined;
  }
}

export function writeJSON<T>(key: string, value: T): void {
  storage.set(key, JSON.stringify(value));
}

export function remove(key: string): void {
  storage.delete(key);
}

export const StorageKeys = {
  runActive: 'run.active',
  statsLocal: 'stats.local',
  streak: 'streak',
  settings: 'settings',
  onboardingDone: 'onboarding.done',
  catalogCache: 'catalog.cache',
  outbox: 'outbox.queue',
  walletCoins: 'wallet.coins',
} as const;
