import React from 'react';
import { FlatList, StyleSheet, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Card } from '@/components/Card';
import { Tag } from '@/components/Tag';
import { color, space } from '@/theme/tokens';
import { textStyle } from '@/theme/typography';

type PowerUpState = 'available' | 'locked' | 'disabled' | 'insufficient_coins';

interface PowerUp {
  id: string;
  name: string;
  description: string;
  cost: number;
  state: PowerUpState;
}

const POWER_UPS: PowerUp[] = [
  { id: 'bomb', name: 'Bomb', description: 'Clear a 3x3 area instantly.', cost: 150, state: 'insufficient_coins' },
  { id: 'lightning', name: 'Lightning', description: 'Clear a full row or column.', cost: 200, state: 'locked' },
  { id: 'color-blast', name: 'Color Blast', description: 'Remove all blocks of one color.', cost: 250, state: 'locked' },
  { id: 'undo', name: 'Undo', description: 'Undo your last placement.', cost: 100, state: 'available' },
  { id: 'shuffle', name: 'Shuffle', description: 'Reroll your current tray.', cost: 120, state: 'disabled' },
];

const stateLabel: Record<PowerUpState, string> = {
  available: 'Available',
  locked: 'Locked',
  disabled: 'Unavailable',
  insufficient_coins: 'Need more coins',
};

const stateTone: Record<PowerUpState, 'default' | 'accent' | 'gold' | 'danger'> = {
  available: 'accent',
  locked: 'default',
  disabled: 'default',
  insufficient_coins: 'danger',
};

/** UI-only preview — no purchase/consumption logic wired up yet. */
export function PowerUpsScreen() {
  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <Text style={styles.title}>Power-Ups</Text>
      <FlatList
        data={POWER_UPS}
        keyExtractor={(p) => p.id}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <Card style={styles.card}>
            <Text style={styles.name}>{item.name}</Text>
            <Text style={styles.description}>{item.description}</Text>
            <Tag label={`${stateLabel[item.state]} - ${item.cost} coins`} tone={stateTone[item.state]} />
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
  name: { ...textStyle('h2'), color: color.text },
  description: { ...textStyle('body'), color: color.textMuted },
});
