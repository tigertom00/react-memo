import { useRouter } from 'expo-router';
import { useEffect } from 'react';
import { Text, View } from 'react-native';

export default function Index() {
  const router = useRouter();

  useEffect(() => {
    const isAuthenticated = false; // Replace with real logic
    if (!isAuthenticated) {
      router.replace('/auth');
    }
  }, []);

  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <Text>Edit app/index.tsx to edit thisdsds screen.!!!A</Text>
    </View>
  );
}
