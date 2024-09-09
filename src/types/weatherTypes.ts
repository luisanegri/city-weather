export type CityData = {
  name: string;
  picture: string;
};

export type WeatherData = {
  city: CityData;
  date: string;
  temp: number;
  tempType: string;
};

export type Weather = {
  date: string;
  temp: number;
  tempType: string;
};

export type CityWeatherData = {
  city: CityData;
  weather: Weather[];
};

export type MergedWeatherData = {
  [key: string]: CityWeatherData;
};
