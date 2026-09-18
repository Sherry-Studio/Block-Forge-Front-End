import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { color, space } from '@/theme/tokens';
import { textStyle, tabularNums } from '@/theme/typography';

export interface StatItem {
  label: string;
  value: string | number;
}

interface StatGridProps {
  items: StatItem[];
  /** number of columns; defaults to a flowing row for <=3 items, else 3-col grid */
  columns?: number;
}

/** Plain number+caption stat pairs, laid out in a grid — no card borders,
 * matching the prototype's stat rows (Best Score / Games / Lines, etc). */
export function StatGrid({ items, columns }: StatGridProps) {
  const cols = columns ?? (items.length <= 3 ? items.length : 3);
  return (
    <View style={styles.wrap}>
      {items.map((item, i) => (
        <View key={i} style={[styles.item, { width: `${100 / cols}%` }]}>
          <Text style={styles.value}>{item.value}</Text>
          <Text style={styles.label}>{item.label}</Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { flexDirection: 'row', flexWrap: 'wrap' },
  item: { paddingVertical: space.sm, paddingRight: space.sm },
  value: { ...textStyle('h1'), ...tabularNums, color: color.text },
  label: { ...textStyle('caption'), color: color.textFaint, marginTop: 2 },
});
