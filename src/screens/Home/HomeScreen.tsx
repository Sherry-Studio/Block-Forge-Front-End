import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Avatar } from '@/components/Avatar';
import { Button } from '@/components/Button';
import { GradientCard } from '@/components/GradientCard';
import { IconTile } from '@/components/IconTile';
import { StatusPill } from '@/components/StatusPill';
import { CATEGORIES, getGamesByCategory } from '@/games/registry';
import { GameRepository } from '@/storage/GameRepository';
import { useUserStore } from '@/store/user';
import { useWalletStore } from '@/store/wallet';
import { color, radius, space } from '@/theme/tokens';
import { textStyle, tabularNums } from '@/theme/typography';

export function HomeScreen() {
  const navigation = useNavigation<any>();
  const stats = useUserStore((s) => s.stats);
  const streak = useUserStore((s) => s.streak);
  const coins = useWalletStore((s) => s.coins);
  const level = useWalletStore((s) => s.level);
  const levelProgress = useWalletStore((s) => s.levelProgress);
  const hasActiveRun = GameRepository.hasActiveRun();

  const variant = hasActiveRun ? 'continue' : stats.runsPlayed > 0 ? 'returning' : 'new';

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView contentContainerStyle={styles.scroll}>
        {/* Top row: avatar + welcome + level bar, coin pill + gear */}
        <View style={styles.topRow}>
          <View style={styles.topLeft}>
            <Avatar name="Player" size={44} />
            <View style={styles.topText}>
              <Text style={styles.welcome}>Welcome, player</Text>
              <View style={styles.levelRow}>
                <View style={styles.levelBarTrack}>
                  <View style={[styles.levelBarFill, { width: `${Math.round(levelProgress * 100)}%` }]} />
                </View>
                <Text style={styles.levelLabel}>LVL {level}</Text>
              </View>
            </View>
          </View>
          <View style={styles.topRight}>
            <View style={styles.coinPill}>
              <View style={styles.coinDot} />
              <Text style={styles.coinText}>{coins.toLocaleString()}</Text>
            </View>
            <Pressable
              onPress={() => navigation.getParent()?.navigate('SettingsTab')}
              accessibilityRole="button"
              accessibilityLabel="Settings"
            >
              <IconTile size={36}>
                <Text style={styles.gear}>{'⚙'}</Text>
              </IconTile>
            </Pressable>
          </View>
        </View>

        {/* Featured hero */}
        <GradientCard colors={['#5d5294', '#2b2741']} decorative style={styles.hero}>
          <StatusPill label="PUZZLE · FLAGSHIP" tone="muted" />
          <Text style={styles.heroTitle}>Blockforge</Text>
          <Text style={styles.heroBody}>Drag, fill, clear. Chain combos for a new high score.</Text>
          <View style={styles.heroStatsRow}>
            <View>
              <Text style={styles.heroStatValue}>{stats.bestScore}</Text>
              <Text style={styles.heroStatLabel}>BEST</Text>
            </View>
            <View>
              <Text style={styles.heroStatValue}>{streak.currentStreak}</Text>
              <Text style={styles.heroStatLabel}>STREAK</Text>
            </View>
          </View>
          <View style={styles.heroActions}>
            <Button
              label={variant === 'continue' ? 'RESUME RUN' : 'START PLAYING'}
              variant="filled"
              onPress={() => navigation.navigate('ClassicIntro')}
            />
            <Button
              label="Details"
              variant="ghost"
              onPress={() => navigation.navigate('GameDetail', { gameId: 'blockforge' })}
            />
          </View>
        </GradientCard>

        {/* Daily challenge */}
        <GradientCard
          colors={['#16342f', '#161826']}
          style={styles.tealCard}
          onPress={() => navigation.navigate('DailyChallenge')}
        >
          <StatusPill label="Daily Challenge" tone="teal" variant="outline" />
          <Text style={styles.sectionTitle}>Today&apos;s puzzle is ready</Text>
          <View style={styles.progressTrack}>
            <View style={[styles.progressFill, { width: '40%', backgroundColor: color.teal }]} />
          </View>
        </GradientCard>

        {/* Rewards teaser */}
        <GradientCard
          colors={['#2a2410', '#161826']}
          style={styles.goldCard}
          onPress={() => navigation.getParent()?.navigate('RewardsTab')}
        >
          <StatusPill label="Rewards Centre" tone="gold" variant="outline" />
          <Text style={styles.body}>Unclaimed achievements are waiting.</Text>
        </GradientCard>

        {CATEGORIES.map((category) => {
          const games = getGamesByCategory(category);
          if (games.length === 0) return null;
          return (
            <View key={category} style={styles.section}>
              <Text style={styles.sectionTitle}>{category}</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {games.map((game) => (
                  <Pressable
                    key={game.id}
                    style={styles.gameCard}
                    onPress={() => navigation.navigate('GameDetail', { gameId: game.id })}
                  >
                    <IconTile colors={gameGradient(game.accent)} size={64} style={styles.gameIcon}>
                      <View style={styles.glyph} />
                    </IconTile>
                    <Text style={styles.gameTitle} numberOfLines={1}>
                      {game.title}
                    </Text>
                    <Text style={styles.gameCategory}>{game.category}</Text>
                    <StatusPill
                      label={game.status === 'coming_soon' ? 'COMING SOON' : 'PLAY'}
                      tone={game.status === 'coming_soon' ? 'muted' : 'teal'}
                      variant={game.status === 'coming_soon' ? 'outline' : 'filled'}
                    />
                  </Pressable>
                ))}
              </ScrollView>
            </View>
          );
        })}
      </ScrollView>
    </SafeAreaView>
  );
}

