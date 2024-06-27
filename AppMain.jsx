import React, { Component } from 'react';
import {
    StyleSheet,
    View,
    Text,
    Image,
    Alert,
    Platform,
    Dimensions
} from 'react-native';
import MapView,
{ PROVIDER_GOOGLE, Marker, Callout, Polygon, Circle }
    from 'react-native-maps';
import { request, PERMISSIONS } from 'react-native-permissions';
import Geolocation from '@react-native-community/geolocation';
import Carousel from 'react-native-snap-carousel';

export default class CarouselMap extends Component {

    static navigationOptions = {
        title: 'Mumbai',
    };

    state = {
        markers: [],
        coordinates: [
            { name: 'Zara', location: 'Andheri (W)', latitude: 19.133655, longitude: 72.832660, image: require('./images/zara.jpg') },
            {
                name: 'Louis vuitton', location: 'Andheri (E)', latitude: 19.103655, longitude: 72.831660,
                image: require('./images/lv.jpg')
            },
            {
                name: 'Mufti', location: 'Andheri (E)', latitude: 19.093655, longitude: 72.831660,
                image: require('./images/mufti.jpg')
            },
            {
                name: 'Being Human', location: 'Juhu', latitude: 19.103655, longitude: 72.853660,
                image: require('./images/bh.jpg')
            },
            {
                name: 'Zudio', location: 'Vile Parle', latitude: 19.12655, longitude: 72.854660,
                image: require('./images/zudio.jpg')
            },
            {
                name: "Levi's", location: 'Infiniti Mall', latitude: 19.14255, longitude: 72.832660,
                image: require('./images/levis.jpg')
            },
        ]
    }

    componentDidMount() {
        this.requestLocationPermission();
    }

    showWelcomeMessage = () =>
        Alert.alert(
            'Welcome to San Francisco',
            'The food is amazing',
            [
                {
                    text: 'Cancel',
                    style: 'cancel'
                },
                {
                    text: 'Ok'
                }
            ]
        )

    requestLocationPermission = async () => {
        if (Platform.OS === 'ios') {
            var response = await request(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE);
            console.log('iPhone: ' + response);

            if (response === 'granted') {
                this.locateCurrentPosition();
            }
        } else {
            var response = await request(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION);
            console.log('Android: ' + response);

            if (response === 'granted') {
                this.locateCurrentPosition();
            }
        }
    }

    locateCurrentPosition = () => {
        Geolocation.getCurrentPosition(
            position => {
                console.log(JSON.stringify(position));

                let initialPosition = {
                    latitude: 19.133655,
                    longitude: 72.832660,
                    latitudeDelta: 0.0922,
                    longitudeDelta: 0.0421,
                }

                this.setState({ initialPosition });
            },
            error => Alert.alert(error.message),
            { enableHighAccuracy: true, timeout: 10000, maximumAge: 1000 }
        )
    }

    onCarouselItemChange = (index) => {
        let location = this.state.coordinates[index];

        this._map.animateToRegion({
            latitude: location.latitude,
            longitude: location.longitude,
            latitudeDelta: 0.09,
            longitudeDelta: 0.035
        })

        this.state.markers[index].showCallout()
    }

    onMarkerPressed = (location, index) => {
        this._map.animateToRegion({
            latitude: location.latitude,
            longitude: location.longitude,
            latitudeDelta: 0.09,
            longitudeDelta: 0.035
        });

        this._carousel.snapToItem(index);
    }

    renderCarouselItem = ({ item }) =>
        <View style={styles.cardContainer}>
            <Text style={styles.cardTitle}>{item.name}</Text>
            <Text style={styles.cardLocation}>{item.location}</Text>
            <Image style={styles.cardImage} source={item.image} />
        </View>

    render() {
        return (
            <View style={styles.container}>
                <MapView
                    provider={PROVIDER_GOOGLE}
                    ref={map => this._map = map}
                    showsUserLocation={true}
                    style={styles.map}
                    initialRegion={this.state.initialPosition}>

                    <Polygon
                        coordinates={this.state.coordinates}
                        fillColor={'rgba(100, 100, 200, 0.3)'}
                    />
                    <Circle
                        center={{ latitude: 37.8025259, longitude: -122.4351431 }}
                        radius={1000}
                        fillColor={'rgba(200, 300, 200, 0.5)'}
                    />
                    <Marker
                        draggable
                        coordinate={{ latitude: 37.7825259, longitude: -122.4351431 }}
                        image={require('./images/zara.jpg')}>

                        <Callout onPress={this.showWelcomeMessage}>
                            <Text>An Interesting city</Text>
                        </Callout>

                    </Marker>
                    {
                        this.state.coordinates.map((marker, index) => (
                            <Marker
                                key={marker.name}
                                ref={ref => this.state.markers[index] = ref}
                                onPress={() => this.onMarkerPressed(marker, index)}
                                coordinate={{ latitude: marker.latitude, longitude: marker.longitude }}
                            >
                                <Callout>
                                    <Text>{marker.name}</Text>
                                </Callout>

                            </Marker>
                        ))
                    }


                </MapView>
                <Carousel
                    ref={(c) => { this._carousel = c; }}
                    data={this.state.coordinates}
                    containerCustomStyle={styles.carousel}
                    renderItem={this.renderCarouselItem}
                    sliderWidth={Dimensions.get('window').width}
                    itemWidth={300}
                    removeClippedSubviews={false}
                    onSnapToItem={(index) => this.onCarouselItemChange(index)}
                />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        ...StyleSheet.absoluteFillObject
    },
    map: {
        ...StyleSheet.absoluteFillObject
    },
    carousel: {
        position: 'absolute',
        bottom: 0,
        marginBottom: 48
    },
    cardContainer: {
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        height: 200,
        width: 300,
        padding: 24,
        borderRadius: 24
    },
    cardImage: {
        height: 120,
        width: 300,
        bottom: 0,
        position: 'absolute',
        borderBottomLeftRadius: 24,
        borderBottomRightRadius: 24
    },
    cardTitle: {
        color: 'white',
        fontSize: 22,
        alignSelf: 'center'
    },
    cardLocation: {
        color: 'black',
        fontSize: 12,
        alignSelf: 'center'
    }
});