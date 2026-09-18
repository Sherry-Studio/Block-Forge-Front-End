import React from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Header } from '@/components/Header';
import { StatusPill } from '@/components/StatusPill';
import { blocks, color, radius, space } from '@/theme/tokens';
import { textStyle } from '@/theme/typography';

const PLACEHOLDER_ITEMS = Array.from({ length: 6 }).map((_, i) => ({ id: `item-${i}`, name: `Item ${i + 1}` }));

export function ShopCategoryScreen() {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const category = route.params?.category ?? 'Items';

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <Header title={category} onBack={() => navigation.goBack()} />
      <FlatList
        data={PLACEHOLDER_ITEMS}
        keyExtractor={(i) => i.id}
        numColumns={2}
        columnWrapperStyle={styles.row}
        contentContainerStyle={styles.list}
        renderItem={({ item, index }) => (
          <View style={styles.card}>
            <View style={[styles.swatch, { backgroundColor: blocks[index % blocks.length][0] }]} />
            <Text style={styles.name}>{item.name}</Text>
            <StatusPill label="LOCKED" tone="muted" />
          </View>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: color.bg },
  list: { gap: space.sm, paddingHorizontal: space.lg, paddingVertical: space.md, paddingBottom: space.xxl * 2 },
  row: { gap: space.sm },
  card: {
    flex: 1,
    gap: space.xs,
    alignItems: 'center',
    backgroundColor: color.card,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: color.hairline,
    padding: space.lg,
  },
  swatch: { width: 48, height: 48, borderRadius: radius.md },
  name: { ...textStyle('body'), color: color.text },
});
