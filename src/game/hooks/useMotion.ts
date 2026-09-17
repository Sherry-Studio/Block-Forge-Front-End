import { useMemo } from 'react';
import { AccessibilityInfo } from 'react-native';
import { useEffect, useState } from 'react';
import { useSettingsStore } from '@/store/settings';
import { motion } from '@/theme/motion';

/**
 * Returns motion durations, zeroed out when the user's settings or the OS
 * reduce-motion preference asks for reduced motion. Components should read
 * durations from this hook rather than importing `motion` directly.
 */
export function useMotion() {
  const reducedMotionSetting = useSettingsStore((s) => s.settings.reducedMotion);
  const [osReducedMotion, setOsReducedMotion] = useState(false);

  useEffect(() => {
    AccessibilityInfo.isReduceMotionEnabled?.().then(setOsReducedMotion).catch(() => undefined);
    const sub = AccessibilityInfo.addEventListener?.('reduceMotionChanged', setOsReducedMotion);
    return () => sub?.remove?.();
  }, []);

  const reduced = reducedMotionSetting || osReducedMotion;

  return useMemo(() => {
    if (!reduced) return motion;
    const zeroed: typeof motion = JSON.parse(JSON.stringify(motion));
    (Object.keys(zeroed) as (keyof typeof zeroed)[]).forEach((key) => {
      const entry = zeroed[key] as Record<string, number>;
      if ('duration' in entry) entry.duration = 0;
    });
    return { ...zeroed, reduced: true } as typeof motion & { reduced: boolean };
  }, [reduced]);
}
