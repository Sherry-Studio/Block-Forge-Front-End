import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Button } from './Button';
import { color, space } from '@/theme/tokens';
import { textStyle } from '@/theme/typography';

interface EmptyStateProps {
  title: string;
  message?: string;
  actionLabel?: string;
  onAction?: () => void;
}

export function EmptyState({ title, message, actionLabel, onAction }: EmptyStateProps) {
  return (
    <View style={styles.container} accessibilityRole="text" accessibilityLiveRegion="polite">
      <Text style={styles.title}>{title}</Text>
      {message ? <Text style={styles.message}>{message}</Text> : null}
      {actionLabel && onAction ? (
        <Button label={actionLabel} onPress={onAction} variant="secondary" style={styles.action} />
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: space.xxl,
    gap: space.sm,
  },
  title: { ...textStyle('h2'), color: color.text, textAlign: 'center' },
  message: { ...textStyle('body'), color: color.textMuted, textAlign: 'center' },
  action: { marginTop: space.lg },
});
