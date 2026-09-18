import React, { useState } from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Button } from '@/components/Button';
import { Header } from '@/components/Header';
import { Sheet } from '@/components/Sheet';
import { StatusPill } from '@/components/StatusPill';
import { Achievement, RewardRepository } from '@/storage/RewardRepository';
import { color, radius, space } from '@/theme/tokens';
import { textStyle } from '@/theme/typography';

const stateTone: Record<Achievement['state'], 'muted' | 'accent' | 'gold'> = {
  locked: 'muted',
  in_progress: 'muted',
  unlocked: 'gold',
  claimed: 'accent',
};

const stateLabel: Record<Achievement['state'], string> = {
  locked: 'LOCKED',
  in_progress: 'IN PROGRESS',
  unlocked: 'UNLOCKED',
  claimed: 'CLAIMED',
};

export function AchievementsScreen() {
  const navigation = useNavigation<any>();
  const [achievements] = useState(RewardRepository.getAchievements());
  const unlockedCount = achievements.filter((a) => a.state === 'unlocked' || a.state === 'claimed').length;
  const [unlockModal, setUnlockModal] = useState<Achievement | null>(null);

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <Header
        title="Achievements"
        subtitle={`${unlockedCount} / ${achievements.length} unlocked`}
        onBack={() => navigation.goBack()}
      />
      <FlatList
        data={achievements}
        keyExtractor={(a) => a.id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <View style={styles.card} onTouchEnd={item.state === 'unlocked' ? () => setUnlockModal(item) : undefined}>
            <View style={styles.row}>
              <Text style={styles.name}>{item.title}</Text>
              <StatusPill
                label={stateLabel[item.state]}
                tone={stateTone[item.state]}
                variant={item.state === 'unlocked' || item.state === 'claimed' ? 'filled' : 'outline'}
              />
            </View>
            <Text style={styles.description}>{item.description}</Text>
            <View style={styles.progressTrack}>
              <View style={[styles.progressFill, { width: `${Math.min(100, (item.progress / item.target) * 100)}%` }]} />
            </View>
          </View>
        )}
      />

      <Sheet visible={!!unlockModal} onClose={() => setUnlockModal(null)}>
        <Text style={styles.unlockTitle}>{unlockModal?.title}</Text>
        <Text style={styles.description}>{unlockModal?.description}</Text>
        <Button label="Close" variant="filled" onPress={() => setUnlockModal(null)} style={{ marginTop: space.md }} />
      </Sheet>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: color.bg },
  list: { gap: space.sm, paddingHorizontal: space.lg, paddingVertical: space.md, paddingBottom: space.xxl * 2 },
  card: {
    gap: space.xs,
    backgroundColor: color.card,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: color.hairline,
    padding: space.lg,
  },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: space.sm },
  name: { ...textStyle('h2'), color: color.text, flexShrink: 1 },
  description: { ...textStyle('body'), color: color.textMuted },
  progressTrack: { height: 4, backgroundColor: color.hairline, borderRadius: radius.pill, overflow: 'hidden', marginTop: space.xs },
  progressFill: { height: '100%', backgroundColor: color.accent },
  unlockTitle: { ...textStyle('h1'), color: color.text, marginBottom: space.sm },
});
