// theme/ThemeContext.js
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Font from 'expo-font';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { Appearance } from 'react-native';
import { DefaultTheme, Provider as PaperProvider } from 'react-native-paper';

// Define light and dark themes
const lightTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: '#007bff',
    accent: '#ff4081',
    background: '#fff',
    text: '#000',
    surface: '#fff',
  },
};

const darkTheme = {
  ...DefaultTheme,
  dark: true,
  colors: {
    ...DefaultTheme.colors,
    primary: '#1e90ff',
    accent: '#ff6f91',
    background: '#222',
    text: '#fff',
    surface: '#333',
  },
};

// Create Theme Context
const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [themeMode, setThemeMode] = useState('system'); // 'system', 'light', or 'dark'
  const [currentTheme, setCurrentTheme] = useState(
    Appearance.getColorScheme() || 'light'
  );
  const [fontsLoaded, setFontsLoaded] = useState(false);

  // Load Material Community Icons font
  useEffect(() => {
    async function loadFonts() {
      try {
        await Font.loadAsync({
          MaterialCommunityIcons: require('@expo/vector-icons/build/vendor/react-native-vector-icons/Fonts/MaterialCommunityIcons.ttf'),
        });
        setFontsLoaded(true);
      } catch (error) {
        console.error('Error loading fonts:', error);
      }
    }
    loadFonts();
  }, []);

  // Load saved theme preference
  useEffect(() => {
    const loadTheme = async () => {
      try {
        const savedTheme = await AsyncStorage.getItem('themeMode');
        if (savedTheme) {
          setThemeMode(savedTheme);
          if (savedTheme !== 'system') {
            setCurrentTheme(savedTheme);
          }
        }
      } catch (error) {
        console.error('Failed to load theme:', error);
      }
    };
    loadTheme();
  }, []);

  // Listen for system theme changes
  useEffect(() => {
    if (themeMode === 'system') {
      const subscription = Appearance.addChangeListener(({ colorScheme }) => {
        setCurrentTheme(colorScheme || 'light');
      });
      return () => subscription.remove();
    }
  }, [themeMode]);

  // Set theme (user choice)
  const setTheme = async (mode) => {
    try {
      setThemeMode(mode);
      await AsyncStorage.setItem('themeMode', mode);
      if (mode !== 'system') {
        setCurrentTheme(mode);
      } else {
        setCurrentTheme(Appearance.getColorScheme() || 'light');
      }
    } catch (error) {
      console.error('Failed to save theme:', error);
    }
  };

  // Select the active theme
  const paperTheme = currentTheme === 'light' ? lightTheme : darkTheme;

  // Render nothing until fonts are loaded
  if (!fontsLoaded) {
    return null; // Or a loading screen component
  }

  return (
    <ThemeContext.Provider value={{ themeMode, currentTheme, setTheme }}>
      <PaperProvider theme={paperTheme}>{children}</PaperProvider>
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
export default useTheme;
