import React from 'react';
import { ScrollView, StyleSheet, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Card } from '@/components/Card';
import { useUserStore } from '@/store/user';
import { color, space } from '@/theme/tokens';
import { textStyle, tabularNums } from '@/theme/typography';

export function StatisticsScreen() {
  const stats = useUserStore((s) => s.stats);
  const avgLines = stats.runsPlayed > 0 ? (stats.totalLinesCleared / stats.runsPlayed).toFixed(1) : '0';
  const avgBlocks = stats.runsPlayed > 0 ? (stats.totalBlocksPlaced / stats.runsPlayed).toFixed(1) : '0';

  const rows = [
    ['Games Played', stats.runsPlayed],
    ['Best Score', stats.bestScore],
    ['Total Lines Cleared', stats.totalLinesCleared],
    ['Total Blocks Placed', stats.totalBlocksPlaced],
    ['Best Combo', `x${stats.bestCombo}`],
    ['Avg Lines / Run', avgLines],
    ['Avg Blocks / Run', avgBlocks],
  ] as const;

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.title}>Statistics</Text>
        <Card style={styles.card}>
          {rows.map(([label, value]) => (
            <React.Fragment key={label}>
              <Text style={styles.row}>
                <Text style={styles.label}>{label}</Text>
                <Text style={styles.value}>  {value}</Text>
              </Text>
            </React.Fragment>
          ))}
        </Card>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: color.bg },
  scroll: { padding: space.lg, gap: space.md },
  title: { ...textStyle('h1'), color: color.text },
  card: { gap: space.sm },
  row: { ...textStyle('body') },
  label: { color: color.textMuted },
  value: { color: color.text, ...tabularNums },
});
