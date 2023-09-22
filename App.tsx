import { NavigationContainer } from '@react-navigation/native';
import { QueryClient } from '@tanstack/react-query';
import { createAsyncStoragePersister } from '@tanstack/query-async-storage-persister';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client';

import AppNavigator from './src/navigation/AppNavigator';

const persister = createAsyncStoragePersister({
  storage: AsyncStorage,
  throttleTime: 3000,
});

export default function App() {

  const queryClient = new QueryClient();

  return (
    <PersistQueryClientProvider
      onSuccess={() =>
        // Fresh data on app initialization
        queryClient.invalidateQueries()
      }
      persistOptions={{ persister }}
      client={queryClient}>
      <NavigationContainer>
        <AppNavigator />
      </NavigationContainer>
    </PersistQueryClientProvider>
  );
}
