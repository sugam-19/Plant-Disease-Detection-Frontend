import React, { createContext, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage'; 
import jwtDecode from 'jwt-decode';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userData, setUserData] = useState(null);

  const logout = () => {
    AsyncStorage.removeItem("userToken");
    setIsAuthenticated(false);
    setUserData(null);
  };

  const decodeToken = async () => {
    try {
      const token = await AsyncStorage.getItem("userToken");
      if (token) {
        const decoded = jwtDecode(token);
        setUserData(decoded);
      }
    } catch (error) {
      console.error("Failed to decode token", error);
    }
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, setIsAuthenticated, logout, userData, decodeToken }}>
      {children}
    </AuthContext.Provider>
  );
};
