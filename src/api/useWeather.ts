import { useState, useEffect } from 'react';
import axios, { AxiosError } from 'axios';
import { WeatherData } from '../types/weatherTypes';

const API_URL = "https://us-central1-mobile-assignment-server.cloudfunctions.net/weather";

const useWeather = () => {
  const [weatherData, setWeatherData] = useState<WeatherData | undefined>();
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<AxiosError | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const response = await axios.get(API_URL);
        setWeatherData(response.data)

      } catch (error) {
        setError(error as AxiosError);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);


  return {
    loading,
    error,
    weatherData,
  };
};

export default useWeather;

