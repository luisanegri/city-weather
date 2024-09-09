import {
  Dimensions,
  View,
  Text,
  Image,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { useState } from "react";

type CityImageWithLabelProps = {
  cityName: string;
  imageUrl: string;
};

const CityImageWithLabel = ({
  cityName,
  imageUrl,
}: CityImageWithLabelProps) => {
  const [loading, setLoading] = useState(true);

  return (
    <View style={styles.container}>
      {loading && (
        <ActivityIndicator size="large" color="#0000ff" style={styles.loader} />
      )}
      <Image
        source={{ uri: imageUrl }}
        style={styles.imageBackground}
        resizeMode="cover"
        onLoadEnd={() => setLoading(false)}
        onError={() => setLoading(false)}
      />
      {!loading && (
        <View style={styles.overlay}>
          <Text style={styles.cityName}>{cityName}</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: Dimensions.get("window").height * 0.3,
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  loader: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: [{ translateX: -15 }, { translateY: -15 }],
    zIndex: 1,
  },
  imageBackground: {
    flex: 1,
    width: "100%",
  },
  overlay: {
    backgroundColor: "rgba(0, 0, 0, 0.4)",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 40,
    paddingVertical: 30,
    position: "absolute",
    width: "100%",
    height: "100%",
  },
  cityName: {
    color: "white",
    fontSize: 30,
    fontWeight: "bold",
  },
});

export default CityImageWithLabel;
