import React from 'react';
import { FlatList, StyleSheet, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Card } from '@/components/Card';
import { Tag } from '@/components/Tag';
import { EmptyState } from '@/components/EmptyState';
import { getGamesByCategory } from '@/games/registry';
import { color, space } from '@/theme/tokens';
import { textStyle } from '@/theme/typography';

export function CategoryScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const category = route.params?.category ?? 'Puzzle';
  const games = getGamesByCategory(category);

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <Text style={styles.title}>{category}</Text>
      <FlatList
        data={games}
        keyExtractor={(g) => g.id}
        contentContainerStyle={styles.list}
        ListEmptyComponent={<EmptyState title="No games yet" message="Check back soon." />}
        renderItem={({ item }) => (
          <Card style={styles.card} onPress={() => navigation.navigate('GameDetail', { gameId: item.id })}>
            <Text style={styles.gameTitle}>{item.title}</Text>
            {item.status === 'coming_soon' && <Tag label="Coming Soon" />}
          </Card>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: color.bg, paddingHorizontal: space.lg },
  title: { ...textStyle('h1'), color: color.text, marginTop: space.sm },
  list: { gap: space.sm, paddingVertical: space.md, paddingBottom: space.xxl * 2 },
  card: { gap: space.xs },
  gameTitle: { ...textStyle('h2'), color: color.text },
});
