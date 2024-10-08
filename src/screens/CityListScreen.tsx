import { FlatList, Text, View, StyleSheet, RefreshControl } from "react-native";
import { useCallback, useMemo } from "react";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { Routes } from "../navigation/routes";
import useWeather from "../hooks/useWeather";
import CityItem from "../components/CityItem";
import { AppNavigatorParamList } from "../navigation/AppNavigator";

const CityListScreen = () => {
  const {
    isLoading,
    isError,
    errorMessage,
    weatherData,
    refetch,
    getWeatherDetailsForCity,
  } = useWeather();
  const navigation =
    useNavigation<
      StackNavigationProp<AppNavigatorParamList, Routes.WeatherDetails>
    >();

  const cityNames = useMemo(() => {
    return weatherData ? Object.keys(weatherData).sort() : [];
  }, [weatherData]);

  const handleCityPress = useCallback(
    (cityName: string) => {
      const data = getWeatherDetailsForCity(cityName);

      if (data) {
        navigation.navigate(Routes.WeatherDetails, {
          weatherDataForCity: data,
        });
      } else {
        console.log("No data found");
      }
    },
    [navigation, getWeatherDetailsForCity]
  );

  if (isError) {
    return <Text style={styles.errorText}>{errorMessage}</Text>;
  }

  if (isLoading) {
    return <Text style={styles.infoText}>Loading...</Text>;
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={cityNames}
        keyExtractor={(city) => city}
        renderItem={({ item: cityName }) => (
          <CityItem cityName={cityName} onPress={handleCityPress} />
        )}
        refreshControl={
          <RefreshControl
            refreshing={isLoading && !isError}
            onRefresh={refetch}
          />
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  infoText: {
    padding: 15,
    textAlign: "center",
  },
  errorText: {
    padding: 15,
    color: "red",
    textAlign: "center",
  },
});

export default CityListScreen;
