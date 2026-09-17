import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ProfileScreen } from '@/screens/Profile/ProfileScreen';
import { StatisticsScreen } from '@/screens/Profile/StatisticsScreen';
import { ShopScreen } from '@/screens/Shop/ShopScreen';
import { ShopCategoryScreen } from '@/screens/Shop/ShopCategoryScreen';
import { PowerUpsScreen } from '@/screens/Shop/PowerUpsScreen';
import { SettingsScreen } from '@/screens/Settings/SettingsScreen';
import { SoundSettingsScreen } from '@/screens/Settings/SoundSettingsScreen';
import { NotificationSettingsScreen } from '@/screens/Settings/NotificationSettingsScreen';
import { LanguageSettingsScreen } from '@/screens/Settings/LanguageSettingsScreen';
import { AboutScreen } from '@/screens/Settings/AboutScreen';
import { LegalScreen } from '@/screens/Settings/LegalScreen';
import { RestoreScreen } from '@/screens/Settings/RestoreScreen';
import { color } from '@/theme/tokens';

const Stack = createNativeStackNavigator();

const screenOptions = {
  headerStyle: { backgroundColor: color.bg },
  headerTintColor: color.text,
  contentStyle: { backgroundColor: color.bg },
};

export function ProfileStack() {
  return (
    <Stack.Navigator screenOptions={screenOptions}>
      <Stack.Screen name="Profile" component={ProfileScreen} options={{ headerShown: false }} />
      <Stack.Screen name="Statistics" component={StatisticsScreen} options={{ title: '' }} />
      <Stack.Screen name="Shop" component={ShopScreen} options={{ title: '' }} />
      <Stack.Screen name="ShopCategory" component={ShopCategoryScreen} options={{ title: '' }} />
      <Stack.Screen name="PowerUps" component={PowerUpsScreen} options={{ title: 'Power-Ups' }} />
      <Stack.Screen name="Settings" component={SettingsScreen} options={{ title: '' }} />
      <Stack.Screen name="SoundSettings" component={SoundSettingsScreen} options={{ title: '' }} />
      <Stack.Screen name="NotificationSettings" component={NotificationSettingsScreen} options={{ title: '' }} />
      <Stack.Screen name="LanguageSettings" component={LanguageSettingsScreen} options={{ title: '' }} />
      <Stack.Screen name="About" component={AboutScreen} options={{ title: '' }} />
      <Stack.Screen name="Legal" component={LegalScreen} options={{ title: '' }} />
      <Stack.Screen name="Restore" component={RestoreScreen} options={{ title: '' }} />
    </Stack.Navigator>
  );
}
