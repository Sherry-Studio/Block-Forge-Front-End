import React, { useState } from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Tag } from '@/components/Tag';
import { EmptyState } from '@/components/EmptyState';
import { getLocalBestEntry, LeaderboardScope, useLeaderboard } from '@/api/queries/leaderboard';
import { color, space } from '@/theme/tokens';
import { textStyle, tabularNums } from '@/theme/typography';

const TABS: LeaderboardScope[] = ['global', 'weekly', 'friends'];

export function LeaderboardScreen() {
  const [scope, setScope] = useState<LeaderboardScope>('global');
  const { data, isError, isLoading } = useLeaderboard(scope);
  const localBest = getLocalBestEntry();

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <Text style={styles.title}>Leaderboard</Text>
      <View style={styles.tabs}>
        {TABS.map((tab) => (
          <View key={tab} onTouchEnd={() => setScope(tab)}>
            <Tag label={tab} tone={scope === tab ? 'accent' : 'default'} />
          </View>
        ))}
      </View>

      {isLoading && <Text style={styles.body}>Loading...</Text>}

      {(isError || !data) && (
        <>
          <EmptyState
            title="Offline"
            message="Leaderboards need a connection. Here's your local best in the meantime."
          />
          <View style={styles.localRow}>
            <Text style={styles.rank}>--</Text>
            <Text style={styles.name}>{localBest.name}</Text>
            <Text style={styles.score}>{localBest.score}</Text>
          </View>
        </>
      )}

      {data && (
        <FlatList
          data={data}
          keyExtractor={(e) => `${e.rank}-${e.name}`}
          renderItem={({ item }) => (
            <View style={[styles.localRow, item.isLocalPlayer && styles.highlight]}>
              <Text style={styles.rank}>{item.rank}</Text>
              <Text style={styles.name}>{item.name}</Text>
              <Text style={styles.score}>{item.score}</Text>
            </View>
          )}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: color.bg, paddingHorizontal: space.lg },
  title: { ...textStyle('h1'), color: color.text, marginTop: space.sm },
  tabs: { flexDirection: 'row', gap: space.xs, marginVertical: space.md },
  body: { ...textStyle('body'), color: color.textMuted },
  localRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: space.sm,
    borderBottomWidth: 1,
    borderBottomColor: color.hairline,
  },
  highlight: { backgroundColor: color.raised },
  rank: { ...textStyle('body'), ...tabularNums, color: color.textFaint, width: 32 },
  name: { ...textStyle('body'), color: color.text, flex: 1 },
  score: { ...textStyle('body'), ...tabularNums, color: color.accent300 },
});
