// 3701/assignmnet2/src/screens/SignIn.js

import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, Alert, StyleSheet } from 'react-native';
import { useDispatch } from 'react-redux';
import { signIn, loadCartItems, fetchOrders } from '../store/actions';
import { signIn as signInAPI, getOrders as getOrdersAPI } from '../api/api';
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
        const cartItems = await AsyncStorage.getItem(`cart_${email}`);
        if (cartItems) {
          dispatch(loadCartItems(JSON.parse(cartItems)));
        }
        dispatch(signIn({ name: result.name, email: result.email }, result.token));

        const ordersResponse = await getOrdersAPI(result.token);
        if (ordersResponse.status === 'OK') {
          const savedOrders = await AsyncStorage.getItem(`orders_${email}`);
          if (savedOrders) {
            const parsedSavedOrders = JSON.parse(savedOrders);
            const allOrders = {
              newOrders: [...ordersResponse.orders.filter(order => !order.is_paid && !order.is_delivered)],
              paidOrders: [...ordersResponse.orders.filter(order => order.is_paid && !order.is_delivered)],
              deliveredOrders: [...parsedSavedOrders.deliveredOrders],
            };
            dispatch(fetchOrders(allOrders));
          } else {
            dispatch(fetchOrders({
              newOrders: [...ordersResponse.orders.filter(order => !order.is_paid && !order.is_delivered)],
              paidOrders: [...ordersResponse.orders.filter(order => order.is_paid && !order.is_delivered)],
              deliveredOrders: [],
            }));
          }
        } else {
          Alert.alert('Error', 'Failed to load orders.');
        }

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
      console.error('Login Error:', error);
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
