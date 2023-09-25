import { useQuery } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { customAxios } from '../http/interceptors';

import { CityWeatherData } from '../types/weatherTypes';
import { WEATHER_DATA_KEY } from '../utils/constants';
import { mergeWeatherDataByCity } from '../utils/weatherData';

const fetchWeatherData = async () => {
  try {
    const response = await customAxios.get('weather');
    return mergeWeatherDataByCity(response.data);
  } catch (error) {
    throw error;
  }
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
