import React from 'react';
import { useNavigation } from '@react-navigation/native';
import { OnboardingLayout } from './OnboardingLayout';

export function WelcomeScreen() {
  const navigation = useNavigation<any>();
  return (
    <OnboardingLayout
      title="Welcome to Block Forge"
      body="Drag blocks onto the grid, clear lines, and chain combos for a new high score every run."
      primaryLabel="Continue"
      onPrimary={() => navigation.navigate('HowToPlay')}
    />
  );
}
