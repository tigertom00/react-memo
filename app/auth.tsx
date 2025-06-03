import { useState } from 'react';
import { KeyboardAvoidingView, Platform, View } from 'react-native';
import { ActivityIndicator, Button, Text, TextInput } from 'react-native-paper';
import Toast from 'react-native-toast-message';
import { useAuth } from './src/context/AuthContext';

export default function AuthScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [password2, setPassword2] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isLogin, setIsLogin] = useState<boolean>(false);
  const { login, register } = useAuth();
  const handleToggleLogin = () => {
    setIsLogin((prev) => !prev);
  };

  const handleLogin = async () => {
    setIsLoading(true);
    try {
      await login(email, password);
    } catch (error) {
      // Error handled by Toast in AuthContext
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegistration = async () => {
    setIsLoading(true);
    try {
      await register(email, password, password2);
    } catch (error) {
      // Error handled by Toast in AuthContext
    } finally {
      setIsLoading(false);
    }
  };

  const isFormValid = () => {
    if (!email || !password) {
      Toast.show({
        type: 'error',
        text1: 'Invalid Email',
        text2: 'Please enter a valid email address.',
      });
      return false;
    }
    if (!isLogin && (!password2 || password !== password2)) {
      Toast.show({
        type: 'error',
        text1: 'Passwords Do Not Match',
        text2: 'Please make sure both passwords match.',
      });
      return false;
    }
    if (password.length < 8) {
      Toast.show({
        type: 'error',
        text1: 'Password Too Short',
        text2: 'Password must be at least 8 characters.',
      });
      return false;
    }
    return true;
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View>
        {/* Your authentication form goes here */}
        <Text>{isLogin ? 'Sign In' : 'Sign Up For A New Account'}</Text>
        <TextInput
          label='Email'
          autoCapitalize='none'
          keyboardType='email-address'
          placeholder='Enter your email'
          value={email}
          onChangeText={setEmail}
          mode='outlined'
        />

        <TextInput
          label='Password'
          autoCapitalize='none'
          secureTextEntry
          value={password}
          onChangeText={setPassword}
          mode='outlined'
        />
        {!isLogin ? (
          <TextInput
            label='Password Confirmation'
            autoCapitalize='none'
            secureTextEntry
            value={password2}
            onChangeText={setPassword2}
            mode='outlined'
          />
        ) : null}
        <Button
          mode='contained'
          disabled={isLoading}
          onPress={
            isLogin
              ? () => {
                  if (isFormValid()) handleLogin();
                }
              : () => {
                  if (isFormValid()) handleRegistration();
                }
          }
        >
          {isLogin ? 'Login' : 'Sign Up'}
        </Button>
        {isLoading && <ActivityIndicator size='large' />}

        <Button mode='text' onPress={handleToggleLogin}>
          {!isLogin
            ? 'Already have an account? click here to login'
            : ' Dont have an account? sign up here'}
        </Button>
        {/* Add your form components, buttons, etc. */}
      </View>
    </KeyboardAvoidingView>
  );
}
