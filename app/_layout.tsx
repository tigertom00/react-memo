import { Stack } from 'expo-router';
import Toast from 'react-native-toast-message';
import { AuthProvider } from './src/context/AuthContext';
export default function RootLayout() {
  return (
    <AuthProvider>
    
      <Stack>
        <Stack.Screen name='index' options={{ headerShown: false }} />
        <Stack.Screen name='settings' options={{ headerShown: false }} />
        <Stack.Screen name='auth' options={{ headerShown: false }} />
      </Stack>
    
    <Toast />
    </AuthProvider>
  );
}
