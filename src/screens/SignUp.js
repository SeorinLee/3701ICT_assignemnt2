
//3701/assignmnet2/src/screens/SignUp.js

// 3701/assignment2/src/screens/SignUp.js
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet } from 'react-native';
import { useDispatch } from 'react-redux';
import { Ionicons } from '@expo/vector-icons';
import { signUp, loadCartItems, fetchOrders } from '../store/actions';
import { signUp as signUpAPI, getCartItems as getCartItemsAPI, getOrders as getOrdersAPI } from '../api/api';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SignUp = ({ navigation }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useDispatch();

  const handleSignUp = async () => {
    if (!name || !email || !password) {
      Alert.alert('Validation Error', 'All fields are required.');
      return;
    }

    try {
      const result = await signUpAPI(name, email, password);
      if (result.status === 'OK') {
        await AsyncStorage.setItem('userToken', result.token);

        const localCartItems = await AsyncStorage.getItem(`cart_${email}`);
        if (localCartItems) {
          dispatch(loadCartItems(JSON.parse(localCartItems)));
        }

        const cartResponse = await getCartItemsAPI(result.token);
        if (cartResponse.status === 'OK') {
          dispatch(loadCartItems(cartResponse.items.map(item => ({
            id: item.id,
            price: item.price,
            quantity: item.count,
          }))));
        } else {
          console.error('Failed to load cart items:', cartResponse.message);
        }

        const ordersResponse = await getOrdersAPI(result.token);
        if (ordersResponse.status === 'OK') {
          dispatch(fetchOrders(ordersResponse.orders));
        } else {
          console.error('Failed to load orders:', ordersResponse.message);
        }

        dispatch(signUp({ name: result.name, email: result.email, token: result.token }));
        navigation.replace('MainUserProfile', {
          token: result.token,
          user: {
            name: result.name,
            email: result.email,
          },
        });
      } else {
        Alert.alert('Signup Failed', result.message || 'An unknown error occurred');
      }
    } catch (error) {
      Alert.alert('Network Error', 'Unable to connect to the server. Please try again later.');
    }
  };

  const clearFields = () => {
    setName('');
    setEmail('');
    setPassword('');
  };

  return (
    <View style={styles.container}>
      <Text>Sign up a new user</Text>
      <TextInput placeholder="Name" value={name} onChangeText={setName} style={styles.input} />
      <TextInput placeholder="Email" value={email} onChangeText={setEmail} autoCapitalize="none" style={styles.input} />
      <TextInput placeholder="Password" value={password} onChangeText={setPassword} secureTextEntry style={styles.input} />
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={handleSignUp}>
          <Ionicons name="add" size={20} color="white" />
          <Text style={styles.buttonText}>Sign Up</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={clearFields}>
          <Ionicons name="close-circle" size={20} color="white" />
          <Text style={styles.buttonText}>Clear</Text>
        </TouchableOpacity>
      </View>
      <Text onPress={() => navigation.navigate('SignIn')}>Switch to: sign in</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#EEE3CB', // 배경 색상 추가
  },
  input: {
    width: '80%',
    padding: 10,
    margin: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
  },
  buttonContainer: {
    flexDirection: 'row', // 버튼을 가로로 배치
    marginTop: 20,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#967E76',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
    marginHorizontal: 10, // 버튼 사이의 간격
  },
  buttonText: {
    color: 'white',
    marginLeft: 10, // 아이콘과 텍스트 사이의 간격
  },
});

export default SignUp;
