import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { HomeStack } from './HomeStack';
import { GamesStack } from './GamesStack';
import { RewardsStack } from './RewardsStack';
import { ProfileStack } from './ProfileStack';
import { color } from '@/theme/tokens';
import { textStyle } from '@/theme/typography';

const Tab = createBottomTabNavigator();

/** Bottom tab bar. Hidden while a game is being played (Play is a
 * full-screen modal pushed from within HomeStack, so tabs disappear automatically). */
export function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: { backgroundColor: color.card, borderTopColor: color.hairline },
        tabBarActiveTintColor: color.accent300,
        tabBarInactiveTintColor: color.textFaint,
        tabBarLabelStyle: textStyle('caption'),
      }}
    >
      <Tab.Screen name="HomeTab" component={HomeStack} options={{ title: 'Home' }} />
      <Tab.Screen name="GamesTab" component={GamesStack} options={{ title: 'Games' }} />
      <Tab.Screen name="RewardsTab" component={RewardsStack} options={{ title: 'Rewards' }} />
      <Tab.Screen name="ProfileTab" component={ProfileStack} options={{ title: 'Profile' }} />
    </Tab.Navigator>
  );
}
