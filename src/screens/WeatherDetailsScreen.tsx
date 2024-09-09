import { useLayoutEffect } from "react";
import CityWeatherList from "../components/CityWeatherList";
import CityImageWithLabel from "../components/CityImageWithLabel";
import { CityWeatherData } from "../types/weatherTypes";
import { convertToCelsius } from "../utils/weatherData";

import { RouteProp } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../types/navigationTypes";

type WeatherDetailsScreenProps = {
  route: RouteProp<RootStackParamList, "WeatherDetails">;
  navigation: StackNavigationProp<RootStackParamList, "WeatherDetails">;
};

const WeatherDetailsScreen = ({
  route,
  navigation,
}: WeatherDetailsScreenProps) => {
  const weatherDataForCity: CityWeatherData = route.params.weatherDataForCity;

  useLayoutEffect(() => {
    navigation.setOptions({
      title: weatherDataForCity.city.name,
    });
  }, [navigation, weatherDataForCity.city.name]);

  const sortedAndConvertedWeather = weatherDataForCity.weather
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .map((item) => ({
      ...item,
      temp: Math.round(convertToCelsius(item.temp, item.tempType)),
      tempType: "C",
    }));

  const sortedWeatherDataForCity = {
    ...weatherDataForCity,
    weather: sortedAndConvertedWeather,
  };

  return (
    <>
      <CityImageWithLabel
        cityName={weatherDataForCity.city.name}
        imageUrl={weatherDataForCity.city.picture}
      />
      <CityWeatherList weatherData={sortedWeatherDataForCity.weather} />
    </>
  );
};

export default WeatherDetailsScreen;
