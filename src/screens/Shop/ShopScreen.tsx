import React from 'react';
import { FlatList, StyleSheet, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Card } from '@/components/Card';
import { Tag } from '@/components/Tag';
import { Button } from '@/components/Button';
import { color, space } from '@/theme/tokens';
import { textStyle } from '@/theme/typography';

const CATEGORIES = ['Block Themes', 'Board Themes', 'Backgrounds', 'Effects'];

export function ShopScreen() {
  const navigation = useNavigation<any>();
  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <Text style={styles.title}>Shop</Text>
      <FlatList
        data={CATEGORIES}
        keyExtractor={(c) => c}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <Card style={styles.card} onPress={() => navigation.navigate('ShopCategory', { category: item })}>
            <Text style={styles.categoryTitle}>{item}</Text>
            <Tag label="Coming Soon" />
          </Card>
        )}
      />
      <Button label="Power-Ups" variant="secondary" onPress={() => navigation.navigate('PowerUps')} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: color.bg, paddingHorizontal: space.lg, gap: space.sm },
  title: { ...textStyle('h1'), color: color.text, marginTop: space.sm },
  list: { gap: space.sm, paddingVertical: space.md },
  card: { gap: space.xs },
  categoryTitle: { ...textStyle('h2'), color: color.text },
});
