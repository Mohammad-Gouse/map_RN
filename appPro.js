import { Alert, Image, Text, View, Platform } from 'react-native'
import MapView, { Callout, Circle, Marker, PROVIDER_GOOGLE, Polygon } from 'react-native-maps'
import React, { Component } from 'react'
import { enableLatestRenderer } from 'react-native-maps';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import { request, PERMISSIONS } from 'react-native-permissions';
import Geolocation from '@react-native-community/geolocation';


// enableLatestRenderer();

const homePlace = {
    description: 'Home',
    geometry: { location: { lat: 19.133652, lng: 72.832665 } },
};
const workPlace = {
    description: 'Work',
    geometry: { location: { lat: 19.133654, lng: 72.832661 } },
};


const AppPro = () => {
    const [pin, setPin] = React.useState({ latitude: 19.133655, longitude: 72.832660 })


    state = {
        coordinates: [
            { name: '1', latitude: 19.133655, longitude: 72.832660 },
            { name: '2', latitude: 19.103655, longitude: 72.831660 },
            { name: '3', latitude: 19.093655, longitude: 72.831660 },
            { name: '4', latitude: 19.103655, longitude: 72.853660 },
            { name: '5', latitude: 19.12655, longitude: 72.854660 },
            { name: '6', latitude: 19.13655, longitude: 72.832660 },
        ]
    }

    showWelcomeMessage = () =>
        Alert.alert(
            'welcome to Mumbai',
            'the food is amazing',
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
            var response = await request(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE)
            console.log('iphone: ' + response)

            if (response === 'granted') {
                this.locatateCurrentPosition();
            } else {
                var response = await request(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION)
                console.log('Android: ' + response)

                if (response === 'granted') {
                    this.locatateCurrentPosition();
                }
            }

        } else {

        }
    }

    locatateCurrentPosition = () => {
        Geolocation.getCurrentPosition(
            position => {
                console.log(JSON.stringify(position));
            }
        )
    }
    return (
        <View style={{ marginTop: 50, flex: 1 }}>
            <GooglePlacesAutocomplete
                placeholder='Search'
                onPress={(data, details = null) => {
                    // 'details' is provided when fetchDetails = true
                    console.log(data, details);
                }}
                query={{
                    key: 'AIzaSyCbHY4QsciUOrhv2LI9YOBr43g3YnIWw34',
                    language: 'en',
                }}
                predefinedPlaces={[homePlace, workPlace]}
                styles={{
                    container: { flex: 0, position: "absolute", width: "100%", zIndex: 1 },
                    listView: { backgroundColor: "white" }
                }}
            />
            <MapView
                provider={PROVIDER_GOOGLE}
                style={{ width: '100%', height: '100%' }}
                initialRegion={{
                    latitude: 19.133655,
                    longitude: 72.832660,
                    latitudeDelta: 0.0922,
                    longitudeDelta: 0.0421,
                }}>

                <Polygon
                    coordinates={this.state.coordinates}
                    fillColor={'rgba(100, 200, 200, 0.3)'}
                    strokeWidth={3}
                />
                <Marker
                    coordinate={pin}
                    pinColor={'navy'}
                    draggable={true}
                    onDragStart={(e) => {
                        console.log("Drag start", e.nativeEvent.coordinate)
                    }}
                    onDragEnd={(e) => {
                        setPin({
                            latitude: e.nativeEvent.coordinate.latitude,
                            longitude: e.nativeEvent.coordinate.longitude
                        })
                    }}
                >

                    <Callout onPress={this.showWelcomeMessage}>
                        <Text>I'm here</Text>
                    </Callout>

                </Marker>
                {
                    this.state.coordinates.map(marker => (
                        <Marker
                            key={marker.name}
                            coordinate={{ latitude: marker.latitude, longitude: marker.longitude }}
                            title={marker.name}
                        >

                            <Callout>
                                <Image
                                    style={{ width: 50, height: 50 }}
                                    source={require('./images/food.png')}
                                />
                                <Text>{marker.name}</Text>
                            </Callout>
                        </Marker>
                    ))
                }
                <Circle
                    center={pin}
                    radius={1000}
                />
            </MapView>

        </View>
    )
}

export default AppPro