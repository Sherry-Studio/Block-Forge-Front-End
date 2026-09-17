import { readJSON, writeJSON, StorageKeys } from './mmkv';

export interface AppSettings {
  soundEnabled: boolean;
  musicEnabled: boolean;
  hapticsEnabled: boolean;
  reducedMotion: boolean;
  language: string;
}

export const defaultSettings: AppSettings = {
  soundEnabled: true,
  musicEnabled: true,
  hapticsEnabled: true,
  reducedMotion: false,
  language: 'en',
};

export const SettingsRepository = {
  get(): AppSettings {
    return { ...defaultSettings, ...readJSON<Partial<AppSettings>>(StorageKeys.settings) };
  },
  update(patch: Partial<AppSettings>): AppSettings {
    const next = { ...this.get(), ...patch };
    writeJSON(StorageKeys.settings, next);
    return next;
  },
  isOnboardingDone(): boolean {
    return readJSON<boolean>(StorageKeys.onboardingDone) ?? false;
  },
  setOnboardingDone(done: boolean): void {
    writeJSON(StorageKeys.onboardingDone, done);
  },
};
