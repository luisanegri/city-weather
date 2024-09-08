import { useQuery } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { customAxios, CustomAxiosError } from "../http/interceptors";

import { CityWeatherData, MergedWeatherData } from "../types/weatherTypes";
import { WEATHER_DATA_KEY } from "../utils/constants";
import { mergeWeatherDataByCity } from "../utils/weatherData";

const fetchWeatherData = async (): Promise<MergedWeatherData> => {
  try {
    const response = await customAxios.get("weather");

    return mergeWeatherDataByCity(response.data);
  } catch (error) {
    throw error; // Axios interceptors will handle the error
  }
};

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
    staleTime: 60 * 60 * 1000,
    cacheTime: 60 * 60 * 1000,
    keepPreviousData: true, // Keeps previous data during refetching to improve user experience
    retry: (failureCount, error) => {
      const axiosError = error as AxiosError;
      if (axiosError.response?.status === 500) {
        return false;
      }
      return failureCount < 3;
    },
    onSuccess: (data) => {
      console.log("Query was successful! Data:", data);
    },
    onError: (error) => {
      console.log("Query failed! Error:", error);
    },
  });

  const errorMessage =
    isError && error instanceof AxiosError
      ? (error as CustomAxiosError).customMessage || error.message
      : null;

  const getWeatherDetailsForCity = (
    cityName: string
  ): CityWeatherData | null => {
    return weatherData?.[cityName] ?? null;
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
