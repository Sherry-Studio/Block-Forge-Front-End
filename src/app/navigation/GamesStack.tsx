import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { GamesHubScreen } from '@/screens/GamesHub/GamesHubScreen';
import { CategoryScreen } from '@/screens/GamesHub/CategoryScreen';
import { GameDetailScreen } from '@/screens/GameDetail/GameDetailScreen';
import { PreviewsScreen } from '@/screens/GameDetail/PreviewsScreen';
import { color } from '@/theme/tokens';

const Stack = createNativeStackNavigator();

const screenOptions = {
  headerStyle: { backgroundColor: color.bg },
  headerTintColor: color.text,
  contentStyle: { backgroundColor: color.bg },
};

export function GamesStack() {
  return (
    <Stack.Navigator screenOptions={screenOptions}>
      <Stack.Screen name="GamesHub" component={GamesHubScreen} options={{ headerShown: false }} />
      <Stack.Screen name="Category" component={CategoryScreen} options={{ title: '' }} />
      <Stack.Screen name="GameDetail" component={GameDetailScreen} options={{ title: '' }} />
      <Stack.Screen name="Previews" component={PreviewsScreen} options={{ presentation: 'modal', headerShown: false }} />
    </Stack.Navigator>
  );
}
