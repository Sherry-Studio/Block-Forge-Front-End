import { create } from 'zustand';
import { AppSettings, SettingsRepository, defaultSettings } from '@/storage/SettingsRepository';

interface SettingsStore {
  settings: AppSettings;
  hydrate: () => void;
  update: (patch: Partial<AppSettings>) => void;
}

export const useSettingsStore = create<SettingsStore>((set) => ({
  settings: defaultSettings,
  hydrate: () => set({ settings: SettingsRepository.get() }),
  update: (patch) => set({ settings: SettingsRepository.update(patch) }),
}));
