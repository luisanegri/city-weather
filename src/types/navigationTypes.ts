import { CityWeatherData } from "./weatherTypes";

export type RootStackParamList = {
  Home: undefined;
  WeatherDetails: {
    weatherDataForCity: CityWeatherData;
  };
};
