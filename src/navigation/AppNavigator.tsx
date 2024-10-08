import { createStackNavigator } from "@react-navigation/stack";
import CityListScreen from "../screens/CityListScreen";
import WeatherDetailsScreen from "../screens/WeatherDetailsScreen";
import { Routes } from "./routes";
import { CityWeatherData } from "../types/weatherTypes";

export type AppNavigatorParamList = {
  [Routes.Home]: undefined;
  [Routes.WeatherDetails]: {
    weatherDataForCity: CityWeatherData;
  };
};

const Stack = createStackNavigator<AppNavigatorParamList>();

const AppNavigator: React.FC = () => {
  return (
    <Stack.Navigator initialRouteName={Routes.Home}>
      <Stack.Screen
        name={Routes.Home}
        component={CityListScreen}
        options={{ title: "Weather by City" }}
      />
      <Stack.Screen
        name={Routes.WeatherDetails}
        component={WeatherDetailsScreen}
      />
    </Stack.Navigator>
  );
};

export default AppNavigator;
