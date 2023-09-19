import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from '../screens/HomeScreen';
import WeatherDetailsScreen from '../screens/WeatherDetailsScreen'
import { Routes } from './routes';

const Stack = createStackNavigator();

const AppNavigator: React.FC = () => {
  return (
    <Stack.Navigator
      initialRouteName={Routes.Home}
    >
      <Stack.Screen name={Routes.Home} component={HomeScreen} />
      <Stack.Screen name={Routes.WeatherDetails} component={WeatherDetailsScreen} options={{ title: 'Weather Details' }} />
    </Stack.Navigator>
  );
};

export default AppNavigator;
