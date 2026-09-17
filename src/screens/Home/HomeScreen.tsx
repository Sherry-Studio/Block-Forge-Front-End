import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { Tag } from '@/components/Tag';
import { CATEGORIES, getGamesByCategory } from '@/games/registry';
import { GameRepository } from '@/storage/GameRepository';
import { useUserStore } from '@/store/user';
import { color, radius, space } from '@/theme/tokens';
import { textStyle, tabularNums } from '@/theme/typography';

export function HomeScreen() {
  const navigation = useNavigation<any>();
  const stats = useUserStore((s) => s.stats);
  const hasActiveRun = GameRepository.hasActiveRun();

  const variant = hasActiveRun ? 'continue' : stats.runsPlayed > 0 ? 'returning' : 'new';

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <Card filled style={styles.hero}>
          <Tag label="Featured" tone="accent" />
          <Text style={styles.heroTitle}>Block Forge</Text>
          <Text style={styles.heroBody}>
            {variant === 'continue'
              ? 'Pick up right where you left off.'
              : variant === 'returning'
              ? `Best score: ${stats.bestScore}`
              : 'Drag, fill, clear. Chain combos for a new high score.'}
          </Text>
          <Button
            label={variant === 'continue' ? 'Resume run' : 'Play'}
            onPress={() => navigation.navigate('ClassicIntro')}
            style={styles.heroButton}
          />
        </Card>

        <Card style={styles.dailyCard} onPress={() => navigation.navigate('DailyChallenge')}>
          <Tag label="Daily Challenge" tone="gold" />
          <Text style={styles.dailyTitle}>Today's puzzle is ready</Text>
          <Button label="View Challenge" variant="secondary" onPress={() => navigation.navigate('DailyChallenge')} />
        </Card>

        <Card style={styles.rewardsTeaser} onPress={() => navigation.getParent()?.navigate('RewardsTab')}>
          <Text style={styles.sectionTitle}>Rewards Centre</Text>
          <Text style={styles.body}>Unclaimed achievements are waiting.</Text>
        </Card>

        {CATEGORIES.map((category) => {
          const games = getGamesByCategory(category);
          if (games.length === 0) return null;
          return (
            <View key={category} style={styles.section}>
              <Text style={styles.sectionTitle}>{category}</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {games.map((game) => (
                  <Card
                    key={game.id}
                    style={[styles.gameCard, { borderColor: game.accent }]}
                    onPress={() => navigation.navigate('GameDetail', { gameId: game.id })}
                  >
                    <Text style={styles.gameTitle}>{game.title}</Text>
                    {game.status === 'coming_soon' && <Tag label="Coming Soon" />}
                  </Card>
                ))}
              </ScrollView>
            </View>
          );
        })}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: color.bg },
  scroll: { padding: space.lg, gap: space.lg, paddingBottom: space.xxl * 2 },
  hero: { gap: space.sm },
  heroTitle: { ...textStyle('display'), color: color.text },
  heroBody: { ...textStyle('body'), color: color.textMuted },
  heroButton: { marginTop: space.sm, alignSelf: 'flex-start' },
  dailyCard: { gap: space.sm },
  dailyTitle: { ...textStyle('h2'), color: color.text },
  rewardsTeaser: { gap: space.xs },
  sectionTitle: { ...textStyle('h2'), color: color.text, marginBottom: space.sm },
  body: { ...textStyle('body'), color: color.textMuted },
  section: { gap: space.xs },
  gameCard: {
    width: 140,
    marginRight: space.sm,
    borderWidth: 1.5,
    gap: space.xs,
  },
  gameTitle: { ...textStyle('h2'), color: color.text },
});
