import React from 'react';
import { StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { ErrorState, OfflineState } from '@/components/ErrorState';
import { LoadingState } from '@/components/LoadingState';
import { color } from '@/theme/tokens';

/**
 * Thin route wrappers around the shared LoadingState/ErrorState/OfflineState
 * components, reachable directly for deep-linked system states (e.g. a push
 * notification landing on a maintenance page).
 */
export function NetworkErrorScreen() {
  const navigation = useNavigation<any>();
  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.center}>
        <OfflineState onRetry={() => navigation.goBack()} />
      </View>
    </SafeAreaView>
  );
}

export function GenericErrorScreen() {
  const navigation = useNavigation<any>();
  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.center}>
        <ErrorState onRetry={() => navigation.goBack()} />
      </View>
    </SafeAreaView>
  );
}

export function MaintenanceScreen() {
  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.center}>
        <ErrorState
          title="Under Maintenance"
          message="Block Forge is getting a tune-up. Classic play still works offline."
        />
      </View>
    </SafeAreaView>
  );
}

export function LoadingScreen() {
  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.center}>
        <LoadingState />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: color.bg },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
});
