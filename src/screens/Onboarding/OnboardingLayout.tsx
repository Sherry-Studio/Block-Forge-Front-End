import React, { PropsWithChildren } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button } from '@/components/Button';
import { color, space } from '@/theme/tokens';
import { textStyle } from '@/theme/typography';

interface OnboardingLayoutProps extends PropsWithChildren {
  title: string;
  body?: string;
  primaryLabel: string;
  onPrimary: () => void;
  onSkip?: () => void;
}

export function OnboardingLayout({ title, body, primaryLabel, onPrimary, onSkip, children }: OnboardingLayoutProps) {
  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.content}>
        <Text style={styles.title}>{title}</Text>
        {body ? <Text style={styles.body}>{body}</Text> : null}
        {children}
      </View>
      <View style={styles.footer}>
        <Button label={primaryLabel} onPress={onPrimary} />
        {onSkip ? <Button label="Skip" variant="ghost" onPress={onSkip} /> : null}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: color.bg, padding: space.xxl, justifyContent: 'space-between' },
  content: { flex: 1, justifyContent: 'center', gap: space.md },
  title: { ...textStyle('h1'), color: color.text },
  body: { ...textStyle('body'), color: color.textMuted },
  footer: { gap: space.sm, paddingBottom: space.lg },
});
