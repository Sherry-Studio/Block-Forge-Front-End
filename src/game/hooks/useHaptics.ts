import * as Haptics from 'expo-haptics';
import { useCallback } from 'react';
import { useSettingsStore } from '@/store/settings';

/** Centralised haptics gate — respects the user's haptics setting. */
export function useHaptics() {
  const enabled = useSettingsStore((s) => s.settings.hapticsEnabled);

  const selection = useCallback(() => {
    if (enabled) Haptics.selectionAsync();
  }, [enabled]);

  const impact = useCallback(
    (style: Haptics.ImpactFeedbackStyle = Haptics.ImpactFeedbackStyle.Medium) => {
      if (enabled) Haptics.impactAsync(style);
    },
    [enabled],
  );

  const notify = useCallback(
    (type: Haptics.NotificationFeedbackType = Haptics.NotificationFeedbackType.Success) => {
      if (enabled) Haptics.notificationAsync(type);
    },
    [enabled],
  );

  return { selection, impact, notify };
}
