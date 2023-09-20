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
