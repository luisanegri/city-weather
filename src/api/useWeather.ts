import { useState, useEffect } from 'react';
import axios, { AxiosError } from 'axios';
import { WeatherData, MergedWeatherData } from '../types/weatherTypes';

const API_URL = "https://us-central1-mobile-assignment-server.cloudfunctions.net/weather";

const useWeather = () => {
  const [weatherData, setWeatherData] = useState<MergedWeatherData | undefined>();
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<AxiosError | null>(null);

  const mergeWeatherDataByCity = (weatherDataArray: WeatherData[]) => {
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

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const response = await axios.get(API_URL);
        const mergedWeatherData = mergeWeatherDataByCity(response.data);

        setWeatherData(mergedWeatherData);

      } catch (error) {
        setError(error as AxiosError);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const getWeatherDetailsForCity = (cityName: string) => {
    return weatherData[cityName];
  };

  return {
    loading,
    error,
    weatherData,
    getWeatherDetailsForCity,
  };
};

export default useWeather;

