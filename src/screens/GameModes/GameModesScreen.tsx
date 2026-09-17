import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Card } from '@/components/Card';
import { Tag } from '@/components/Tag';
import { color, space } from '@/theme/tokens';
import { textStyle } from '@/theme/typography';

const MODES = [
  { id: 'classic', title: 'Classic', description: 'Endless play, chase your best score.', live: true, route: 'ClassicIntro' },
  { id: 'daily', title: 'Daily Challenge', description: "Today's seeded puzzle, once a day.", live: true, route: 'DailyChallenge' },
  { id: 'zen', title: 'Zen', description: 'No game over, just relax and clear lines.', live: false },
  { id: 'timed', title: 'Timed Rush', description: 'Race the clock for the highest score.', live: false },
];

export function GameModesScreen() {
  const navigation = useNavigation<any>();
  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <Text style={styles.title}>Game Modes</Text>
      <View style={styles.list}>
        {MODES.map((mode) => (
          <Card
            key={mode.id}
            style={styles.card}
            onPress={mode.live ? () => navigation.navigate(mode.route) : undefined}
          >
            <View style={styles.row}>
              <Text style={styles.modeTitle}>{mode.title}</Text>
              {!mode.live && <Tag label="Coming Soon" />}
            </View>
            <Text style={styles.description}>{mode.description}</Text>
          </Card>
        ))}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: color.bg, padding: space.lg },
  title: { ...textStyle('h1'), color: color.text, marginBottom: space.md },
  list: { gap: space.sm },
  card: { gap: space.xs },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  modeTitle: { ...textStyle('h2'), color: color.text },
  description: { ...textStyle('body'), color: color.textMuted },
});
