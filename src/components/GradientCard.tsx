import React, { PropsWithChildren } from 'react';
import { Pressable, StyleSheet, View, ViewStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { radius, space } from '@/theme/tokens';

interface GradientCardProps extends PropsWithChildren {
  colors: [string, string];
  style?: ViewStyle | ViewStyle[];
  onPress?: () => void;
  /** Renders small floating decorative squares in the top-right corner, as
   * seen on the prototype's hero/banner cards. */
  decorative?: boolean;
}

/** Gradient-filled card used for the home hero, daily-challenge teaser,
 * rewards teaser, and game-detail banner. */
export function GradientCard({ colors, style, onPress, decorative, children }: GradientCardProps) {
  const content = (
    <LinearGradient colors={colors} start={{ x: 0.1, y: 0 }} end={{ x: 0.9, y: 1 }} style={[styles.base, style]}>
      {decorative && (
        <View pointerEvents="none" style={styles.decor}>
          <View style={[styles.sq, { width: 34, height: 34, top: 6, right: 26, opacity: 0.16 }]} />
          <View style={[styles.sq, { width: 18, height: 18, top: 44, right: 12, opacity: 0.22 }]} />
          <View style={[styles.sq, { width: 12, height: 12, top: 10, right: 70, opacity: 0.12 }]} />
        </View>
      )}
      {children}
    </LinearGradient>
  );

  if (onPress) {
    return (
      <Pressable onPress={onPress} accessibilityRole="button">
        {content}
      </Pressable>
    );
  }
  return content;
}

const styles = StyleSheet.create({
  base: {
    borderRadius: radius.xl,
    padding: space.xl,
    overflow: 'hidden',
  },
  decor: {
    ...StyleSheet.absoluteFillObject,
  },
  sq: {
    position: 'absolute',
    backgroundColor: '#ffffff',
    borderRadius: radius.sm,
    transform: [{ rotate: '18deg' }],
  },
});
