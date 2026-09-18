import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { color, radius, space } from '@/theme/tokens';
import { textStyle } from '@/theme/typography';

export type PillTone = 'accent' | 'teal' | 'gold' | 'danger' | 'muted';

interface StatusPillProps {
  label: string;
  tone?: PillTone;
  /** filled = solid background (highest emphasis, e.g. PLAY); outline = bordered only. */
  variant?: 'filled' | 'outline';
}

const toneColor: Record<PillTone, string> = {
  accent: color.accent,
  teal: color.teal,
  gold: color.gold,
  danger: color.danger,
  muted: color.textFaint,
};

/** Small caps status/label pill — "PLAY", "COMING SOON", "LOCKED", etc. */
export function StatusPill({ label, tone = 'muted', variant = 'outline' }: StatusPillProps) {
  const c = toneColor[tone];
  const filled = variant === 'filled';
  return (
    <View
      style={[
        styles.base,
        filled ? { backgroundColor: c } : { borderWidth: 1, borderColor: c },
      ]}
    >
      <Text style={[styles.label, { color: filled ? color.bg : c }]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  base: {
    paddingVertical: 4,
    paddingHorizontal: space.sm + 2,
    borderRadius: radius.pill,
    alignSelf: 'flex-start',
  },
  label: {
    ...textStyle('badge'),
  },
});
