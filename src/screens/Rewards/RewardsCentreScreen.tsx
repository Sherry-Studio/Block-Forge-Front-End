import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Card } from '@/components/Card';
import { Button } from '@/components/Button';
import { Tag } from '@/components/Tag';
import { RewardRepository } from '@/storage/RewardRepository';
import { outbox } from '@/api/outbox';
import { color, space } from '@/theme/tokens';
import { textStyle } from '@/theme/typography';

export function RewardsCentreScreen() {
  const navigation = useNavigation<any>();
  const [achievements, setAchievements] = useState(RewardRepository.getAchievements());

  const unclaimed = achievements.filter((a) => a.state === 'unlocked');
  const claimed = achievements.filter((a) => a.state === 'claimed');

  const handleClaim = (id: string) => {
    outbox.enqueue('claim_achievement', { id });
    setAchievements(RewardRepository.claim(id));
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.title}>Rewards Centre</Text>

        <Text style={styles.sectionTitle}>Unclaimed</Text>
        {unclaimed.length === 0 && <Text style={styles.body}>Nothing to claim yet — keep playing.</Text>}
        {unclaimed.map((a) => (
          <Card key={a.id} style={styles.card}>
            <Text style={styles.rewardTitle}>{a.title}</Text>
            <Text style={styles.body}>{a.description}</Text>
            <Button label="Claim" onPress={() => handleClaim(a.id)} style={styles.claimButton} />
          </Card>
        ))}

        <Text style={styles.sectionTitle}>Claimed</Text>
        {claimed.map((a) => (
          <Card key={a.id} style={styles.card}>
            <Text style={styles.rewardTitle}>{a.title}</Text>
            <Tag label="Claimed" tone="accent" />
          </Card>
        ))}

        <Button label="View All Achievements" variant="secondary" onPress={() => navigation.navigate('Achievements')} />
        <Button label="Leaderboard" variant="ghost" onPress={() => navigation.navigate('Leaderboard')} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: color.bg },
  scroll: { padding: space.lg, gap: space.sm, paddingBottom: space.xxl * 2 },
  title: { ...textStyle('h1'), color: color.text },
  sectionTitle: { ...textStyle('h2'), color: color.text, marginTop: space.md },
  body: { ...textStyle('body'), color: color.textMuted },
  card: { gap: space.xs },
  rewardTitle: { ...textStyle('h2'), color: color.text },
  claimButton: { alignSelf: 'flex-start', marginTop: space.xs },
});
