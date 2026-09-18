import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Pressable } from 'react-native';
import { color, radius, space } from '@/theme/tokens';
import { textStyle, tabularNums } from '@/theme/typography';

interface HeaderProps {
  title: string;
  subtitle?: string;
  onBack?: () => void;
  coins?: number;
  right?: React.ReactNode;
}

/** Persistent top header: optional back chevron, title(+subtitle), and an
 * optional coin-balance pill or custom right-hand content. */
export function Header({ title, subtitle, onBack, coins, right }: HeaderProps) {
  return (
    <View style={styles.row}>
      <View style={styles.left}>
        {onBack ? (
          <Pressable onPress={onBack} style={styles.backBtn} accessibilityRole="button" accessibilityLabel="Back">
            <Text style={styles.backChevron}>{'‹'}</Text>
          </Pressable>
        ) : null}
        <View>
          <Text style={styles.title}>{title}</Text>
          {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
        </View>
      </View>
      {right ?? (coins !== undefined && (
        <View style={styles.coinPill}>
          <View style={styles.coinDot} />
          <Text style={styles.coinText}>{coins.toLocaleString()}</Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: space.lg,
    paddingVertical: space.md,
  },
  left: { flexDirection: 'row', alignItems: 'center', gap: space.md },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: radius.md,
    backgroundColor: color.raised,
    borderWidth: 1,
    borderColor: color.hairline,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backChevron: { ...textStyle('h1'), color: color.text, lineHeight: 26 },
  title: { ...textStyle('h2'), color: color.text },
  subtitle: { ...textStyle('caption'), color: color.textFaint, marginTop: 1 },
  coinPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 5,
    paddingHorizontal: space.sm + 2,
    borderRadius: radius.pill,
    backgroundColor: color.raised,
    borderWidth: 1,
    borderColor: color.hairline,
  },
  coinDot: { width: 9, height: 9, borderRadius: 5, backgroundColor: color.gold },
  coinText: { ...textStyle('body'), ...tabularNums, color: color.text, fontWeight: '600' },
});
