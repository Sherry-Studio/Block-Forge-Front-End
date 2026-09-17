import React from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { color, space } from '@/theme/tokens';
import { textStyle } from '@/theme/typography';

export function LoadingState({ label = 'Loading...' }: { label?: string }) {
  return (
    <View style={styles.container} accessibilityRole="progressbar" accessibilityLabel={label}>
      <ActivityIndicator color={color.accent} size="large" />
      <Text style={styles.label}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { alignItems: 'center', justifyContent: 'center', padding: space.xxl, gap: space.sm },
  label: { ...textStyle('body'), color: color.textMuted },
});
