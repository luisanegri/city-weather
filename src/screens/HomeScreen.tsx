import { View, Button, Text } from "react-native";

const HomeScreen = ({ navigation }) => {
    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Text>Home Screen</Text>
            <Button
                title="Go to Weather Details"
                onPress={() => navigation.navigate('WeatherDetails')}
            />
        </View>
    );
}

export default HomeScreen