function gameGradient(accent: string): [string, string] {
  return [accent, shade(accent, 0.55)];
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
  scroll: { padding: space.lg, gap: space.lg, paddingBottom: space.xxl * 2 },
  topRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  topLeft: { flexDirection: 'row', alignItems: 'center', gap: space.md, flex: 1 },
  topText: { flex: 1 },
  welcome: { ...textStyle('h2'), color: color.text },
  levelRow: { flexDirection: 'row', alignItems: 'center', gap: space.xs, marginTop: 4 },
  levelBarTrack: { width: 80, height: 5, borderRadius: 3, backgroundColor: color.raised, overflow: 'hidden' },
  levelBarFill: { height: '100%', backgroundColor: color.accent, borderRadius: 3 },
  levelLabel: { ...textStyle('caption'), color: color.textFaint },
  topRight: { flexDirection: 'row', alignItems: 'center', gap: space.sm },
  coinPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 5,
    paddingHorizontal: space.sm + 2,
    borderRadius: radius.pill,
    backgroundColor: color.raised,
    borderWidth: 1,
    borderColor: color.hairline,
  },
  coinDot: { width: 9, height: 9, borderRadius: 5, backgroundColor: color.gold },
  coinText: { ...textStyle('body'), ...tabularNums, color: color.text, fontWeight: '600' },
  gear: { color: color.text, fontSize: 16 },
  hero: { gap: space.sm },
  heroTitle: { ...textStyle('display'), color: color.text },
  heroBody: { ...textStyle('body'), color: color.accent300 },
  heroStatsRow: { flexDirection: 'row', gap: space.xxl, marginTop: space.xs },
  heroStatValue: { ...textStyle('h1'), ...tabularNums, color: color.text },
  heroStatLabel: { ...textStyle('caption'), color: color.accent300, marginTop: 2 },
  heroActions: { flexDirection: 'row', gap: space.sm, marginTop: space.sm, flexWrap: 'wrap' },
  tealCard: { gap: space.sm },
  goldCard: { gap: space.xs },
  sectionTitle: { ...textStyle('h2'), color: color.text },
  body: { ...textStyle('body'), color: color.textMuted },
  progressTrack: { height: 6, borderRadius: 3, backgroundColor: 'rgba(255,255,255,0.08)', overflow: 'hidden' },
  progressFill: { height: '100%', borderRadius: 3 },
  section: { gap: space.sm },
  gameCard: { width: 100, marginRight: space.md, gap: 6 },
  gameIcon: { marginBottom: 2 },
  glyph: { width: 20, height: 20, borderRadius: radius.sm, backgroundColor: 'rgba(255,255,255,0.35)' },
  gameTitle: { ...textStyle('body'), color: color.text, fontWeight: '600' },
  gameCategory: { ...textStyle('caption'), color: color.textFaint },
});
