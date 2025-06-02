import { useState } from 'react';
import { KeyboardAvoidingView, Platform, View } from 'react-native';
import { Button, Text, TextInput } from 'react-native-paper';

export default function AuthScreen() {
  const [isSignUp, setIsSignUp] = useState<boolean>(false);

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View>
        {/* Your authentication form goes here */}
        <Text>{isSignUp ? 'Sign In' : 'Sign Up For A New Account'}</Text>
        <TextInput
          label='Email'
          autoCapitalize='none'
          keyboardType='email-address'
          placeholder='Enter your email'
          mode='outlined'
        />

        <TextInput
          label='Password'
          autoCapitalize='none'
          secureTextEntry
          mode='outlined'
        />
        {!isSignUp ? (
          <TextInput
            label='Password Confirmation'
            autoCapitalize='none'
            secureTextEntry
            mode='outlined'
          />
        ) : null}
        <Button mode='contained'>{isSignUp ? 'Login' : 'Sign Up'}</Button>
        <Button mode='text'>
          {!isSignUp
            ? 'Already have an account? click here to login'
            : ' Dont have an account? sign up here'}
        </Button>
        {/* Add your form components, buttons, etc. */}
      </View>
    </KeyboardAvoidingView>
  );
}
