import React, { PropsWithChildren, useEffect } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useSettingsStore } from '@/store/settings';
import { useUserStore } from '@/store/user';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: 1, staleTime: 60_000 },
  },
});

/** App-wide providers: gesture root, safe area, and TanStack Query. Also
 * hydrates the settings/user stores from MMKV on mount. */
export function AppProviders({ children }: PropsWithChildren) {
  const hydrateSettings = useSettingsStore((s) => s.hydrate);
  const refreshUser = useUserStore((s) => s.refresh);

  useEffect(() => {
    hydrateSettings();
    refreshUser();
  }, [hydrateSettings, refreshUser]);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
