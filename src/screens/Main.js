import React, { useState, useEffect, useRef } from 'react';
import {
  StyleSheet,
  View,
  Text,
  StatusBar,
  TouchableOpacity,
  Image
} from 'react-native';
import {
  initialRegion,
  getDayData,
  getIconSource
} from '../utils';
import MapView, { Marker } from 'react-native-maps';
import Icon from 'react-native-vector-icons/FontAwesome5';

const MainMap = props => {
  const [isCalloutShow, setIsCalloutShow] = useState(false);
  const [marker, setMarker] = useState();

  const markerRef = useRef();
  const mapViewRef = useRef();

  useEffect(() => {
    if (isCalloutShow) {
      markerRef.current?.showCallout();
    }
  }, [marker])

  const setMapMarker = async event => {
    const coord = event.nativeEvent.coordinate;
    const lat = coord.latitude;
    const lon = coord.longitude;
    const weatherData = await getDayData(lat, lon);
    setMarker(weatherData);
  }

  const goToMarker = () => {
    mapViewRef.current.animateCamera({
      center: {
        latitude: marker.coord.lat,
        longitude: marker.coord.lon
      }
    })
  }

  const onMarkerPress = () => {
    isCalloutShow
      ? props.navigation.navigate('Search', {
        coord: marker.coord,
        address: marker.name.length > 0
          ? `${marker.name}, ${marker.sys.country}`
          : ''
      })
      : setIsCalloutShow(true);
  }

  const renderCallout = () => {
    return (
      <View style={styles.calloutBox}>
        <Text>
          {marker.name.length > 0
            ? `${marker.name}, ${marker.sys.country}`
            : 'No name region'}
        </Text>
        <View style={styles.tempBox}>
          <Image
            style={styles.weatherImage}
            source={getIconSource(marker.weather[0].icon)}
          />
          <Text style={styles.temperature}>
            {marker.main.temp.toFixed(0)}&deg;
          </Text>
        </View>
        <Text style={styles.weatherDescription}>
          {marker.weather[0].description}
        </Text>
      </View>
    )
  }

  return (
    <View style={styles.main}>
      <StatusBar
        translucent
        barStyle='dark-content'
        backgroundColor='rgba(0,0,0,0)'
      />
      <MapView
        showsCompass={false}
        rotateEnabled={false}
        style={styles.map}
        ref={mapViewRef}
        initialRegion={initialRegion}
        onLongPress={event => setMapMarker(event)}
        onPress={() => setIsCalloutShow(false)}
      >
        {marker &&
          <Marker
            ref={markerRef}
            coordinate={{
              latitude: marker.coord.lat,
              longitude: marker.coord.lon
            }}
            onPress={() => onMarkerPress()}
          >
            {isCalloutShow && renderCallout()}
            <Icon
              name='map-marker-alt'
              color='#2765f5'
              size={30}
              style={styles.marker}
            />
          </Marker>
        }
      </MapView>

      {marker &&
        <View style={styles.locationBox}>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => goToMarker()}
          >
            <Text style={styles.locationText}>
              {'Marker: '}
              {`lat. ${marker?.coord.lat}, `}
              {`lon. ${marker?.coord.lon}`}
            </Text>
          </TouchableOpacity>
        </View>
      }
    </View>
  )
}

export default MainMap;

const styles = StyleSheet.create({
  main: {
    flex: 1,
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  locationBox: {
    position: 'absolute',
    top: 35,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
  },
  locationText: {
    backgroundColor: 'rgba(255,255,255,0.9)',
    elevation: 2,
    padding: 10,
    borderRadius: 20,
  },
  temperature: {
    color: '#1b77f7',
    alignSelf: 'center',
    marginLeft: 5
  },
  calloutBox: {
    backgroundColor: 'white',
    elevation: 15,
    borderRadius: 10,
    borderColor: '#dfe1e8',
    borderWidth: 1,
    padding: 10,
    zIndex: 999
  },
  tempBox: {
    flexDirection: 'row',
    alignSelf: 'center'
  },
  weatherImage: {
    width: 30,
    height: 30
  },
  weatherDescription: {
    alignSelf: 'center',
    color: 'gray',
    fontSize: 12
  },
  marker: {
    alignSelf: 'center',
    marginTop: 5
  }
})