import React from "react";
import { Text, TouchableOpacity, StyleSheet } from "react-native";

type CityItemProps = {
  cityName: string;
  onPress: (cityName: string) => void;
};

const CityItem: React.FC<CityItemProps> = ({ cityName, onPress }) => (
  <TouchableOpacity onPress={() => onPress(cityName)}>
    <Text style={styles.cityName}>{cityName}</Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  cityName: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
});

export default React.memo(CityItem);
