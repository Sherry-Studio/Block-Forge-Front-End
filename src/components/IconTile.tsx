import React, { PropsWithChildren } from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { color, radius } from '@/theme/tokens';

interface IconTileProps extends PropsWithChildren {
  /** [top, bottom] gradient pair. Falls back to a flat `raised` fill when omitted. */
  colors?: [string, string];
  size?: number;
  style?: ViewStyle;
}

/** Rounded-square tile used for game icons, list-row leading icons, and
 * header buttons. Renders a gradient fill when a color pair is given. */
export function IconTile({ colors, size = 44, style, children }: IconTileProps) {
  const dims = { width: size, height: size, borderRadius: radius.md };
  if (colors) {
    return (
      <LinearGradient
        colors={colors}
        start={{ x: 0.15, y: 0 }}
        end={{ x: 0.85, y: 1 }}
        style={[styles.base, dims, style]}
      >
        {children}
      </LinearGradient>
    );
  }
  return <View style={[styles.base, dims, styles.flat, style]}>{children}</View>;
}

const styles = StyleSheet.create({
  base: {
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  flat: {
    backgroundColor: color.raised,
    borderWidth: 1,
    borderColor: color.hairline,
  },
});
