//3701/assignmnet2/src/screens/SignIn.js

import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, Alert, StyleSheet } from 'react-native';
import { useDispatch } from 'react-redux';
import { signIn, loadCartItems } from '../store/actions';
import { signIn as signInAPI } from '../api/api';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SignIn = ({ route, navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useDispatch();

  useEffect(() => {
    if (route.params) {
      setEmail(route.params.email);
      setPassword(route.params.password);
    }
  }, [route.params]);

  const handleSignIn = async () => {
    if (!email || !password) {
      Alert.alert('Validation Error', 'Email and password are required');
      return;
    }
    try {
      const result = await signInAPI(email, password);
      if (result.status === 'OK') {
        // 토큰을 AsyncStorage에 저장
        await AsyncStorage.setItem('userToken', result.token);

        const cartItems = await AsyncStorage.getItem(`cart_${email}`);
        if (cartItems) {
          dispatch(loadCartItems(JSON.parse(cartItems)));
        }
        dispatch(signIn({ name: result.name, email: result.email }));
        navigation.replace('MainUserProfile', {
          token: result.token,
          user: {
            name: result.name,
            email: result.email,
          },
        });
      } else {
        Alert.alert('Login Failed', result.message || 'Wrong email or password');
      }
    } catch (error) {
      Alert.alert('Login Error', 'Unable to connect to the server. Please check your connection.');
    }
  };

  return (
    <View style={styles.container}>
      <Text>Sign in with your email and password</Text>
      <TextInput placeholder="Email" value={email} onChangeText={setEmail} autoCapitalize="none" />
      <TextInput placeholder="Password" value={password} onChangeText={setPassword} secureTextEntry />
      <Button title="Sign In" onPress={handleSignIn} />
      <Button title="Clear" onPress={() => { setEmail(''); setPassword(''); }} />
      <Text onPress={() => navigation.navigate('SignUp')}>Don't have an account? Sign up</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
});

export default SignIn;
