import React from 'react';
import { StyleSheet, Text } from 'react-native';
import { Card } from '@/components/Card';
import { Tag } from '@/components/Tag';
import { useSettingsStore } from '@/store/settings';
import { SimpleDetailLayout } from './SimpleDetailLayout';
import { color, space } from '@/theme/tokens';
import { textStyle } from '@/theme/typography';

const LANGUAGES = [
  { code: 'en', label: 'English' },
  { code: 'es', label: 'Spanish' },
  { code: 'fr', label: 'French' },
  { code: 'ja', label: 'Japanese' },
];

export function LanguageSettingsScreen() {
  const language = useSettingsStore((s) => s.settings.language);
  const update = useSettingsStore((s) => s.update);

  return (
    <SimpleDetailLayout title="Language">
      {LANGUAGES.map((lang) => (
        <Card key={lang.code} style={styles.card} onPress={() => update({ language: lang.code })}>
          <Text style={styles.label}>{lang.label}</Text>
          {language === lang.code && <Tag label="Selected" tone="accent" />}
        </Card>
      ))}
    </SimpleDetailLayout>
  );
}

const styles = StyleSheet.create({
  card: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  label: { ...textStyle('h2'), color: color.text },
});
