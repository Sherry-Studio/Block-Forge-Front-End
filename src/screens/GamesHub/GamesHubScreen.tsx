import React, { useMemo, useState } from 'react';
import { FlatList, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { EmptyState } from '@/components/EmptyState';
import { Header } from '@/components/Header';
import { IconTile } from '@/components/IconTile';
import { StatusPill } from '@/components/StatusPill';
import { CATEGORIES, GAME_REGISTRY } from '@/games/registry';
import { useWalletStore } from '@/store/wallet';
import { color, radius, space } from '@/theme/tokens';
import { textStyle } from '@/theme/typography';

export function GamesHubScreen() {
  const navigation = useNavigation<any>();
  const coins = useWalletStore((s) => s.coins);
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
      <Header title="Games" subtitle={`${GAME_REGISTRY.length} titles · ${CATEGORIES.length} categories`} coins={coins} />

      <View style={styles.body}>
        <TextInput
          style={styles.search}
          placeholder={`Search ${GAME_REGISTRY.length} games`}
          placeholderTextColor={color.textFaint}
          value={query}
          onChangeText={setQuery}
          accessibilityLabel="Search games"
        />

        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipsRow}>
          <Chip label="All" active={activeCategory === null} onPress={() => setActiveCategory(null)} />
          {CATEGORIES.map((c) => (
            <Chip key={c} label={c} active={activeCategory === c} onPress={() => setActiveCategory(activeCategory === c ? null : c)} />
          ))}
        </ScrollView>

        <FlatList
          data={filtered}
          keyExtractor={(g) => g.id}
          contentContainerStyle={styles.list}
          ListEmptyComponent={<EmptyState title="No games found" message="Try a different search or category." />}
          renderItem={({ item }) => (
            <Pressable style={styles.row} onPress={() => navigation.navigate('GameDetail', { gameId: item.id })}>
              <IconTile colors={item.gradient} size={52}>
                <Text style={styles.glyph}>{item.glyph}</Text>
              </IconTile>
              <View style={styles.rowText}>
                <View style={styles.rowHeader}>
                  <Text style={styles.gameTitle}>{item.title}</Text>
                  <StatusPill
                    label={item.status === 'coming_soon' ? 'COMING SOON' : 'PLAY'}
                    tone={item.status === 'coming_soon' ? 'muted' : 'teal'}
                    variant={item.status === 'coming_soon' ? 'outline' : 'filled'}
                  />
                </View>
                <Text style={styles.category}>{item.category}</Text>
                <Text style={styles.description} numberOfLines={2}>
                  {item.description}
                </Text>
              </View>
            </Pressable>
          )}
        />
      </View>
    </SafeAreaView>
  );
}

function Chip({ label, active, onPress }: { label: string; active: boolean; onPress: () => void }) {
  return (
    <Pressable onPress={onPress} style={[styles.chip, active && styles.chipActive]}>
      <Text style={[styles.chipLabel, active && styles.chipLabelActive]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: color.bg },
  body: { flex: 1, paddingHorizontal: space.lg },
  search: {
    backgroundColor: color.card,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: color.hairline,
    paddingHorizontal: space.lg,
    paddingVertical: space.sm + 2,
    color: color.text,
    marginTop: space.xs,
  },
  chipsRow: { marginTop: space.md, flexGrow: 0 },
  chip: {
    paddingVertical: 6,
    paddingHorizontal: space.lg,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: color.hairline,
    backgroundColor: color.card,
    marginRight: space.xs,
  },
  chipActive: { backgroundColor: color.accent, borderColor: color.accent },
  chipLabel: { ...textStyle('caption'), color: color.textMuted, fontWeight: '600' },
  chipLabelActive: { color: color.bg },
  list: { gap: space.lg, paddingVertical: space.lg, paddingBottom: space.xxl * 2 },
  row: { flexDirection: 'row', gap: space.md },
  glyph: { fontSize: 22, color: 'rgba(255,255,255,0.85)' },
  rowText: { flex: 1, gap: 3 },
  rowHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  gameTitle: { ...textStyle('h2'), color: color.text },
  category: { ...textStyle('caption'), color: color.textFaint },
  description: { ...textStyle('body'), color: color.textMuted },
});
