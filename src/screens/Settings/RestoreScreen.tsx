import React, { useState } from 'react';
import { StyleSheet, Text } from 'react-native';
import { Button } from '@/components/Button';
import { SimpleDetailLayout } from './SimpleDetailLayout';
import { color, space } from '@/theme/tokens';
import { textStyle } from '@/theme/typography';

/** No in-app purchases wired up yet — this is a UI placeholder that always
 * reports nothing to restore, matching the current shop's no-purchase state. */
export function RestoreScreen() {
  const [checked, setChecked] = useState(false);

  return (
    <SimpleDetailLayout title="Restore Purchases">
      <Text style={styles.body}>
        Block Forge has no paid purchases yet. This screen will restore cosmetic and power-up
        purchases once the shop goes live.
      </Text>
      <Button
        label={checked ? 'Nothing to restore' : 'Check for purchases'}
        state={checked ? 'disabled' : 'idle'}
        onPress={() => setChecked(true)}
      />
    </SimpleDetailLayout>
  );
}

const styles = StyleSheet.create({
  body: { ...textStyle('body'), color: color.textMuted, marginBottom: space.md },
});
