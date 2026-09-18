import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Header } from '@/components/Header';
import { ListRow } from '@/components/ListRow';
import { StatusPill } from '@/components/StatusPill';
import { color, space } from '@/theme/tokens';

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
      <Header title="Game Modes" onBack={() => navigation.goBack()} />
      <View style={styles.list}>
        {MODES.map((mode) => (
          <View key={mode.id} style={styles.card}>
            <ListRow
              label={mode.title}
              subtitle={mode.description}
              trailing={!mode.live ? <StatusPill label="COMING SOON" tone="muted" /> : undefined}
              chevron={mode.live}
              onPress={mode.live ? () => navigation.navigate(mode.route) : undefined}
            />
          </View>
        ))}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: color.bg },
  list: { padding: space.lg, gap: space.sm },
  card: {
    backgroundColor: color.card,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: color.hairline,
    paddingHorizontal: space.lg,
  },
});
