import React, { useState } from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Card } from '@/components/Card';
import { Tag } from '@/components/Tag';
import { Sheet } from '@/components/Sheet';
import { Button } from '@/components/Button';
import { Achievement, RewardRepository } from '@/storage/RewardRepository';
import { color, radius, space } from '@/theme/tokens';
import { textStyle } from '@/theme/typography';

const stateTone: Record<Achievement['state'], 'default' | 'accent' | 'gold'> = {
  locked: 'default',
  in_progress: 'default',
  unlocked: 'gold',
  claimed: 'accent',
};

const stateLabel: Record<Achievement['state'], string> = {
  locked: 'Locked',
  in_progress: 'In Progress',
  unlocked: 'Unlocked',
  claimed: 'Claimed',
};

export function AchievementsScreen() {
  const [achievements] = useState(RewardRepository.getAchievements());
  const [unlockModal, setUnlockModal] = useState<Achievement | null>(null);

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <Text style={styles.title}>Achievements</Text>
      <FlatList
        data={achievements}
        keyExtractor={(a) => a.id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <Card style={styles.card} onPress={item.state === 'unlocked' ? () => setUnlockModal(item) : undefined}>
            <View style={styles.row}>
              <Text style={styles.name}>{item.title}</Text>
              <Tag label={stateLabel[item.state]} tone={stateTone[item.state]} />
            </View>
            <Text style={styles.description}>{item.description}</Text>
            <View style={styles.progressTrack}>
              <View style={[styles.progressFill, { width: `${Math.min(100, (item.progress / item.target) * 100)}%` }]} />
            </View>
          </Card>
        )}
      />

      <Sheet visible={!!unlockModal} onClose={() => setUnlockModal(null)}>
        <Text style={styles.unlockTitle}>{unlockModal?.title}</Text>
        <Text style={styles.description}>{unlockModal?.description}</Text>
        <Button label="Close" onPress={() => setUnlockModal(null)} style={{ marginTop: space.md }} />
      </Sheet>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: color.bg, paddingHorizontal: space.lg },
  title: { ...textStyle('h1'), color: color.text, marginTop: space.sm },
  list: { gap: space.sm, paddingVertical: space.md, paddingBottom: space.xxl * 2 },
  card: { gap: space.xs },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  name: { ...textStyle('h2'), color: color.text },
  description: { ...textStyle('body'), color: color.textMuted },
  progressTrack: { height: 4, backgroundColor: color.hairline, borderRadius: radius.pill, overflow: 'hidden', marginTop: space.xs },
  progressFill: { height: '100%', backgroundColor: color.accent },
  unlockTitle: { ...textStyle('h1'), color: color.text, marginBottom: space.sm },
});
