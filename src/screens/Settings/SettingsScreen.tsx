import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Header } from '@/components/Header';
import { ListRow } from '@/components/ListRow';
import { Toggle } from '@/components/Toggle';
import { useSettingsStore } from '@/store/settings';
import { color, space } from '@/theme/tokens';
import { textStyle } from '@/theme/typography';

export function SettingsScreen() {
  const navigation = useNavigation<any>();
  const settings = useSettingsStore((s) => s.settings);
  const update = useSettingsStore((s) => s.update);

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <Header title="Settings" onBack={() => navigation.goBack()} />
      <ScrollView contentContainerStyle={styles.scroll}>
        <Section label="GAMEPLAY">
          <ListRow
            label="Sound effects"
            trailing={<Toggle value={settings.soundEnabled} onChange={(v) => update({ soundEnabled: v })} accessibilityLabel="Sound effects" />}
          />
          <Divider />
          <ListRow
            label="Music"
            trailing={<Toggle value={settings.musicEnabled} onChange={(v) => update({ musicEnabled: v })} accessibilityLabel="Music" />}
          />
          <Divider />
          <ListRow
            label="Haptics"
            trailing={<Toggle value={settings.hapticsEnabled} onChange={(v) => update({ hapticsEnabled: v })} accessibilityLabel="Haptics" />}
          />
          <Divider />
          <ListRow label="Sound & haptics detail" chevron onPress={() => navigation.navigate('SoundSettings')} />
        </Section>

        <Section label="ACCOUNT">
          <ListRow label="Profile" trailingText="rk_forge" chevron onPress={() => navigation.getParent()?.navigate('ProfileTab')} />
          <Divider />
          <ListRow label="Restore purchases" chevron onPress={() => navigation.navigate('Restore')} />
          <Divider />
          <ListRow label="Notifications" trailingText="2 on" chevron onPress={() => navigation.navigate('NotificationSettings')} />
        </Section>

        <Section label="APP">
          <ListRow label="Language" trailingText="English (UK)" chevron onPress={() => navigation.navigate('LanguageSettings')} />
          <Divider />
          <ListRow label="About & support" chevron onPress={() => navigation.navigate('About')} />
          <Divider />
          <ListRow label="Privacy & terms" chevron onPress={() => navigation.navigate('Legal')} />
        </Section>

        <Text style={styles.version}>Block Forge · v1.0.0 (Alpha)</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

function Section({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionLabel}>{label}</Text>
      <View style={styles.sectionCard}>{children}</View>
    </View>
  );
}

function Divider() {
  return <View style={styles.divider} />;
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: color.bg },
  scroll: { padding: space.lg, gap: space.lg, paddingBottom: space.xxl * 2 },
  section: { gap: space.xs },
  sectionLabel: {
    ...textStyle('caption'),
    color: color.textFaint,
    fontWeight: '700',
    letterSpacing: 0.5,
    marginLeft: space.xs,
  },
  sectionCard: {
    backgroundColor: color.card,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: color.hairline,
    paddingHorizontal: space.lg,
  },
  divider: { height: 1, backgroundColor: color.hairline },
  version: { ...textStyle('caption'), color: color.textDim, textAlign: 'center', marginTop: space.md },
});
