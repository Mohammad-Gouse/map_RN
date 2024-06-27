import { Image, Text, View } from 'react-native'
import MapView, { Callout, Circle, Marker, PROVIDER_GOOGLE, Polygon } from 'react-native-maps'
import React from 'react'
import { enableLatestRenderer } from 'react-native-maps';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';

enableLatestRenderer();

const homePlace = {
  description: 'Home',
  geometry: { location: { lat: 19.133652, lng: 72.832665 } },
};
const workPlace = {
  description: 'Work',
  geometry: { location: { lat: 19.133654, lng: 72.832661 } },
};

const App = () => {
  const [pin, setPin] = React.useState({ latitude: 19.133655, longitude: 72.832660 })

  const state = {
    coordinates: [
      { name: '1', latitude: 19.133655, longitude: 72.832660 },
      { name: '2', latitude: 19.113655, longitude: 72.822660 },
      { name: '3', latitude: 19.093655, longitude: 72.812660 },
      { name: '4', latitude: 19.103655, longitude: 72.852660 },
      { name: '5', latitude: 19.123655, longitude: 72.854660 },
      { name: '6', latitude: 19.133655, longitude: 72.832660 },
    ]
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

          <Callout>
            <Image source={require('./images/food.png')} />
            <Text>I'm here</Text>
          </Callout>
        </Marker>
        <Circle
          center={pin}
          radius={1000}
        />
      </MapView>

    </View>
  )
}

export default App