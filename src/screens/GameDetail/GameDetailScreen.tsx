import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Button } from '@/components/Button';
import { EmptyState } from '@/components/EmptyState';
import { GradientCard } from '@/components/GradientCard';
import { Header } from '@/components/Header';
import { StatGrid } from '@/components/StatGrid';
import { StatusPill } from '@/components/StatusPill';
import { getGameById } from '@/games/registry';
import { useUserStore } from '@/store/user';
import { useWalletStore } from '@/store/wallet';
import { color, space } from '@/theme/tokens';
import { textStyle } from '@/theme/typography';

/** Reusable detail template for both playable AND coming-soon games — the
 * only thing that changes is which fields the registry entry populates. */
export function GameDetailScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const game = getGameById(route.params?.gameId);
  const stats = useUserStore((s) => s.stats);
  const coins = useWalletStore((s) => s.coins);

  if (!game) {
    return (
      <SafeAreaView style={styles.safe}>
        <EmptyState title="Game not found" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <Header title={game.title} subtitle={game.category} onBack={() => navigation.goBack()} coins={coins} />
      <ScrollView contentContainerStyle={styles.scroll}>
        <GradientCard colors={game.gradient} decorative style={styles.banner}>
          <StatusPill
            label={game.status === 'coming_soon' ? 'COMING SOON' : 'PLAYABLE'}
            tone={game.status === 'coming_soon' ? 'muted' : 'teal'}
            variant={game.status === 'coming_soon' ? 'outline' : 'filled'}
            style={styles.bannerPill}
          />
          <Text style={styles.bannerCaption}>{game.category.toUpperCase()}</Text>
          <Text style={styles.title}>{game.title}</Text>
          <Text style={styles.tagline}>{game.description}</Text>
        </GradientCard>

        <StatGrid
          items={[
            { label: 'BEST SCORE', value: stats.bestScore },
            { label: 'GAMES', value: stats.runsPlayed },
            { label: 'LINES', value: stats.totalLinesCleared },
          ]}
        />

        {game.playable ? (
          <View style={styles.actions}>
            <Button label="PLAY" onPress={() => navigation.navigate(game.route ?? 'ClassicIntro')} />
            <Button label="DAILY CHALLENGE" variant="secondary" onPress={() => navigation.navigate('DailyChallenge')} />
          </View>
        ) : (
          <View style={styles.comingSoon}>
            <Text style={styles.body}>This game is still in the forge. Check back in a future update.</Text>
          </View>
        )}

        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.previews}>
          {[0, 1, 2].map((i) => (
            <View key={i} style={[styles.previewCard, { backgroundColor: shade(game.accent, 0.18) }]} />
          ))}
        </ScrollView>

        <View style={styles.howItWorks}>
          <Text style={styles.sectionTitle}>HOW IT WORKS</Text>
          {game.features.map((f) => (
            <Text key={f} style={styles.feature}>
              • {f}
            </Text>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function shade(hex: string, factor: number): string {
  const c = hex.replace('#', '');
  const num = parseInt(c, 16);
  const r = Math.round(((num >> 16) & 0xff) * factor);
  const g = Math.round(((num >> 8) & 0xff) * factor);
  const b = Math.round((num & 0xff) * factor);
  return `#${[r, g, b].map((v) => v.toString(16).padStart(2, '0')).join('')}`;
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: color.bg },
  scroll: { paddingHorizontal: space.lg, gap: space.lg, paddingBottom: space.xxl * 2 },
  banner: { gap: space.xs, minHeight: 200, justifyContent: 'flex-end', position: 'relative' },
  bannerPill: { position: 'absolute', top: 0, right: 0 },
  bannerCaption: { ...textStyle('caption'), color: color.accent300, fontWeight: '700', letterSpacing: 0.5 },
  title: { ...textStyle('display'), color: color.text },
  tagline: { ...textStyle('body'), color: color.accent300 },
  actions: { flexDirection: 'row', gap: space.sm, flexWrap: 'wrap' },
  comingSoon: { paddingVertical: space.sm },
  body: { ...textStyle('body'), color: color.textMuted },
  previews: { flexGrow: 0 },
  previewCard: { width: 140, height: 90, borderRadius: 14, marginRight: space.sm },
  howItWorks: { gap: space.xs },
  sectionTitle: { ...textStyle('caption'), color: color.textFaint, fontWeight: '600', marginBottom: space.xs },
  feature: { ...textStyle('body'), color: color.textMuted },
});
