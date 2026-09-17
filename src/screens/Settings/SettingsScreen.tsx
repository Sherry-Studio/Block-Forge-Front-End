import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Card } from '@/components/Card';
import { Toggle } from '@/components/Toggle';
import { useSettingsStore } from '@/store/settings';
import { color, space } from '@/theme/tokens';
import { textStyle } from '@/theme/typography';

const LINKS = [
  { label: 'Sound', route: 'SoundSettings' },
  { label: 'Notifications', route: 'NotificationSettings' },
  { label: 'Language', route: 'LanguageSettings' },
  { label: 'About', route: 'About' },
  { label: 'Legal', route: 'Legal' },
  { label: 'Restore Purchases', route: 'Restore' },
];

export function SettingsScreen() {
  const navigation = useNavigation<any>();
  const settings = useSettingsStore((s) => s.settings);
  const update = useSettingsStore((s) => s.update);

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.title}>Settings</Text>

        <Card style={styles.card}>
          <View style={styles.row}>
            <Text style={styles.label}>Reduced Motion</Text>
            <Toggle
              value={settings.reducedMotion}
              onChange={(v) => update({ reducedMotion: v })}
              accessibilityLabel="Reduced motion"
            />
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Haptics</Text>
            <Toggle
              value={settings.hapticsEnabled}
              onChange={(v) => update({ hapticsEnabled: v })}
              accessibilityLabel="Haptics"
            />
          </View>
        </Card>

        {LINKS.map((link) => (
          <Card key={link.route} style={styles.card} onPress={() => navigation.navigate(link.route)}>
            <Text style={styles.label}>{link.label}</Text>
          </Card>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: color.bg },
  scroll: { padding: space.lg, gap: space.sm, paddingBottom: space.xxl * 2 },
  title: { ...textStyle('h1'), color: color.text },
  card: { gap: space.sm },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  label: { ...textStyle('h2'), color: color.text },
});
