import React from "react";
import { View, Text, FlatList, StyleSheet } from "react-native";

import { Weather } from "../types/weatherTypes";
import { formatDate } from "../utils/formatDate";

type CityWeatherListProps = {
  weatherData: Weather[];
};

const CityWeatherList = ({ weatherData }: CityWeatherListProps) => {
  const renderItem = ({ item }: { item: Weather }) => (
    <View style={styles.row}>
      <Text style={styles.dateColumn}>{formatDate(item.date)}</Text>
      <Text style={styles.tempColumn}>{item.temp}°C</Text>
    </View>
  );

  return (
    <>
      <View style={styles.header}>
        <Text style={[styles.dateColumn, styles.label]}>Date & Time</Text>
        <Text style={[styles.tempColumn, styles.label]}>Temperature</Text>
      </View>

      <FlatList
        data={weatherData}
        keyExtractor={(_item, index) => index.toString()}
        renderItem={renderItem}
      />
    </>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    backgroundColor: "#C5DAE7",
    padding: 10,
    alignItems: "center",
  },
  row: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#C5DAE7",
    padding: 10,
  },
  dateColumn: {
    flex: 2,
    fontSize: 16,
  },
  tempColumn: {
    flex: 1,
    fontSize: 16,
    textAlign: "right",
  },
  label: {
    fontWeight: "bold",
  },
});

export default CityWeatherList;
