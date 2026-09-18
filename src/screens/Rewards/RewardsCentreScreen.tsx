import React, { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Button } from '@/components/Button';
import { GradientCard } from '@/components/GradientCard';
import { Header } from '@/components/Header';
import { IconTile } from '@/components/IconTile';
import { ListRow } from '@/components/ListRow';
import { StatusPill } from '@/components/StatusPill';
import { RewardRepository } from '@/storage/RewardRepository';
import { outbox } from '@/api/outbox';
import { useUserStore } from '@/store/user';
import { useWalletStore } from '@/store/wallet';
import { color, radius, space } from '@/theme/tokens';
import { textStyle, tabularNums } from '@/theme/typography';

const DAILY_AMOUNTS = [80, 120, 160, 200, 280, 320, 500];

export function RewardsCentreScreen() {
  const navigation = useNavigation<any>();
  const coins = useWalletStore((s) => s.coins);
  const addCoins = useWalletStore((s) => s.addCoins);
  const streak = useUserStore((s) => s.streak);
  const [achievements, setAchievements] = useState(RewardRepository.getAchievements());
  const [dayClaimed, setDayClaimed] = useState(false);

  const dayIndex = Math.min(6, streak.currentStreak % 7);
  const dayAmount = DAILY_AMOUNTS[dayIndex];

  const pending = achievements.filter((a) => a.state !== 'claimed');

  const handleClaimDay = () => {
    addCoins(dayAmount);
    setDayClaimed(true);
  };

  const handleClaim = (id: string) => {
    outbox.enqueue('claim_achievement', { id });
    setAchievements(RewardRepository.claim(id));
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <Header title="Rewards" subtitle="Daily, milestones, challenges" onBack={() => navigation.goBack()} coins={coins} />
      <ScrollView contentContainerStyle={styles.scroll}>
        <GradientCard colors={['#2a2410', '#161826']} style={styles.streakCard}>
          <Text style={styles.streakLabel}>DAILY REWARD</Text>
          <View style={styles.streakRow}>
            {DAILY_AMOUNTS.map((amount, i) => {
              const isToday = i === dayIndex;
              const isPast = i < dayIndex;
              return (
                <View
                  key={i}
                  style={[
                    styles.dayPill,
                    isToday && styles.dayPillToday,
                    (isPast || (isToday && dayClaimed)) && styles.dayPillDone,
                  ]}
                >
                  <Text style={[styles.dayLabel, isToday && styles.dayLabelToday]}>{`D${i + 1}`}</Text>
                  <Text style={[styles.dayAmount, isToday && styles.dayAmountToday]}>{`+${amount}`}</Text>
                </View>
              );
            })}
          </View>
          <Button
            label={dayClaimed ? 'CLAIMED' : `CLAIM DAY ${dayIndex + 1} · +${dayAmount}`}
            variant="filled"
            state={dayClaimed ? 'disabled' : 'idle'}
            onPress={handleClaimDay}
          />
        </GradientCard>

        <Text style={styles.sectionTitle}>PENDING REWARDS</Text>
        {pending.length === 0 ? (
          <Text style={styles.body}>Nothing pending — keep playing to unlock more.</Text>
        ) : (
          <View style={styles.list}>
            {pending.map((a) => {
              const unlocked = a.state === 'unlocked';
              return (
                <View key={a.id} style={styles.rewardRow}>
                  <ListRow
                    label={a.title}
                    subtitle={a.description}
                    iconColors={unlocked ? ['#e0c03c', '#a88a1e'] : undefined}
                    icon={<View style={styles.rowGlyph} />}
                    trailing={
                      unlocked ? (
                        <Pressable onPress={() => handleClaim(a.id)}>
                          <StatusPill label="CLAIM" tone="gold" variant="outline" />
                        </Pressable>
                      ) : (
                        <StatusPill label="LOCKED" tone="muted" variant="outline" />
                      )
                    }
                  />
                </View>
              );
            })}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: color.bg },
  scroll: { padding: space.lg, gap: space.lg, paddingBottom: space.xxl * 2 },
  streakCard: { gap: space.md, borderWidth: 1, borderColor: 'rgba(224,192,60,0.35)' },
  streakLabel: { ...textStyle('caption'), color: color.gold, fontWeight: '700', letterSpacing: 1 },
  streakRow: { flexDirection: 'row', gap: space.xs },
  dayPill: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: space.sm,
    borderRadius: radius.md,
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderWidth: 1,
    borderColor: 'transparent',
  },
  dayPillToday: { borderColor: color.gold, backgroundColor: 'rgba(224,192,60,0.12)' },
  dayPillDone: { opacity: 0.5 },
  dayLabel: { ...textStyle('caption'), color: color.textFaint, fontWeight: '700' },
  dayLabelToday: { color: color.gold },
  dayAmount: { ...textStyle('caption'), ...tabularNums, color: color.textMuted, marginTop: 2 },
  dayAmountToday: { color: color.gold, fontWeight: '700' },
  sectionTitle: { ...textStyle('caption'), color: color.textFaint, fontWeight: '700', letterSpacing: 0.5 },
  body: { ...textStyle('body'), color: color.textMuted },
  list: { gap: space.sm },
  rewardRow: {
    backgroundColor: color.card,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: color.hairline,
    paddingHorizontal: space.lg,
  },
  rowGlyph: { width: 16, height: 16, borderRadius: radius.sm, backgroundColor: 'rgba(255,255,255,0.5)' },
});
