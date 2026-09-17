import React from 'react';
import { StyleSheet, Text } from 'react-native';
import { SimpleDetailLayout } from './SimpleDetailLayout';
import { color } from '@/theme/tokens';
import { textStyle } from '@/theme/typography';

const APP_VERSION = '1.0.0';

export function AboutScreen() {
  const version = APP_VERSION;
  return (
    <SimpleDetailLayout title="About">
      <Text style={styles.body}>Block Forge, by Sherry Studio.</Text>
      <Text style={styles.body}>Version {version}</Text>
      <Text style={styles.body}>Part of the Block Forge multi-game platform.</Text>
    </SimpleDetailLayout>
  );
}

const styles = StyleSheet.create({
  body: { ...textStyle('body'), color: color.textMuted },
});
