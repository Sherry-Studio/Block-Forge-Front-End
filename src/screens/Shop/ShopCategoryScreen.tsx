import React from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRoute } from '@react-navigation/native';
import { Card } from '@/components/Card';
import { Tag } from '@/components/Tag';
import { blocks, color, radius, space } from '@/theme/tokens';
import { textStyle } from '@/theme/typography';

const PLACEHOLDER_ITEMS = Array.from({ length: 6 }).map((_, i) => ({ id: `item-${i}`, name: `Item ${i + 1}` }));

export function ShopCategoryScreen() {
  const route = useRoute<any>();
  const category = route.params?.category ?? 'Items';

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <Text style={styles.title}>{category}</Text>
      <FlatList
        data={PLACEHOLDER_ITEMS}
        keyExtractor={(i) => i.id}
        numColumns={2}
        columnWrapperStyle={styles.row}
        contentContainerStyle={styles.list}
        renderItem={({ item, index }) => (
          <Card style={styles.card}>
            <View style={[styles.swatch, { backgroundColor: blocks[index % blocks.length][0] }]} />
            <Text style={styles.name}>{item.name}</Text>
            <Tag label="Locked" />
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
  row: { gap: space.sm },
  card: { flex: 1, gap: space.xs, alignItems: 'center' },
  swatch: { width: 48, height: 48, borderRadius: radius.md },
  name: { ...textStyle('body'), color: color.text },
});
