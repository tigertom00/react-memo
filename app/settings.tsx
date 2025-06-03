// screens/SettingsScreen.js
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Button, Text, useTheme as usePaperTheme } from 'react-native-paper';
import { useTheme } from './src/context/ThemeContext';

const SettingsScreen = () => {
  const { themeMode, setTheme } = useTheme();
  const { colors } = usePaperTheme();

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={{ color: colors.onBackground, marginBottom: 20 }}>
        Current Theme: {themeMode}
      </Text>
      <Button
        mode='contained'
        onPress={() => setTheme('system')}
        style={styles.button}
        icon='theme-light-dark' // Material Community Icon
      >
        Use System Theme
      </Button>
      <Button
        mode='contained'
        onPress={() => setTheme('light')}
        style={styles.button}
        icon='weather-sunny'
      >
        Light Theme
      </Button>
      <Button
        mode='contained'
        onPress={() => setTheme('dark')}
        style={styles.button}
        icon='weather-night'
      >
        Dark Theme
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  button: {
    marginVertical: 8,
    width: '80%',
  },
});

export default SettingsScreen;
