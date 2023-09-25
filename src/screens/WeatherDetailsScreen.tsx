import { useLayoutEffect } from 'react';
import CityWeatherList from '../components/CityWeatherList';
import CityImageWithLabel from '../components/CityImageWithLabel';
import { CityWeatherData } from "../types/weatherTypes"
import { convertToCelsius } from '../utils/weatherData';

const WeatherDetailsScreen = ({ route, navigation }) => {
    const weatherDataForCity: CityWeatherData = route.params.weatherDataForCity

    useLayoutEffect(() => {
        navigation.setOptions({
            title: weatherDataForCity.city.name,
        });
    }, [navigation, weatherDataForCity.city.name]);

    const sortedAndConvertedWeather = weatherDataForCity.weather
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
        .map(item => ({
            ...item,
            temp: Math.round(convertToCelsius(item.temp, item.tempType)),
            tempType: "C"
        }));

    const sortedWeatherDataForCity = {
        ...weatherDataForCity,
        weather: sortedAndConvertedWeather
    };

    return (
        <>
            <CityImageWithLabel
                cityName={weatherDataForCity.city.name}
                imageUrl={weatherDataForCity.city.picture}
            />
            <CityWeatherList weatherData={sortedWeatherDataForCity.weather} />
        </>

    )
}

export default WeatherDetailsScreen

