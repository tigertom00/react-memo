import { router } from 'expo-router';
import React, { useEffect } from 'react';
import { Button, Text, View } from 'react-native';
import { useAuth } from './src/context/AuthContext';
import axiosInstance from './src/services/api';

export default function HomeScreen() {
  const { isAuthenticated, isLoading, logout } = useAuth();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace('/auth');
    }
  }, [isAuthenticated, isLoading]);

  const fetchProtectedData = async () => {
    try {
      const response = await axiosInstance.get('/user/');
      console.log('Protected data:', response.data[0]);
    } catch (error) {
      console.error('Error fetching protected data:', error);
    }
  };

  if (isLoading) {
    return <Text>Loading...</Text>;
  }

  return (
    <View style={{ flex: 1, justifyContent: 'center', padding: 20 }}>
      <Text style={{ fontSize: 24, marginBottom: 20 }}>Welcome to Home</Text>
      <Button title='Fetch Protected Data' onPress={fetchProtectedData} />
      <Button title='Logout' onPress={logout} />
    </View>
  );
}
