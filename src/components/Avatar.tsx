import React from 'react';
import { StyleSheet, Text } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { color } from '@/theme/tokens';
import { textStyle } from '@/theme/typography';

interface AvatarProps {
  name: string;
  size?: number;
}

/** Gradient circle avatar with the user's initials. */
export function Avatar({ name, size = 48 }: AvatarProps) {
  const initials = name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase())
    .join('') || '?';

  return (
    <LinearGradient
      colors={['#8b7ff0', '#5b4fc0']}
      start={{ x: 0.1, y: 0 }}
      end={{ x: 0.9, y: 1 }}
      style={[styles.base, { width: size, height: size, borderRadius: size / 2 }]}
    >
      <Text style={[styles.label, { fontSize: size * 0.36 }]}>{initials}</Text>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  base: { alignItems: 'center', justifyContent: 'center' },
  label: { ...textStyle('h2'), color: color.text, fontWeight: '600' },
});
