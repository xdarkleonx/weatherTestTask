import 'react-native-gesture-handler';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/FontAwesome5';
import MainMap from './screens/Main';
import Search from './screens/Weather';

const Tab = createBottomTabNavigator();

const getTabBarIcons = route => ({
  tabBarIcon: ({ color }) => {
    const iconName = route.name === 'Map' ? 'map' : 'search';
    return <Icon name={iconName} size={20} color={color} />
  }
})

const App = () => {
  return (
    <NavigationContainer>
      <Tab.Navigator
        initialRouteName='Map'
        screenOptions={({ route }) => getTabBarIcons(route)}
        tabBarOptions={{ activeTintColor: '#2765f5' }}
      >
        <Tab.Screen name='Map' component={MainMap} />
        <Tab.Screen name='Search' component={Search} />
      </Tab.Navigator>
    </NavigationContainer>
  )
}

export default App;