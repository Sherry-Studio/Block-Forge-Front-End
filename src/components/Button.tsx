import React from 'react';
import { GestureResponderEvent, Pressable, StyleSheet, Text, ViewStyle } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { useHaptics } from '@/game/hooks/useHaptics';
import { color, radius, space } from '@/theme/tokens';
import { textStyle } from '@/theme/typography';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost';
export type ButtonState = 'idle' | 'disabled' | 'success';

interface ButtonProps {
  label: string;
  onPress?: (e: GestureResponderEvent) => void;
  variant?: ButtonVariant;
  state?: ButtonState;
  style?: ViewStyle;
  accessibilityLabel?: string;
  testID?: string;
}

/**
 * The single reusable button for every primary action in the app (Play,
 * Continue, Claim, Retry, ...). Handles idle/pressed/release/success/disabled
 * states via reanimated so no screen re-implements press feedback.
 */
export function Button({
  label,
  onPress,
  variant = 'primary',
  state = 'idle',
  style,
  accessibilityLabel,
  testID,
}: ButtonProps) {
  const scale = useSharedValue(1);
  const { selection } = useHaptics();
  const disabled = state === 'disabled';

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    if (disabled) return;
    scale.value = withTiming(0.94, { duration: 90 });
  };

  const handlePressOut = () => {
    if (disabled) return;
    scale.value = withSpring(1, { damping: 10, stiffness: 220 });
  };

  const handlePress = (e: GestureResponderEvent) => {
    if (disabled) return;
    selection();
    onPress?.(e);
  };

  const variantStyle = variantStyles[variant];
  const successStyle = state === 'success' ? styles.success : null;

  return (
    <Animated.View style={[animatedStyle, style]}>
      <Pressable
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        onPress={handlePress}
        disabled={disabled}
        accessibilityRole="button"
        accessibilityState={{ disabled }}
        accessibilityLabel={accessibilityLabel ?? label}
        testID={testID}
        style={[styles.base, variantStyle, disabled && styles.disabled, successStyle]}
        hitSlop={8}
      >
        <Text style={[styles.label, variant === 'ghost' && styles.ghostLabel, disabled && styles.disabledLabel]}>
          {state === 'success' ? '✓ Done' : label}
        </Text>
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  base: {
    minHeight: 48,
    minWidth: 44,
    paddingVertical: space.md,
    paddingHorizontal: space.xxl,
    borderRadius: radius.lg,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  label: {
    ...textStyle('h2'),
    color: color.accent300,
  },
  ghostLabel: {
    color: color.textMuted,
  },
  disabled: {
    opacity: 0.4,
  },
  disabledLabel: {
    color: color.textDim,
  },
  success: {
    borderColor: color.teal,
  },
});

const variantStyles: Record<ButtonVariant, ViewStyle> = {
  primary: {
    backgroundColor: 'transparent',
    borderColor: color.accent,
  },
  secondary: {
    backgroundColor: color.raised,
    borderColor: color.hairline,
  },
  ghost: {
    backgroundColor: 'transparent',
    borderColor: 'transparent',
  },
};
