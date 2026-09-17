import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { color, radius, space } from '@/theme/tokens';
import { textStyle } from '@/theme/typography';

interface TagProps {
  label: string;
  tone?: 'default' | 'accent' | 'gold' | 'danger';
}

export function Tag({ label, tone = 'default' }: TagProps) {
  const toneColor = toneColors[tone];
  return (
    <View style={[styles.base, { borderColor: toneColor }]}>
      <Text style={[styles.label, { color: toneColor }]}>{label}</Text>
    </View>
  );
}

const toneColors = {
  default: color.textMuted,
  accent: color.accent,
  gold: color.gold,
  danger: color.danger,
};

const styles = StyleSheet.create({
  base: {
    paddingVertical: 3,
    paddingHorizontal: space.sm,
    borderRadius: radius.pill,
    borderWidth: 1,
    alignSelf: 'flex-start',
  },
  label: {
    ...textStyle('badge'),
  },
});
