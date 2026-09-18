import React, { useState } from 'react';
import { FlatList, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { EmptyState } from '@/components/EmptyState';
import { Header } from '@/components/Header';
import { getLocalBestEntry, LeaderboardScope, useLeaderboard } from '@/api/queries/leaderboard';
import { color, radius, space } from '@/theme/tokens';
import { textStyle, tabularNums } from '@/theme/typography';

const TABS: LeaderboardScope[] = ['global', 'weekly', 'friends'];

export function LeaderboardScreen() {
  const navigation = useNavigation<any>();
  const [scope, setScope] = useState<LeaderboardScope>('global');
  const { data, isError, isLoading } = useLeaderboard(scope);
  const localBest = getLocalBestEntry();

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <Header title="Leaderboard" onBack={() => navigation.goBack()} />
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.tabsRow} contentContainerStyle={styles.tabs}>
        {TABS.map((tab) => (
          <Pressable key={tab} onPress={() => setScope(tab)} style={[styles.chip, scope === tab && styles.chipActive]}>
            <Text style={[styles.chipLabel, scope === tab && styles.chipLabelActive]}>
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </Text>
          </Pressable>
        ))}
      </ScrollView>

      {isLoading && <Text style={styles.body}>Loading...</Text>}

      {(isError || !data) && !isLoading && (
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
          contentContainerStyle={styles.listPad}
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
  safe: { flex: 1, backgroundColor: color.bg },
  tabsRow: { flexGrow: 0, marginTop: space.xs },
  tabs: { paddingHorizontal: space.lg, gap: space.xs },
  chip: {
    paddingVertical: 6,
    paddingHorizontal: space.lg,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: color.hairline,
    backgroundColor: color.card,
  },
  chipActive: { backgroundColor: color.accent, borderColor: color.accent },
  chipLabel: { ...textStyle('caption'), color: color.textMuted, fontWeight: '600' },
  chipLabelActive: { color: color.bg },
  body: { ...textStyle('body'), color: color.textMuted, paddingHorizontal: space.lg, marginTop: space.md },
  listPad: { paddingHorizontal: space.lg, paddingBottom: space.xxl * 2 },
  localRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: space.sm,
    paddingHorizontal: space.lg,
    borderBottomWidth: 1,
    borderBottomColor: color.hairline,
  },
  highlight: { backgroundColor: color.raised },
  rank: { ...textStyle('body'), ...tabularNums, color: color.textFaint, width: 32 },
  name: { ...textStyle('body'), color: color.text, flex: 1 },
  score: { ...textStyle('body'), ...tabularNums, color: color.accent300 },
});
