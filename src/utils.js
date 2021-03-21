import Geocoder from 'react-native-geocoding';

const weatherApiKey = 'd033ac600aea9cf663167872dd1ea681';
const googleMapsApiKey = 'AIzaSyAKQBdLrUg0ZN7_it8QaOclQz62nYljyLk';

Geocoder.init(googleMapsApiKey);

const dayNames = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday'
]

export const initialRegion = {
  latitude: 50.4433261,
  longitude: 30.5197434,
  latitudeDelta: 0.7916398976908638,
  longitudeDelta: 0.8628934621810913,
}

export const getDayName = timestamp => {
  const date = new Date(timestamp * 1000);
  return dayNames[date.getDay()];
}

export const getDayMonth = timestamp => {
  const date = new Date(timestamp * 1000);
  const dayNumber = date.getDate();
  const monthNumber = date.getMonth() + 1;
  const formattedDay = ('0' + dayNumber).slice(-2);
  const formattedMonth = ('0' + monthNumber).slice(-2);
  return `${formattedDay}.${formattedMonth}`;
}

export const getGeocodeByAddress = async address => {
  return await Geocoder.from(address);
}

export const getGeocodeByCoord = async (lon, lat) => {
  return await Geocoder.from(lon, lat);
}

export const getDayData = async (lat, lon) => {
  const url = `http://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${weatherApiKey}&units=metric&lang=en`;
  const request = await fetch(url);
  return await request.json();
}

export const getWeekDataByCoord = async (lat, lon) => {
  const url = `http://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&appid=${weatherApiKey}&units=metric&exclude=minutely,hourly,current`;
  const request = await fetch(url);
  return await request.json();
}

export const getIconSource = iconCode => {
  return { uri: `http://openweathermap.org/img/wn/${iconCode}@2x.png` }
}