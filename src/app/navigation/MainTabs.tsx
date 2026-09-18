import React from 'react';
import { Text } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { HomeStack } from './HomeStack';
import { GamesStack } from './GamesStack';
import { RewardsStack } from './RewardsStack';
import { ProfileStack } from './ProfileStack';
import { color } from '@/theme/tokens';
import { textStyle } from '@/theme/typography';

const Tab = createBottomTabNavigator();

const TAB_GLYPH: Record<string, string> = {
  HomeTab: '⌂',
  GamesTab: '▦',
  RewardsTab: '✦',
  ProfileTab: '◈',
};

/** Bottom tab bar. Hidden while a game is being played (Play is a
 * full-screen modal pushed from within HomeStack, so tabs disappear automatically). */
export function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: { backgroundColor: color.card, borderTopColor: color.hairline },
        tabBarActiveTintColor: color.accent300,
        tabBarInactiveTintColor: color.textFaint,
        tabBarLabelStyle: textStyle('caption'),
        tabBarIcon: ({ color: tintColor }) => (
          <Text style={{ fontSize: 20, color: tintColor }}>{TAB_GLYPH[route.name]}</Text>
        ),
      })}
    >
      <Tab.Screen name="HomeTab" component={HomeStack} options={{ title: 'Home' }} />
      <Tab.Screen name="GamesTab" component={GamesStack} options={{ title: 'Games' }} />
      <Tab.Screen name="RewardsTab" component={RewardsStack} options={{ title: 'Rewards' }} />
      <Tab.Screen name="ProfileTab" component={ProfileStack} options={{ title: 'Profile' }} />
    </Tab.Navigator>
  );
}
