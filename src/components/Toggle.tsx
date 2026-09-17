import React from 'react';
import { Switch } from 'react-native';
import { color } from '@/theme/tokens';

interface ToggleProps {
  value: boolean;
  onChange: (value: boolean) => void;
  accessibilityLabel: string;
}

export function Toggle({ value, onChange, accessibilityLabel }: ToggleProps) {
  return (
    <Switch
      value={value}
      onValueChange={onChange}
      accessibilityLabel={accessibilityLabel}
      trackColor={{ false: color.hairline, true: color.accent }}
      thumbColor={color.text}
    />
  );
}
