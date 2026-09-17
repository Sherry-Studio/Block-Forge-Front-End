import React, { useEffect } from 'react';
import { StyleSheet, Text } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { color, radius, space } from '@/theme/tokens';
import { textStyle } from '@/theme/typography';

interface ComboBadgeProps {
  combo: number;
  duration?: number;
  rise?: number;
}

/** Shows "xN COMBO" when combo >= 2, rising and fading in. */
export function ComboBadge({ combo, duration = 250, rise = 14 }: ComboBadgeProps) {
  const translateY = useSharedValue(rise);
  const opacity = useSharedValue(0);

  useEffect(() => {
    if (combo < 2) return;
    translateY.value = rise;
    opacity.value = 0;
    translateY.value = withTiming(0, { duration });
    opacity.value = withTiming(1, { duration });
  }, [combo, duration, rise, translateY, opacity]);

  const style = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
    opacity: opacity.value,
  }));

  if (combo < 2) return null;

  return (
    <Animated.View style={[styles.badge, style]} accessibilityLabel={`Combo x${combo}`}>
      <Text style={styles.text}>x{combo} COMBO</Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  badge: {
    backgroundColor: color.raised,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: color.gold,
    paddingVertical: 4,
    paddingHorizontal: space.md,
    alignSelf: 'center',
  },
  text: { ...textStyle('badge'), color: color.gold },
});
