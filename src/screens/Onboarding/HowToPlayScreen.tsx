import React from 'react';
import { useNavigation } from '@react-navigation/native';
import { OnboardingLayout } from './OnboardingLayout';

export function HowToPlayScreen() {
  const navigation = useNavigation<any>();
  return (
    <OnboardingLayout
      title="How to Play"
      body="Drag any of the 3 tray pieces onto the board. Fill a full row or column to clear it. Clearing multiple lines back-to-back builds your combo multiplier, up to x8."
      primaryLabel="Try it"
      onPrimary={() => navigation.navigate('Tutorial')}
      onSkip={() => navigation.getParent()?.navigate('Main')}
    />
  );
}
