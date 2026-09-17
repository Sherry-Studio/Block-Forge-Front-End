import React, { useState } from 'react';
import { FlatList, StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Button } from '@/components/Button';
import { getGameById } from '@/games/registry';
import { color, space } from '@/theme/tokens';
import { textStyle } from '@/theme/typography';

const SLIDES = ['Drag & drop gameplay', 'Chain combos for bonus points', 'Daily challenges and leaderboards'];

/** Modal pager showing a few gradient placeholder preview slides for a game. */
export function PreviewsScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const { width } = useWindowDimensions();
  const game = getGameById(route.params?.gameId);
  const [index, setIndex] = useState(0);

  return (
    <SafeAreaView style={styles.safe}>
      <FlatList
        data={SLIDES}
        keyExtractor={(s) => s}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={(e) => setIndex(Math.round(e.nativeEvent.contentOffset.x / width))}
        renderItem={({ item }) => (
          <View style={[styles.slide, { width, backgroundColor: game?.accent ?? color.accent }]}>
            <Text style={styles.slideText}>{item}</Text>
          </View>
        )}
      />
      <View style={styles.dots}>
        {SLIDES.map((_, i) => (
          <View key={i} style={[styles.dot, i === index && styles.dotActive]} />
        ))}
      </View>
      <Button label="Close" variant="secondary" onPress={() => navigation.goBack()} style={styles.close} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: color.bg },
  slide: { alignItems: 'center', justifyContent: 'center', padding: space.xxl },
  slideText: { ...textStyle('h1'), color: '#161826', textAlign: 'center' },
  dots: { flexDirection: 'row', justifyContent: 'center', gap: space.xs, marginTop: space.md },
  dot: { width: 6, height: 6, borderRadius: 3, backgroundColor: color.hairline },
  dotActive: { backgroundColor: color.accent },
  close: { margin: space.lg },
});
