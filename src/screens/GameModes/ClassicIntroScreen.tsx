import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Button } from '@/components/Button';
import { Header } from '@/components/Header';
import { useUserStore } from '@/store/user';
import { color, space } from '@/theme/tokens';
import { textStyle, tabularNums } from '@/theme/typography';

export function ClassicIntroScreen() {
  const navigation = useNavigation<any>();
  const stats = useUserStore((s) => s.stats);

  return (
    <SafeAreaView style={styles.safe}>
      <Header title="Classic" onBack={() => navigation.goBack()} />
      <View style={styles.content}>
        <Text style={styles.title}>Classic</Text>
        <Text style={styles.body}>Endless play. Clear lines, chain combos, beat your best score.</Text>
        <Text style={styles.statLabel}>YOUR BEST</Text>
        <Text style={styles.stat}>{stats.bestScore}</Text>
      </View>
      <Button
        label="Start"
        variant="filled"
        onPress={() => navigation.navigate('Play', { mode: 'classic' })}
        style={styles.button}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: color.bg, paddingBottom: space.xxl, justifyContent: 'space-between' },
  content: { flex: 1, justifyContent: 'center', gap: space.sm, paddingHorizontal: space.xxl },
  title: { ...textStyle('display'), color: color.text },
  body: { ...textStyle('body'), color: color.textMuted },
  statLabel: { ...textStyle('caption'), color: color.textFaint, marginTop: space.lg },
  stat: { ...textStyle('h1'), ...tabularNums, color: color.accent300 },
  button: { marginHorizontal: space.xxl, marginBottom: space.lg },
});
