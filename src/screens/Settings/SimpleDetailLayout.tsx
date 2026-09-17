import React, { PropsWithChildren } from 'react';
import { ScrollView, StyleSheet, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { color, space } from '@/theme/tokens';
import { textStyle } from '@/theme/typography';

interface SimpleDetailLayoutProps extends PropsWithChildren {
  title: string;
}

export function SimpleDetailLayout({ title, children }: SimpleDetailLayoutProps) {
  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.title}>{title}</Text>
        {children}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: color.bg },
  scroll: { padding: space.lg, gap: space.md },
  title: { ...textStyle('h1'), color: color.text },
});
