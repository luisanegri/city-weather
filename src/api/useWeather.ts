import { useQuery } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { customAxios } from '../http/interceptors';

import { WeatherData, MergedWeatherData, CityWeatherData } from '../types/weatherTypes';

const WEATHER_DATA_KEY = 'weatherData';

const fetchWeatherData = async () => {
  try {
    const response = await customAxios.get('weather');
    return mergeWeatherDataByCity(response.data);
  } catch (error) {
    console.log("Axios Error:", error);
    throw error;
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
  const { data: weatherData, isLoading, isError, error, refetch } = useQuery({
    queryKey: [WEATHER_DATA_KEY],
    queryFn: fetchWeatherData,
    // Ensures that once data is fetched and cached, it remains available and "fresh" 
    // for the lifetime of the application, optimizing for offline access and minimizing network requests.
    staleTime: Infinity,
    cacheTime: Infinity,
    onSuccess: (data) => {
      console.log("Query was successful! Data:", data);
    },
  });

  const errorMessage = isError && error ? (error as AxiosError).message : null;

  const getWeatherDetailsForCity = (cityName: string): CityWeatherData | null => {
    return weatherData ? weatherData[cityName] : null;
  };

  return {
    isLoading,
    isError,
    errorMessage,
    weatherData,
    refetch,
    getWeatherDetailsForCity,
  };
};

export default useWeather;
