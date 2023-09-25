import { Dimensions, View, Text, ImageBackground, StyleSheet } from 'react-native';

type CityImageWithLabelProps = {
    cityName: string;
    imageUrl: string
}

const CityImageWithLabel: React.FC<CityImageWithLabelProps> = ({ cityName, imageUrl }) => {
    return (
        <View style={styles.container}>
            <ImageBackground
                source={{ uri: imageUrl }}
                style={styles.imageBackground}
                resizeMode="stretch"
            >
                <View style={styles.overlay}>
                    <Text style={styles.cityName}>{cityName}</Text>
                </View>

            </ImageBackground>
        </View>
    )
};

const styles = StyleSheet.create({
    container: {
        height: Dimensions.get('window').height * 0.3,
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
    },
    imageBackground: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
    },
    overlay: {
        backgroundColor: 'rgba(0, 0, 0, 0.4)',
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 40,
        paddingVertical: 30
    },
    cityName: {
        color: 'white',
        fontSize: 30,
        fontWeight: 'bold',
    },
});

export default CityImageWithLabel
