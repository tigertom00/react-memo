import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import React, { createContext, useContext, useEffect, useState } from 'react';
import Toast from 'react-native-toast-message';
import axiosInstance from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState(null);

  // Check for existing tokens on app load
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const accessToken = await AsyncStorage.getItem('access_token');
        if (accessToken) {
          // Fetch user data
          const response = await axiosInstance.get('/user/', {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          });
          setUser(response.data[0]);
          setIsAuthenticated(true);
        }
      } catch (error) {
      } finally {
        setIsLoading(false);
      }
    };
    checkAuth();
  }, []);

  // Login function
  const login = async (username, password) => {
    try {
      const response = await axiosInstance.post('token/', {
        username,
        password,
      });
      await AsyncStorage.setItem('access_token', response.data.access);
      await AsyncStorage.setItem('refresh_token', response.data.refresh);

      const userResponse = await axiosInstance.get('/user/', {
        headers: {
          Authorization: `Bearer ${response.data.access}`,
        },
      });

      setUser(userResponse.data[0]);
      setIsAuthenticated(true);
      router.replace('/home');
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Login Failed',
        text2: error.response.data || 'Invalid credentials.',
      });
      throw error;
    }
  };

  // Register function
  const register = async (email, password1, password2) => {
    try {
      await axiosInstance.post('register/', {
        email,
        password1,
        password2,
      });
      Toast.show({
        type: 'success',
        text1: 'Registration Successful',
        text2: 'Please log in with your new account.',
      });
      router.replace('/auth');
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Registration Failed',
        text2: error.response?.data?.detail || 'Please check your input.',
      });
      throw error;
    }
  };

  // Logout function
  const logout = async () => {
    try {
      const refreshToken = await AsyncStorage.getItem('refresh_token');
      if (refreshToken) {
        await axiosInstance.post('token/blacklist/', {
          refresh_token: refreshToken,
        });
      }
      await AsyncStorage.removeItem('access_token');
      await AsyncStorage.removeItem('refresh_token');
      setIsAuthenticated(false);
      setUser(null);
      router.replace('/auth');
    } catch (error) {
      console.error('Logout failed:', error.message);
      Toast.show({
        type: 'error',
        text1: 'Logout Failed',
        text2: 'Please try again.',
      });
    }
  };

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, isLoading, user, login, register, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
export default useAuth;
