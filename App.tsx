import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from './src/screens/HomeScreen';
import RecognitionScreen from './src/screens/RecognitionScreen';
import ResultScreen from './src/screens/ResultScreen';
import Ionicons from 'react-native-vector-icons/Ionicons';

const Tab = createBottomTabNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName: any;

            if (route.name === 'Home') {
              iconName = focused ? 'home' : 'home-outline';
            } else if (route.name === 'RecognitionScreen') {
              iconName = focused ? 'camera' : 'camera-outline';
            } else if (route.name === 'ResultScreen') {
              iconName = focused ? 'checkmark-circle' : 'checkmark-circle-outline';
            }

            return <Ionicons name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: '#1fa35a', 
          tabBarInactiveTintColor: 'gray', 
          tabBarStyle: styles.tabBar, 
          tabBarLabelStyle: styles.tabBarLabel,
          tabBarIconStyle: styles.tabBarIcon,
        })}
      >
        <Tab.Screen name="Home" component={HomeScreen} options={{ title: 'Home', headerShown: false }} />
        <Tab.Screen name="RecognitionScreen" component={RecognitionScreen} options={{ title: 'Recognition', headerShown: false }} />
        <Tab.Screen name="ResultScreen" component={ResultScreen} options={{ title: 'Results', headerShown: false }} />
      </Tab.Navigator>
    </NavigationContainer>
  );
};

export default App;

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: '#fff', // White background for the tab bar
    borderTopWidth: 0, // Remove the default border
    elevation: 5, // Add shadow for Android
    shadowColor: '#000', // Shadow for iOS
    shadowOffset: { width: 0, height: 2 }, // Shadow offset for iOS
    shadowOpacity: 0.1, // Shadow opacity for iOS
    shadowRadius: 3, // Shadow radius for iOS
    paddingBottom: 5, // Add padding for icons
    height: 60, // Increase height for larger icons and labels
  },
  tabBarLabel: {
    fontSize: 12, // Adjust label size
    fontWeight: '600', // Label weight
    paddingBottom: 4, // Adjust spacing between icon and label
  },
  tabBarIcon: {
    paddingTop: 5, // Adjust icon top padding
  },
});
