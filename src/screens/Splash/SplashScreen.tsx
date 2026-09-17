import React, { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { SettingsRepository } from '@/storage/SettingsRepository';
import { color, space } from '@/theme/tokens';
import { textStyle } from '@/theme/typography';

const MIN_SPLASH_MS = 1400;

export function SplashScreen() {
  const navigation = useNavigation<any>();

  useEffect(() => {
    const start = Date.now();
    const advance = () => {
      const elapsed = Date.now() - start;
      const wait = Math.max(0, MIN_SPLASH_MS - elapsed);
      setTimeout(() => {
        const done = SettingsRepository.isOnboardingDone();
        navigation.reset({
          index: 0,
          routes: [{ name: done ? 'Main' : 'Onboarding' }],
        });
      }, wait);
    };
    advance();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <View style={styles.container} accessibilityRole="alert" accessibilityLabel="Block Forge loading">
      <Text style={styles.title}>BLOCK FORGE</Text>
      <Text style={styles.subtitle}>a Sherry Studio game</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: color.bg, alignItems: 'center', justifyContent: 'center', gap: space.sm },
  title: { ...textStyle('display'), color: color.accent300 },
  subtitle: { ...textStyle('caption'), color: color.textFaint },
});
