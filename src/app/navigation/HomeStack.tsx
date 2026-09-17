import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { HomeScreen } from '@/screens/Home/HomeScreen';
import { GameDetailScreen } from '@/screens/GameDetail/GameDetailScreen';
import { PreviewsScreen } from '@/screens/GameDetail/PreviewsScreen';
import { GameModesScreen } from '@/screens/GameModes/GameModesScreen';
import { ClassicIntroScreen } from '@/screens/GameModes/ClassicIntroScreen';
import { DailyChallengeScreen } from '@/screens/GameModes/DailyChallengeScreen';
import { PlayScreen } from '@/screens/Play/PlayScreen';
import { color } from '@/theme/tokens';

const Stack = createNativeStackNavigator();

const screenOptions = {
  headerStyle: { backgroundColor: color.bg },
  headerTintColor: color.text,
  contentStyle: { backgroundColor: color.bg },
};

export function HomeStack() {
  return (
    <Stack.Navigator screenOptions={screenOptions}>
      <Stack.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />
      <Stack.Screen name="GameDetail" component={GameDetailScreen} options={{ title: '' }} />
      <Stack.Screen name="Previews" component={PreviewsScreen} options={{ presentation: 'modal', headerShown: false }} />
      <Stack.Screen name="GameModes" component={GameModesScreen} options={{ title: 'Game Modes' }} />
      <Stack.Screen name="ClassicIntro" component={ClassicIntroScreen} options={{ headerShown: false }} />
      <Stack.Screen name="DailyChallenge" component={DailyChallengeScreen} options={{ headerShown: false }} />
      <Stack.Screen
        name="Play"
        component={PlayScreen}
        options={{ presentation: 'fullScreenModal', gestureEnabled: false, headerShown: false }}
      />
    </Stack.Navigator>
  );
}
