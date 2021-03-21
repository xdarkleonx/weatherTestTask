import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert,
  Text,
  ActivityIndicator
} from 'react-native';
import {
  getGeocodeByAddress,
  getGeocodeByCoord,
  getWeekDataByCoord
} from '../utils';
import Icon from 'react-native-vector-icons/FontAwesome5';
import Day from '../components/Day';
import { debounce } from 'lodash';

const Search = props => {
  const [loading, setLoading] = useState(false);
  const [searchAddress, setSearchAddress] = useState('');
  const [previousAddress, setPreviousAddress] = useState('');
  const [fullAddress, setFullAddress] = useState();
  const [weeklyData, setWeeklyData] = useState();

  useEffect(() => {
    getMarkerWeatherData();
  }, [props.route])

  const onSearchAddressChange = e => {
    const text = e.nativeEvent.text;
    const words = text
      .split(' ')
      .map(word => word.replace(/,/g, ''));

    const result = words.length > 1
      ? `${words[0]},${words[1]}`
      : words[0]

    setSearchAddress(result);
  }

  const getMarkerWeatherData = async () => {
    const coord = props.route.params?.coord;
    const markerAddress = props.route.params?.address;

    if (coord) {
      const latNotSame = coord.lat !== weeklyData?.lat;
      const lonNotSame = coord.lon !== weeklyData?.lon;

      if (latNotSame || lonNotSame) {
        setLoading(true);
        const request = await getGeocodeByCoord(coord.lat, coord.lon);

        if (request.status !== 'OK') {
          setLoading(false);
          Alert.alert(
            'Something went wrong',
            'Location is wrong or problems with internet. Repeat request.'
          )
        }

        const formattedAddress = request.results[0].formatted_address;
        const weatherData = await getWeekDataByCoord(coord.lat, coord.lon);

        setPreviousAddress(markerAddress);
        setSearchAddress(markerAddress);
        setFullAddress(formattedAddress);
        setWeeklyData(weatherData);
        setLoading(false);
      }
    }
  }

  const getWeatherData = debounce(async () => {
    const searchAddressNotNull = searchAddress.length > 0;
    const searchAddressNotSame = searchAddress.localeCompare(previousAddress) !== 0;

    if (searchAddressNotNull && searchAddressNotSame) {
      setLoading(true);
      const request = await getGeocodeByAddress(searchAddress);

      if (request.status !== 'OK') {
        setLoading(false);
        Alert.alert(
          'Something went wrong',
          'Location name is wrong or problems with internet. Repeat request.'
        )
      }

      const formattedAddress = request.results[0].formatted_address;
      const coord = request.results[0].geometry.location;
      const weatherData = await getWeekDataByCoord(coord.lat, coord.lng);

      setPreviousAddress(searchAddress);
      setFullAddress(formattedAddress);
      setWeeklyData(weatherData);
      setLoading(false);
    }
  }, 150)

  return (
    <View style={styles.main}>
      <View style={styles.searchBox}>
        <TextInput
          style={styles.textInput}
          maxLength={50}
          defaultValue={searchAddress}
          placeholder='Put city and name'
          onChange={e => onSearchAddressChange(e)}
        />
        <TouchableOpacity
          style={styles.button}
          activeOpacity={0.8}
          onPress={() => getWeatherData()}
        >
          <Icon name='search' color='#2765f5' size={20} />
        </TouchableOpacity>
      </View>
      <Text style={styles.address}>
        {fullAddress}
      </Text>
      {loading
        ? <ActivityIndicator size='large' color='#2765f5' />
        : <ScrollView showsVerticalScrollIndicator={false}>
          {weeklyData?.daily?.map((day, i) => <Day key={i} data={day} />)}
        </ScrollView>
      }
    </View>
  )
}

export default Search;

const styles = StyleSheet.create({
  main: {
    flex: 1,
    marginTop: 25,
    marginHorizontal: 10,
  },
  searchBox: {
    flexDirection: 'row',
    marginVertical: 10
  },
  textInput: {
    flex: 1,
    marginRight: 10,
    justifyContent: 'space-between',
    backgroundColor: 'white',
    elevation: 2,
    borderRadius: 20,
    paddingHorizontal: 15
  },
  button: {
    width: 80,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
    borderRadius: 20,
    elevation: 2,
  },
  address: {
    marginHorizontal: 10,
    marginBottom: 10
  }
})