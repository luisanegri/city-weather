import { FlatList, Text, View, StyleSheet } from 'react-native';
import { useCallback } from 'react';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

import { Routes } from '../navigation/routes';
import useWeather from '../api/useWeather';
import CityItem from '../components/CityItem';
import { AppNavigatorParamList } from '../navigation/AppNavigator';

const HomeScreen = () => {
    const { isLoading, isError, weatherData, getWeatherDetailsForCity } = useWeather();
    const navigation = useNavigation<StackNavigationProp<AppNavigatorParamList, Routes.WeatherDetails>>();

    const cityNames = weatherData ? Object.keys(weatherData).sort() : [];

    const handleCityPress = useCallback((cityName: string) => {
        const data = getWeatherDetailsForCity(cityName);

        navigation.navigate(Routes.WeatherDetails, {
            weatherDataForCity: data
        });
    }, [navigation, getWeatherDetailsForCity]);

    if (isError) {
        return <Text style={styles.errorText}>Error fetching weather data. Please try again.</Text>;
    }

    if (isLoading) {
        return <Text style={styles.infoText}>Loading...</Text>;
    }

    return (
        <View style={styles.container}>
            <FlatList
                data={cityNames}
                keyExtractor={(city) => city}
                renderItem={({ item: cityName }) => (
                    <CityItem cityName={cityName} onPress={handleCityPress} />
                )}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    infoText: {
        padding: 15,
        textAlign: 'center',
    },
    errorText: {
        padding: 15,
        color: 'red',
        textAlign: 'center',
    },
});

export default HomeScreen;
