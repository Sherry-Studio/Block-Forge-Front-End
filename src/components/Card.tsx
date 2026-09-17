import React, { PropsWithChildren } from 'react';
import { Pressable, StyleSheet, View, ViewStyle } from 'react-native';
import { color, radius, space } from '@/theme/tokens';

interface CardProps extends PropsWithChildren {
  style?: ViewStyle | ViewStyle[];
  filled?: boolean;
  onPress?: () => void;
  accessibilityLabel?: string;
}

/** Base surface: 1px hairline + subtle raised fill. No stacked shadows.
 * Pass `onPress` to make the whole card tappable (renders as a Pressable). */
export function Card({ children, style, filled, onPress, accessibilityLabel }: CardProps) {
  if (onPress) {
    return (
      <Pressable
        onPress={onPress}
        accessibilityRole="button"
        accessibilityLabel={accessibilityLabel}
        style={[styles.base, filled && styles.filled, style]}
      >
        {children}
      </Pressable>
    );
  }
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
