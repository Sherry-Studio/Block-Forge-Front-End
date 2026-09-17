import React, { PropsWithChildren } from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';
import { color, radius, space } from '@/theme/tokens';

interface CardProps extends PropsWithChildren {
  style?: ViewStyle;
  filled?: boolean;
}

/** Base surface: 1px hairline + subtle raised fill. No stacked shadows. */
export function Card({ children, style, filled }: CardProps) {
  return <View style={[styles.base, filled && styles.filled, style]}>{children}</View>;
}

const styles = StyleSheet.create({
  base: {
    backgroundColor: color.card,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: color.hairline,
    padding: space.lg,
  },
  filled: {
    backgroundColor: color.raised,
  },
});
