import React, { useMemo, useState } from 'react';
import { FlatList, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Card } from '@/components/Card';
import { Tag } from '@/components/Tag';
import { EmptyState } from '@/components/EmptyState';
import { CATEGORIES, GAME_REGISTRY } from '@/games/registry';
import { color, radius, space } from '@/theme/tokens';
import { textStyle } from '@/theme/typography';

export function GamesHubScreen() {
  const navigation = useNavigation<any>();
  const [query, setQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const filtered = useMemo(() => {
    return GAME_REGISTRY.filter((g) => {
      const matchesQuery = g.title.toLowerCase().includes(query.toLowerCase());
      const matchesCategory = !activeCategory || g.category === activeCategory;
      return matchesQuery && matchesCategory;
    });
  }, [query, activeCategory]);

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <Text style={styles.title}>Games</Text>
      <TextInput
        style={styles.search}
        placeholder="Search games"
        placeholderTextColor={color.textFaint}
        value={query}
        onChangeText={setQuery}
        accessibilityLabel="Search games"
      />
      <View style={styles.chips}>
        <Tag label="All" tone={activeCategory === null ? 'accent' : 'default'} />
        {CATEGORIES.map((c) => (
          <View key={c} onTouchEnd={() => setActiveCategory(activeCategory === c ? null : c)}>
            <Tag label={c} tone={activeCategory === c ? 'accent' : 'default'} />
          </View>
        ))}
      </View>

      <FlatList
        data={filtered}
        keyExtractor={(g) => g.id}
        contentContainerStyle={styles.list}
        ListEmptyComponent={<EmptyState title="No games found" message="Try a different search or category." />}
        renderItem={({ item }) => (
          <Card style={styles.card} onPress={() => navigation.navigate('GameDetail', { gameId: item.id })}>
            <View style={styles.cardHeader}>
              <Text style={styles.gameTitle}>{item.title}</Text>
              {item.status === 'coming_soon' && <Tag label="Coming Soon" />}
            </View>
            <Text style={styles.description}>{item.description}</Text>
          </Card>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: color.bg, paddingHorizontal: space.lg },
  title: { ...textStyle('h1'), color: color.text, marginTop: space.sm },
  search: {
    backgroundColor: color.card,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: color.hairline,
    paddingHorizontal: space.md,
    paddingVertical: space.sm,
    color: color.text,
    marginTop: space.md,
  },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: space.xs, marginTop: space.md },
  list: { gap: space.sm, paddingVertical: space.md, paddingBottom: space.xxl * 2 },
  card: { gap: space.xs },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  gameTitle: { ...textStyle('h2'), color: color.text },
  description: { ...textStyle('body'), color: color.textMuted },
});
