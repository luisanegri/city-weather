# City Weather App

## **Project Overview**
This app is designed to fetch, display, and persist weather data for multiple cities, prioritizing efficient data management, offline capabilities, and smooth user experience. It leverages modern web technologies such as **React Query**, **Axios**, and **TypeScript** to achieve these goals while following clean architectural principles and React Native design patterns.

---

## **Key Technical Features**

### 1. **Data Fetching with Axios & Custom Interceptors**
The app utilizes **`Axios`** for all HTTP requests, integrated with **custom interceptors** for centralized error handling and request management. The interceptors handle cases like network failure, API errors, and cached data fallback:

- **Request Interceptor**: Modifies requests if necessary before they are sent.
- **Response Interceptor**: Handles successful responses, and processes errors based on the type of failure, such as network issues or specific HTTP status codes.
  
Example of the Axios interceptor:
```
customAxios.interceptors.response.use(
  (response) => response,
  async (error) => {
    // If cached data is available, use it
    const cachedData = queryClient.getQueryData<MergedWeatherData>([WEATHER_DATA_KEY]);
    if (cachedData) {
      return { data: cachedData, status: 200 };
    }
    return Promise.reject(error);
  }
);
```

### 2. Data Fetching, Caching, and Offline Support with React Query

The app leverages **React Query** for fetching, caching, and synchronizing weather data across components. React Query’s built-in support for caching ensures that the app remains responsive and functional, even when the network is unavailable.

To enhance the offline-first experience, the app uses **PersistQueryClientProvider** from `@tanstack/react-query-persist-client` to persist the cache using **AsyncStorage**.

```
import { NavigationContainer } from '@react-navigation/native';
import { createAsyncStoragePersister } from '@tanstack/query-async-storage-persister';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client';

import AppNavigator from './src/navigation/AppNavigator';
import { queryClient } from './src/queryClientSetup';

const persister = createAsyncStoragePersister({
  storage: AsyncStorage,
  throttleTime: 3000,
});

export default function App() {
  return (
    <PersistQueryClientProvider
      onSuccess={() =>
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
```

### Key Features of the Caching System

- **Persistent Storage with AsyncStorage:** The use of `PersistQueryClientProvider` and `AsyncStorage` ensures that data is stored locally, making it available offline and persistent across app sessions.

- **Cache Invalidation:** Cached data is invalidated and refetched after a defined period, ensuring that stale data is not served to the user. The app uses `queryClient.invalidateQueries()` to refresh data after reinitialization.

- **Throttle Time:** The persister uses a throttle time of 3 seconds, meaning data is saved to storage in a controlled manner, avoiding frequent writes.

- **Stale vs Fresh Data:** React Query allows for defining `staleTime`, which ensures that data remains fresh for a specific time before being refetched.

### `useWeather` Custom Hook:
The `useWeather` hook abstracts the logic for fetching weather data, making the code more modular and reusable:

```
const useWeather = () => {
  const {
    data: weatherData,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: [WEATHER_DATA_KEY],
    queryFn: fetchWeatherData,
    staleTime: 60 * 60 * 1000, // Cache remains fresh for 1 hour
    cacheTime: 60 * 60 * 1000, // Cache data is stored for 1 hour
    keepPreviousData: true, // Keeps previous data during refetching
  });

  return { weatherData, isLoading, isError, refetch };
};
```

### 4. **Unit Testing for Axios Interceptors**

**Jest** has been integrated for testing core functionalities:

- **Axios Interceptors**: Unit tests ensure that interceptors handle both successful and erroneous responses properly.

**Example Jest test for interceptors:**

```
it("should return cached data on network failure", async () => {
  // Simulate a network error
  mockAxios.get.mockRejectedValueOnce(new Error("Network Error"));

  // Set up cached data
  const cachedData = { /* Mock Cached Data */ };
  queryClient.setQueryData([WEATHER_DATA_KEY], cachedData);
  
  // Attempt to fetch data, expecting cached data to be returned
  const result = await fetchWeatherData();
  
  // Assert that cached data is returned on network failure
  expect(result).toEqual(cachedData);
});
```

- **Run the tests**

```
  npm run test
```

###  5. Project Structure

```
src/
│
├── components/           // Reusable UI components
├── containers/           // Screens as containers
├── hooks/                // Custom hooks (e.g., useWeather)
├── http/                 // Axios instance and interceptors
│   ├── __tests__/        // Tests for http-related logic
├── types/                // TypeScript types
├── utils/                // Utility functions
├── queryClientSetup.ts   // React Query setup
└── App.tsx               // Main entry point
```

### 6. Project Setup

#### Prerequisites

Before you begin, ensure you have the following installed on your machine:

- **Node.js**: [Download and install Node.js](https://nodejs.org/)

- **Expo**

```
  npm install expo
```

- **Clone repository**

```
  git clone https://github.com/luisanegri/city-weather.git
```

#### Running the App

- **Install Dependencies**
```
  npx expo install
```

- **Start the Expo Development Server**

```
  npx expo start
```
