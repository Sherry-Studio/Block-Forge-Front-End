import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { Tag } from '@/components/Tag';
import { EmptyState } from '@/components/EmptyState';
import { getGameById } from '@/games/registry';
import { color, space } from '@/theme/tokens';
import { textStyle } from '@/theme/typography';

/** Reusable detail template for both playable AND coming-soon games — the
 * only thing that changes is which fields the registry entry populates. */
export function GameDetailScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const game = getGameById(route.params?.gameId);

  if (!game) {
    return (
      <SafeAreaView style={styles.safe}>
        <EmptyState title="Game not found" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={[styles.hero, { borderColor: game.accent }]}>
          <Text style={styles.title}>{game.title}</Text>
          <Tag label={game.category} tone="accent" />
        </View>

        <Text style={styles.description}>{game.description}</Text>

        <Card style={styles.card}>
          <Text style={styles.sectionTitle}>Features</Text>
          {game.features.map((f) => (
            <Text key={f} style={styles.feature}>
              - {f}
            </Text>
          ))}
        </Card>

        {game.playable ? (
          <>
            <Button label="Preview" variant="secondary" onPress={() => navigation.navigate('Previews', { gameId: game.id })} />
            <Button label="Play" onPress={() => navigation.navigate(game.route ?? 'ClassicIntro')} style={styles.playButton} />
          </>
        ) : (
          <Card style={styles.comingSoon}>
            <Tag label="Coming Soon" tone="gold" />
            <Text style={styles.body}>This game is still in the forge. Check back in a future update.</Text>
          </Card>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: color.bg },
  scroll: { padding: space.lg, gap: space.lg, paddingBottom: space.xxl * 2 },
  hero: {
    borderWidth: 1.5,
    borderRadius: 20,
    padding: space.xxl,
    gap: space.sm,
    backgroundColor: color.card,
  },
  title: { ...textStyle('display'), color: color.text },
  description: { ...textStyle('body'), color: color.textMuted },
  card: { gap: space.xs },
  sectionTitle: { ...textStyle('h2'), color: color.text, marginBottom: space.xs },
  feature: { ...textStyle('body'), color: color.textMuted },
  playButton: { marginTop: space.sm },
  comingSoon: { gap: space.sm, alignItems: 'flex-start' },
  body: { ...textStyle('body'), color: color.textMuted },
});
