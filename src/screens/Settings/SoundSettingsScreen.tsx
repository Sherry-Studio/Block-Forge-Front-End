import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Card } from '@/components/Card';
import { Toggle } from '@/components/Toggle';
import { useSettingsStore } from '@/store/settings';
import { color, space } from '@/theme/tokens';
import { textStyle } from '@/theme/typography';

export function SoundSettingsScreen() {
  const settings = useSettingsStore((s) => s.settings);
  const update = useSettingsStore((s) => s.update);

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <Text style={styles.title}>Sound</Text>
      <Card style={styles.card}>
        <View style={styles.row}>
          <Text style={styles.label}>Sound Effects</Text>
          <Toggle value={settings.soundEnabled} onChange={(v) => update({ soundEnabled: v })} accessibilityLabel="Sound effects" />
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Music</Text>
          <Toggle value={settings.musicEnabled} onChange={(v) => update({ musicEnabled: v })} accessibilityLabel="Music" />
        </View>
      </Card>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: color.bg, padding: space.lg, gap: space.md },
  title: { ...textStyle('h1'), color: color.text },
  card: { gap: space.md },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  label: { ...textStyle('h2'), color: color.text },
});
