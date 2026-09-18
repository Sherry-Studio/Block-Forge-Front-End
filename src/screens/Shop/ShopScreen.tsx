import React from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Header } from '@/components/Header';
import { ListRow } from '@/components/ListRow';
import { StatusPill } from '@/components/StatusPill';
import { Button } from '@/components/Button';
import { useWalletStore } from '@/store/wallet';
import { color, space } from '@/theme/tokens';

const CATEGORIES = ['Block Themes', 'Board Themes', 'Backgrounds', 'Effects'];

export function ShopScreen() {
  const navigation = useNavigation<any>();
  const coins = useWalletStore((s) => s.coins);
  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <Header title="Shop" onBack={() => navigation.goBack()} coins={coins} />
      <FlatList
        data={CATEGORIES}
        keyExtractor={(c) => c}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <ListRow
              label={item}
              trailing={<StatusPill label="COMING SOON" tone="muted" />}
              onPress={() => navigation.navigate('ShopCategory', { category: item })}
            />
          </View>
        )}
      />
      <Button label="Power-Ups" variant="secondary" onPress={() => navigation.navigate('PowerUps')} style={styles.powerUps} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: color.bg },
  list: { gap: space.sm, paddingHorizontal: space.lg, paddingVertical: space.md },
  card: {
    backgroundColor: color.card,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: color.hairline,
    paddingHorizontal: space.lg,
  },
  powerUps: { marginHorizontal: space.lg, marginBottom: space.lg },
});
