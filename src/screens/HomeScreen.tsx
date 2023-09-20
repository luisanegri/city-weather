import { FlatList, Text, View, StyleSheet, Button } from 'react-native';
import { Routes } from '../navigation/routes';
import useWeather from '../api/useWeather';


const HomeScreen = ({ navigation }) => {
    const { loading, error, weatherData } = useWeather();

    if (loading) {
        return <Text style={styles.infoText}>Loading...</Text>;
    }

    if (error) {
        return <Text style={styles.errorText}>Error fetching weather data. Please try again.</Text>;
    }

    const cityNames = weatherData ? Object.keys(weatherData).sort() : [];

    return (
        <View style={styles.container}>
            <FlatList
                data={cityNames}
                keyExtractor={(city) => city}
                renderItem={({ item: cityName }) => (
                    <Button
                        title={cityName}
                        onPress={() => navigation.navigate(Routes.WeatherDetails)}
                    />
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

