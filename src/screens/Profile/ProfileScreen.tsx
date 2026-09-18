import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Avatar } from '@/components/Avatar';
import { Header } from '@/components/Header';
import { ListRow } from '@/components/ListRow';
import { StatGrid } from '@/components/StatGrid';
import { useUserStore } from '@/store/user';
import { useWalletStore } from '@/store/wallet';
import { color, space } from '@/theme/tokens';
import { textStyle } from '@/theme/typography';

const JOIN_DATE = 'March 2026';
const USERNAME = 'rk_forge';

export function ProfileScreen() {
  const navigation = useNavigation<any>();
  const stats = useUserStore((s) => s.stats);
  const streak = useUserStore((s) => s.streak);
  const coins = useWalletStore((s) => s.coins);
  const level = useWalletStore((s) => s.level);

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <Header title="Profile" subtitle={USERNAME} onBack={() => navigation.goBack()} coins={coins} />
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.identity}>
          <Avatar name="RK" size={64} />
          <View style={styles.identityText}>
            <Text style={styles.username}>{USERNAME}</Text>
            <Text style={styles.meta}>
              Joined {JOIN_DATE} · Level {level}
            </Text>
            <Text style={styles.favourite}>Favourite: Blockforge</Text>
          </View>
        </View>

        <StatGrid
          columns={3}
          items={[
            { label: 'BEST SCORE', value: stats.bestScore },
            { label: 'GAMES PLAYED', value: stats.runsPlayed },
            { label: 'LINES CLEARED', value: stats.totalLinesCleared },
            { label: 'BEST COMBO', value: `x${stats.bestCombo}` },
            { label: 'BLOCKS PLACED', value: stats.totalBlocksPlaced },
            { label: 'DAY STREAK', value: streak.currentStreak },
          ]}
        />

        <View style={styles.list}>
          <ListRow
            label="Statistics"
            trailingText="Lifetime"
            chevron
            iconColors={['#3a3d52', '#232532']}
            style={styles.row}
            onPress={() => navigation.navigate('Statistics')}
          />
          <ListRow
            label="Achievements"
            trailingText="7 / 24"
            chevron
            iconColors={['#5d5294', '#2b2741']}
            style={styles.row}
            onPress={() => navigation.navigate('Achievements')}
          />
          <ListRow
            label="Leaderboard"
            trailingText="Rank 412"
            chevron
            iconColors={['#4aa8e6', '#2a74ac']}
            style={styles.row}
            onPress={() => navigation.navigate('Leaderboard')}
          />
          <ListRow
            label="Settings"
            chevron
            iconColors={['#232532', '#161826']}
            style={[styles.row, styles.rowLast]}
            onPress={() => navigation.getParent()?.navigate('SettingsTab')}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: color.bg },
  scroll: { padding: space.lg, gap: space.lg, paddingBottom: space.xxl * 2 },
  identity: { flexDirection: 'row', alignItems: 'center', gap: space.lg },
  identityText: { gap: 2, flex: 1 },
  username: { ...textStyle('h1'), color: color.text },
  meta: { ...textStyle('caption'), color: color.textFaint },
  favourite: { ...textStyle('caption'), color: color.accent300, fontWeight: '600', marginTop: 2 },
  list: { gap: space.sm },
  row: {
    backgroundColor: color.card,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: color.hairline,
    paddingHorizontal: space.lg,
  },
  rowLast: {},
});
