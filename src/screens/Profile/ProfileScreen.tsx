import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Card } from '@/components/Card';
import { Button } from '@/components/Button';
import { useUserStore } from '@/store/user';
import { color, space } from '@/theme/tokens';
import { textStyle, tabularNums } from '@/theme/typography';

export function ProfileScreen() {
  const navigation = useNavigation<any>();
  const stats = useUserStore((s) => s.stats);
  const streak = useUserStore((s) => s.streak);

  const items = [
    { label: 'Games Played', value: stats.runsPlayed },
    { label: 'Best Score', value: stats.bestScore },
    { label: 'Lines Cleared', value: stats.totalLinesCleared },
    { label: 'Best Combo', value: `x${stats.bestCombo}` },
    { label: 'Daily Streak', value: streak.currentStreak },
  ];

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.title}>Profile</Text>
        <View style={styles.grid}>
          {items.map((item) => (
            <Card key={item.label} style={styles.statCard}>
              <Text style={styles.statLabel}>{item.label}</Text>
              <Text style={styles.statValue}>{item.value}</Text>
            </Card>
          ))}
        </View>
        <Button label="View Statistics" variant="secondary" onPress={() => navigation.navigate('Statistics')} />
        <Button label="Settings" variant="ghost" onPress={() => navigation.navigate('Settings')} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: color.bg },
  scroll: { padding: space.lg, gap: space.md, paddingBottom: space.xxl * 2 },
  title: { ...textStyle('h1'), color: color.text },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: space.sm },
  statCard: { width: '47%', gap: space.xs },
  statLabel: { ...textStyle('caption'), color: color.textFaint },
  statValue: { ...textStyle('h1'), ...tabularNums, color: color.text },
});
