import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  Image
} from 'react-native';
import {
  getIconSource,
  getDayName,
  getDayMonth
} from '../utils';
import Icon from 'react-native-vector-icons/MaterialIcons';

const Day = props => {
  return (
    <View style={styles.base}>
      <View style={styles.rowBox}>
        <Text style={styles.dayName}>
          {getDayName(props.data.dt)}
        </Text>
        <Text style={styles.date}>
          {getDayMonth(props.data.dt)}
        </Text>
      </View>
      <View style={styles.rowBox}>
        <Image
          resizeMode='stretch'
          style={styles.weatherImage}
          source={getIconSource(props.data.weather[0].icon)}
        />
        <Text style={styles.description}>
          {props.data.weather[0].description}
        </Text>
      </View>
      <View style={styles.rowBox}>
        <Icon name='wb-sunny' color='#f2a118' size={16} />
        <Text style={styles.temp}>
          {props.data.temp.day.toFixed(0)}&deg;
        </Text>
      </View>
      <View style={styles.rowBox}>
        <Icon name='nightlight-round' color='#b0b5bf' size={16} />
        <Text style={styles.temp}>
          {props.data.temp.night.toFixed(0)}&deg;
        </Text>
      </View>
    </View>
  )
}

export default Day;

const styles = StyleSheet.create({
  base: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'white',
    borderColor: '#d2d3d6',
    borderBottomWidth: 1,
    padding: 15,
    marginBottom: 5,
  },
  weatherImage: {
    width: 30,
    height: 30,
    marginRight: 5,
  },
  date: {
    color: '#aeb1b5',
    marginLeft: 5
  },
  description: {
    color: '#aeb1b5',
    width: 70,
  },
  rowBox: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  temp: {
    minWidth: 25,
    textAlign: 'center'
  },
  dayName: {
    width: 72
  }
})