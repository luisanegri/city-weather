import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

import { WeatherData, MergedWeatherData } from '../types/weatherTypes';

const API_URL = "https://us-central1-mobile-assignment-server.cloudfunctions.net/weather";
const WEATHER_DATA_KEY = 'weatherData';

const fetchWeatherData = async () => {
  try {
    const response = await axios.get(API_URL);
    return mergeWeatherDataByCity(response.data);
  } catch (error: any) {
    console.log('Error fetching data', error)
  }
};

const mergeWeatherDataByCity = (weatherDataArray: WeatherData[]): MergedWeatherData => {
  return weatherDataArray.reduce((accumulator: MergedWeatherData, currentData: WeatherData) => {
    const cityName = currentData.city.name;
    if (!accumulator[cityName]) {
      accumulator[cityName] = {
        city: currentData.city,
        weather: [],
      };
    }
    accumulator[cityName].weather.push({
      date: currentData.date,
      temp: currentData.temp,
      tempType: currentData.tempType,
    });
    return accumulator;
  }, {});
};

const useWeather = () => {
  const { data: weatherData, isLoading, isError } = useQuery({
    queryKey: [WEATHER_DATA_KEY],
    queryFn: fetchWeatherData,
    onSuccess: (data) => {
      console.log("Query was successful! Data:", data);
    },
    onError: (error) => {
      console.log("Error during fetching:", error);
    },
  });

  const getWeatherDetailsForCity = (cityName: string): WeatherData | null => {
    return weatherData ? weatherData[cityName] : null;
  };

  return {
    isLoading,
    isError,
    weatherData,
    getWeatherDetailsForCity,
  };
};

export default useWeather;
