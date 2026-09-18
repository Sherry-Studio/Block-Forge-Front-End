import React, { ReactNode } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { color, space } from '@/theme/tokens';
import { textStyle } from '@/theme/typography';
import { IconTile } from './IconTile';

interface ListRowProps {
  label: string;
  subtitle?: string;
  icon?: ReactNode;
  iconColors?: [string, string];
  trailing?: ReactNode;
  trailingText?: string;
  chevron?: boolean;
  onPress?: () => void;
}

/** Icon tile + label(+subtitle) + trailing slot/value + optional chevron —
 * the recurring settings/profile/rewards navigation row. */
export function ListRow({ label, subtitle, icon, iconColors, trailing, trailingText, chevron, onPress }: ListRowProps) {
  const Wrapper: any = onPress ? Pressable : View;
  return (
    <Wrapper style={styles.row} onPress={onPress} accessibilityRole={onPress ? 'button' : undefined}>
      {icon !== undefined || iconColors ? (
        <IconTile colors={iconColors} size={38} style={styles.icon}>
          {icon}
        </IconTile>
      ) : null}
      <View style={styles.textCol}>
        <Text style={styles.label}>{label}</Text>
        {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
      </View>
      {trailingText ? <Text style={styles.trailingText}>{trailingText}</Text> : null}
      {trailing}
      {chevron && <Text style={styles.chevron}>{'›'}</Text>}
    </Wrapper>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: space.md,
    gap: space.md,
  },
  icon: { marginRight: 0 },
  textCol: { flex: 1 },
  label: { ...textStyle('body'), color: color.text, fontWeight: '500' },
  subtitle: { ...textStyle('caption'), color: color.textFaint, marginTop: 2 },
  trailingText: { ...textStyle('body'), color: color.textMuted, marginRight: space.xs },
  chevron: { ...textStyle('h2'), color: color.textDim },
});
