import CityWeatherList from '../components/CityWeatherList';
import CityImageWithLabel from '../components/CityImageWithLabel';
import { CityWeatherData } from "../types/weatherTypes"

const WeatherDetailsScreen = ({ route }) => {
    const weatherDataForCity: CityWeatherData = route.params.weatherDataForCity

    const convertToCelsius = (temp: number, tempType: string) => {
        switch (tempType) {
            case "F":
                return (temp - 32) / 1.8; // Fahrenheit to Celsius
            case "K":
                return temp - 273.15; // Kelvin to Celsius
            case "C":
            default:
                return temp; // Already in Celsius
        }
    };

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

