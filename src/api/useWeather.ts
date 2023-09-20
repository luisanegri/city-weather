import { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = "https://us-central1-mobile-assignment-server.cloudfunctions.net/weather";

const useWeather = () => {
  const [weatherData, setWeatherData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const response = await axios.get(API_URL);
        setWeatherData(response.data)

      } catch (error) {
        setError(error);
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

