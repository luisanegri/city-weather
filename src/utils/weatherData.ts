import { WeatherData, MergedWeatherData } from "../types/weatherTypes";

export const mergeWeatherDataByCity = (weatherDataArray: WeatherData[]): MergedWeatherData => {
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

export const convertToCelsius = (temp: number, tempType: string) => {
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
