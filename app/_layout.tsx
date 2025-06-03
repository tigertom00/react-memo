import { Stack } from 'expo-router';
import Toast from 'react-native-toast-message';
import { AuthProvider } from './src/context/AuthContext';
import { ThemeProvider } from './src/context/ThemeContext';
export default function RootLayout() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <Stack>
          <Stack.Screen name='index' options={{ headerShown: false }} />
          <Stack.Screen name='settings' options={{ headerShown: false }} />
          <Stack.Screen name='auth' options={{ headerShown: false }} />
        </Stack>
      </ThemeProvider>
      <Toast />
    </AuthProvider>
  );
}
