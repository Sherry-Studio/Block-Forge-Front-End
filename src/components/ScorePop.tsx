import React, { useEffect } from 'react';
import { StyleSheet, Text } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withTiming,
  runOnJS,
} from 'react-native-reanimated';
import { color } from '@/theme/tokens';
import { textStyle, tabularNums } from '@/theme/typography';

interface ScorePopProps {
  value: number;
  x: number;
  y: number;
  duration?: number;
  rise?: number;
  onDone: () => void;
}

/** Transient "+N" score popup: rises and fades over ~700ms. */
export function ScorePop({ value, x, y, duration = 700, rise = 38, onDone }: ScorePopProps) {
  const translateY = useSharedValue(0);
  const opacity = useSharedValue(1);

  useEffect(() => {
    translateY.value = withTiming(-rise, { duration });
    opacity.value = withSequence(
      withTiming(1, { duration: duration * 0.4 }),
      withTiming(0, { duration: duration * 0.6 }, (finished) => {
        if (finished) runOnJS(onDone)();
      }),
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const style = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
    opacity: opacity.value,
  }));

  return (
    <Animated.View pointerEvents="none" style={[styles.container, { left: x, top: y }, style]}>
      <Text style={styles.text}>+{value}</Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: { position: 'absolute', zIndex: 60 },
  text: { ...textStyle('h2'), ...tabularNums, color: color.accent300 },
});
