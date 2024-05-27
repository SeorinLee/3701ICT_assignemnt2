//AuthContext.js
import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useDispatch } from 'react-redux';
import { signIn, signOut } from '../store/actions';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const dispatch = useDispatch();

  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const storedStatus = await AsyncStorage.getItem('isLoggedIn');
        const storedUser = await AsyncStorage.getItem('user');
        if (storedStatus === 'true' && storedUser) {
          setIsLoggedIn(true);
          const userData = JSON.parse(storedUser);
          setUser(userData);
          dispatch(signIn(userData));
        }
      } catch (error) {
        console.error('Failed to fetch login status:', error);
      } finally {
        setIsLoading(false);
      }
    };

    checkLoginStatus();
  }, [dispatch]);

  const logIn = async (userData) => {
    try {
      await AsyncStorage.setItem('isLoggedIn', 'true');
      await AsyncStorage.setItem('user', JSON.stringify(userData));
      setIsLoggedIn(true);
      setUser(userData);
      dispatch(signIn(userData));
    } catch (error) {
      console.error('Failed to log in:', error);
    }
  };

  const logOut = async () => {
    try {
      await AsyncStorage.removeItem('isLoggedIn');
      await AsyncStorage.removeItem('user');
      setIsLoggedIn(false);
      setUser(null);
      dispatch(signOut());
    } catch (error) {
      console.error('Failed to log out:', error);
    }
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, isLoading, user, logIn, logOut }}>
      {children}
    </AuthContext.Provider>
  );
};
