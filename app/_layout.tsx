import { Stack } from 'expo-router';
import { ThemeProvider } from './theme/ThemeContext';
export default function RootLayout() {
  return (
    <ThemeProvider>
      <Stack>
        <Stack.Screen name='index' options={{ headerShown: false }} />
        <Stack.Screen name='settings' options={{ headerShown: false }} />
        <Stack.Screen name='auth' options={{ headerShown: false }} />
      </Stack>
    </ThemeProvider>
  );
}
