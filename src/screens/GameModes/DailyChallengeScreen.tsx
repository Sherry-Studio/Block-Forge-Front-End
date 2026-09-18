import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Button } from '@/components/Button';
import { GradientCard } from '@/components/GradientCard';
import { Header } from '@/components/Header';
import { StatusPill } from '@/components/StatusPill';
import { OfflineState } from '@/components/ErrorState';
import { seedFromUTCDate } from '@/game/rng';
import { ScoreRepository } from '@/storage/ScoreRepository';
import { color, space } from '@/theme/tokens';
import { textStyle } from '@/theme/typography';

type DailyState = 'available' | 'in_progress' | 'completed' | 'already_played' | 'offline';

function todayISO(): string {
  return new Date().toISOString().slice(0, 10);
}

async function checkOnline(): Promise<boolean> {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 2500);
    await fetch('https://clients3.google.com/generate_204', { signal: controller.signal });
    clearTimeout(timeout);
    return true;
  } catch {
    return false;
  }
}

export function DailyChallengeScreen() {
  const navigation = useNavigation<any>();
  const [state, setState] = useState<DailyState>('available');
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const online = await checkOnline();
      if (cancelled) return;
      if (!online) {
        setState('offline');
        setChecking(false);
        return;
      }
      const streak = ScoreRepository.getStreak();
      setState(streak.lastPlayedISODate === todayISO() ? 'already_played' : 'available');
      setChecking(false);
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const seed = seedFromUTCDate(new Date());

  if (checking) {
    return (
      <SafeAreaView style={styles.safe}>
        <Header title="Daily Challenge" onBack={() => navigation.goBack()} />
        <Text style={[styles.body, styles.centerPad]}>Checking today&apos;s challenge...</Text>
      </SafeAreaView>
    );
  }

  if (state === 'offline') {
    return (
      <SafeAreaView style={styles.safe}>
        <Header title="Daily Challenge" onBack={() => navigation.goBack()} />
        <View style={styles.centerPad}>
          <OfflineState onRetry={() => setChecking(true)} />
          <Text style={styles.cachedNote}>Your last cached objective is shown when a connection returns.</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      <Header title="Daily Challenge" onBack={() => navigation.goBack()} />
      <View style={styles.content}>
        <GradientCard colors={['#16342f', '#161826']} decorative style={styles.card}>
          <StatusPill label="DAILY CHALLENGE" tone="gold" variant="outline" />
          <Text style={styles.title}>Today&apos;s Puzzle</Text>
          <Text style={styles.body}>Seed #{seed}. Everyone plays the same board today.</Text>
          {state === 'already_played' && <StatusPill label="ALREADY PLAYED TODAY" tone="muted" />}
        </GradientCard>
      </View>
      <View style={styles.footer}>
        <Button
          label={state === 'already_played' ? 'Come back tomorrow' : 'Play Daily Challenge'}
          variant="filled"
          state={state === 'already_played' ? 'disabled' : 'idle'}
          onPress={() => navigation.navigate('Play', { mode: 'daily', seed })}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: color.bg },
  content: { flex: 1, justifyContent: 'center', paddingHorizontal: space.lg },
  card: { gap: space.sm },
  footer: { padding: space.lg },
  centerPad: { paddingHorizontal: space.xxl, marginTop: space.lg },
  title: { ...textStyle('display'), color: color.text },
  body: { ...textStyle('body'), color: color.textMuted },
  cachedNote: { ...textStyle('caption'), color: color.textFaint, textAlign: 'center', marginTop: space.sm },
});
