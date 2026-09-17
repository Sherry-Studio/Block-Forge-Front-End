import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { WelcomeScreen } from '@/screens/Onboarding/WelcomeScreen';
import { HowToPlayScreen } from '@/screens/Onboarding/HowToPlayScreen';
import { TutorialScreen } from '@/screens/Onboarding/TutorialScreen';

const Stack = createNativeStackNavigator();

export function OnboardingStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Welcome" component={WelcomeScreen} />
      <Stack.Screen name="HowToPlay" component={HowToPlayScreen} />
      <Stack.Screen name="Tutorial" component={TutorialScreen} />
    </Stack.Navigator>
  );
}
