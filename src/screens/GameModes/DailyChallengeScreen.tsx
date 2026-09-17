import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Button } from '@/components/Button';
import { Tag } from '@/components/Tag';
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
        <Text style={styles.body}>Checking today's challenge...</Text>
      </SafeAreaView>
    );
  }

  if (state === 'offline') {
    return (
      <SafeAreaView style={styles.safe}>
        <OfflineState onRetry={() => setChecking(true)} />
        <Text style={styles.cachedNote}>Your last cached objective is shown when a connection returns.</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.content}>
        <Tag label="Daily Challenge" tone="gold" />
        <Text style={styles.title}>Today's Puzzle</Text>
        <Text style={styles.body}>Seed #{seed}. Everyone plays the same board today.</Text>
        {state === 'already_played' && (
          <Tag label="Already played today" tone="default" />
        )}
      </View>
      <Button
        label={state === 'already_played' ? 'Come back tomorrow' : 'Play Daily Challenge'}
        state={state === 'already_played' ? 'disabled' : 'idle'}
        onPress={() => navigation.navigate('Play', { mode: 'daily', seed })}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: color.bg, padding: space.xxl, justifyContent: 'space-between' },
  content: { flex: 1, justifyContent: 'center', gap: space.sm },
  title: { ...textStyle('display'), color: color.text },
  body: { ...textStyle('body'), color: color.textMuted },
  cachedNote: { ...textStyle('caption'), color: color.textFaint, textAlign: 'center', marginTop: space.sm },
});
