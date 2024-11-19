import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from './src/screens/HomeScreen';
import RecognitionScreen from './src/screens/RecognitionScreen';
import ResultScreen from './src/screens/ResultScreen';
import Ionicons from 'react-native-vector-icons/Ionicons';
import SplashScreen from './src/navigation/SplashScreen/SplashScreen';
import SignInScreen from './src/navigation/SignInScreen/SignInScreen';
import SignUpScreen from './src/navigation/SignUpScreen/SignUpScreen';
import { createStackNavigator } from '@react-navigation/stack';
import Toast from 'react-native-toast-message';
import { AuthProvider, AuthContext  } from "./src/components/context/AuthContext";
import ForgotPasswordScreen from './src/navigation/ForgotPasswordScreen/ForgotPasswordScreen';
import ResetPasswordScreen from './src/navigation/ResetPasswordScreen/ResetPasswordScreen';
import ProfileScreen from './src/screens/ProfileScreen/ProfileScreen';

export type RootStackParamList = {
  RecognitionScreen: undefined;
  ResultScreen: { capturedImage: string | null };
};

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const AuthenticatedTabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }): any => ({
        tabBarIcon: ({ focused, color, size }: any) => {
          let iconName: any;

          if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'RecognitionScreen') {
            iconName = focused ? 'camera' : 'camera-outline';
          } else if (route.name === 'ProfileScreen') {
            iconName = focused ? 'person' : 'person-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#1fa35a',
        tabBarInactiveTintColor: 'gray',
        tabBarStyle: {
          backgroundColor: '#fff',
          borderTopWidth: 0,
          elevation: 5,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 3,
          paddingBottom: 5,
          height: 60,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
          paddingBottom: 4,
        },
        tabBarIconStyle: styles.tabBarIcon,
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} options={{ title: 'Home', headerShown: false }} />
      <Tab.Screen name="RecognitionScreen" component={RecognitionScreen} options={{ title: 'Recognition', headerShown: false }} />
      {/* <Tab.Screen name="ResultScreen" component={ResultScreen} options={{ title: 'Results', headerShown: false }} /> */}
      <Tab.Screen name="ProfileScreen" component={ProfileScreen} />
    </Tab.Navigator>
  );
};

const UnauthenticatedStackNavigator = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name="SplashScreen" component={SplashScreen} options={{ headerShown: false }} />
      <Stack.Screen name="SignInScreen" component={SignInScreen} options={{ title: 'Sign In', headerShown: false }} />
      <Stack.Screen name="SignUpScreen" component={SignUpScreen} options={{ title: 'Sign Up', headerShown: false }} />
      <Stack.Screen name="ForgotPasswordScreen" component={ForgotPasswordScreen} options={{ title: 'Forgot Password', headerShown: false }} />
      <Stack.Screen name="ResetPasswordScreen" component={ResetPasswordScreen} options={{ title: 'Reset Password', headerShown: false }} />
    </Stack.Navigator>
  );
};

const MainNavigator = () => {
  const { isAuthenticated } = React.useContext(AuthContext);

  return (
    <Stack.Navigator>
      {isAuthenticated ? (
        <>
          <Stack.Screen name="AuthenticatedTabs" component={AuthenticatedTabNavigator} options={{ headerShown: false }} />
          <Stack.Screen name="ResultScreen" component={ResultScreen} />
        </>
      ) : (
        <Stack.Screen name="UnauthenticatedStack" component={UnauthenticatedStackNavigator} options={{ headerShown: false }} />
      )}
    </Stack.Navigator>
  );
};

const App = () => {
  const [isLoading, setIsLoading] = React.useState(true);
  const { isAuthenticated, setIsAuthenticated } = React.useContext(AuthContext);

  React.useEffect(() => {
    const checkAuthentication = async () => {
      const userIsAuthenticated = isAuthenticated;
      setIsAuthenticated(userIsAuthenticated);
      setIsLoading(false);
    };

    checkAuthentication();
  }, [setIsAuthenticated]);

  if (isLoading) {
    return <SplashScreen />;
  }

  return (
    <NavigationContainer>
      <MainNavigator />
      <Toast />
    </NavigationContainer>
  );
}

export default () => (
  <AuthProvider>
    <App />
  </AuthProvider>
);

const styles = {
  tabBar: {
    backgroundColor: '#fff',
    borderTopWidth: 0,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    paddingBottom: 5,
    height: 60,
  },
  tabBarLabel: {
    fontSize: 12,
    fontWeight: '600',
    paddingBottom: 4,
  },
  tabBarIcon: {
    paddingTop: 5,
  },
};
