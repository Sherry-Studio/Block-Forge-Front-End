import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Button } from './Button';
import { color, space } from '@/theme/tokens';
import { textStyle } from '@/theme/typography';

interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
}

export function ErrorState({
  title = 'Something went wrong',
  message = 'Please try again.',
  onRetry,
}: ErrorStateProps) {
  return (
    <View style={styles.container} accessibilityRole="alert" accessibilityLiveRegion="assertive">
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.message}>{message}</Text>
      {onRetry ? <Button label="Retry" onPress={onRetry} style={styles.action} /> : null}
    </View>
  );
}

export function OfflineState({ onRetry }: { onRetry?: () => void }) {
  return (
    <ErrorState
      title="You're offline"
      message="Some features are unavailable until you reconnect. Local progress is saved."
      onRetry={onRetry}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: space.xxl,
    gap: space.sm,
  },
  title: { ...textStyle('h2'), color: color.danger, textAlign: 'center' },
  message: { ...textStyle('body'), color: color.textMuted, textAlign: 'center' },
  action: { marginTop: space.lg },
});
