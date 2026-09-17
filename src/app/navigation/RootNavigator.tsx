import React from 'react';
import { NavigationContainer, DarkTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SplashScreen } from '@/screens/Splash/SplashScreen';
import { OnboardingStack } from './OnboardingStack';
import { MainTabs } from './MainTabs';
import {
  GenericErrorScreen,
  LoadingScreen,
  MaintenanceScreen,
  NetworkErrorScreen,
} from '@/screens/System/SystemScreens';
import { linking } from '../linking';
import { color } from '@/theme/tokens';

const Stack = createNativeStackNavigator();

const navTheme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    background: color.bg,
    card: color.card,
    text: color.text,
    border: color.hairline,
    primary: color.accent,
  },
};

export function RootNavigator() {
  return (
    <NavigationContainer theme={navTheme} linking={linking} fallback={<LoadingScreen />}>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Splash" component={SplashScreen} />
        <Stack.Screen name="Onboarding" component={OnboardingStack} />
        <Stack.Screen name="Main" component={MainTabs} />
        <Stack.Screen name="NetworkError" component={NetworkErrorScreen} />
        <Stack.Screen name="GenericError" component={GenericErrorScreen} />
        <Stack.Screen name="Maintenance" component={MaintenanceScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
