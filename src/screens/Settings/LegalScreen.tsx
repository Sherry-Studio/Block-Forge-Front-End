import React from 'react';
import { StyleSheet, Text } from 'react-native';
import { SimpleDetailLayout } from './SimpleDetailLayout';
import { color, space } from '@/theme/tokens';
import { textStyle } from '@/theme/typography';

export function LegalScreen() {
  return (
    <SimpleDetailLayout title="Legal">
      <Text style={styles.heading}>Terms of Service</Text>
      <Text style={styles.body}>
        Placeholder terms of service text. Replace with the real document before shipping.
      </Text>
      <Text style={styles.heading}>Privacy Policy</Text>
      <Text style={styles.body}>
        Placeholder privacy policy text. Replace with the real document before shipping.
      </Text>
    </SimpleDetailLayout>
  );
}

const styles = StyleSheet.create({
  heading: { ...textStyle('h2'), color: color.text, marginTop: space.md },
  body: { ...textStyle('body'), color: color.textMuted },
});
