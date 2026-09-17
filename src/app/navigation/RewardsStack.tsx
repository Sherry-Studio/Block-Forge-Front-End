import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RewardsCentreScreen } from '@/screens/Rewards/RewardsCentreScreen';
import { AchievementsScreen } from '@/screens/Rewards/AchievementsScreen';
import { LeaderboardScreen } from '@/screens/Rewards/LeaderboardScreen';
import { color } from '@/theme/tokens';

const Stack = createNativeStackNavigator();

const screenOptions = {
  headerStyle: { backgroundColor: color.bg },
  headerTintColor: color.text,
  contentStyle: { backgroundColor: color.bg },
};

export function RewardsStack() {
  return (
    <Stack.Navigator screenOptions={screenOptions}>
      <Stack.Screen name="RewardsCentre" component={RewardsCentreScreen} options={{ headerShown: false }} />
      <Stack.Screen name="Achievements" component={AchievementsScreen} options={{ title: '' }} />
      <Stack.Screen name="Leaderboard" component={LeaderboardScreen} options={{ title: '' }} />
    </Stack.Navigator>
  );
}
