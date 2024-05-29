// 3701/assignmnet2/src/screens/UserProfile.js
import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { Ionicons } from '@expo/vector-icons';
import { signOut as signOutAction } from '../store/actions';
import { saveCartItems as saveCartItemsAPI, updateUser } from '../api/api';
import AsyncStorage from '@react-native-async-storage/async-storage';

const UserProfile = ({ route, navigation }) => {
  const token = route.params?.token;
  const [user, setUser] = useState(route.params?.user || { name: '', email: '' });
  const [isEditing, setIsEditing] = useState(false);
  const [newName, setNewName] = useState(user?.name);
  const [newPassword, setNewPassword] = useState('');
  const dispatch = useDispatch();
  const cartItems = useSelector((state) => state.user.cartItems);
  const orders = useSelector((state) => state.user.orders);

  useEffect(() => {
    if (!token) {
      navigation.navigate('SignIn');
    }
  }, [token, navigation]);

  const handleUpdate = async () => {
    if (!newName || !newPassword) {
      Alert.alert('Error', 'Name and password cannot be empty.');
      return;
    }

    try {
      const response = await updateUser(newName, newPassword, token);
      if (response.status === 'OK') {
        Alert.alert('Success', 'Your profile has been updated successfully.');
        setUser({ ...user, name: newName, password: newPassword });
        setIsEditing(false);
      } else {
        Alert.alert('Update Failed', response.message || 'Failed to update profile.');
      }
    } catch (error) {
      console.error('Update Profile Error:', error);
      Alert.alert('Network Error', 'Unable to connect to the server. Please try again later.');
    }
  };

  const handleCancel = () => {
    setNewName(user.name);
    setNewPassword('');
    setIsEditing(false);
  };

  const handleSignOut = async () => {
    try {
      await AsyncStorage.setItem(`cart_${user.email}`, JSON.stringify(cartItems));
      await AsyncStorage.setItem(`orders_${user.email}`, JSON.stringify(orders));
      const response = await saveCartItemsAPI(token, cartItems.map(item => ({
        id: item.id,
        price: item.price,
        count: item.quantity,
      })));
      if (response.status === 'OK') {
        dispatch(signOutAction());
        navigation.reset({
          index: 0,
          routes: [{ name: 'SignIn' }],
        });
      } else {
        Alert.alert('Sign Out Failed', 'Failed to save cart items.');
      }
    } catch (error) {
      console.error('Error during sign out:', error);
      Alert.alert('Network Error', 'Unable to connect to the server. Please try again later.');
    }
  };

  return (
    <View style={styles.container}>
      <Text>User Profile Screen</Text>
      {isEditing ? (
        <>
          <TextInput
            placeholder="Name"
            value={newName}
            onChangeText={setNewName}
            style={styles.input}
          />
          <TextInput
            placeholder="New Password"
            value={newPassword}
            onChangeText={setNewPassword}
            secureTextEntry
            style={styles.input}
          />
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.button} onPress={handleUpdate}>
              <Ionicons name="checkmark" size={20} color="white" />
              <Text style={styles.buttonText}>Confirm</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={handleCancel}>
              <Ionicons name="close" size={20} color="white" />
              <Text style={styles.buttonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </>
      ) : (
        <>
          <Text>Name: {user.name}</Text>
          <Text>Email: {user.email}</Text>
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.button} onPress={() => setIsEditing(true)}>
              <Ionicons name="color-wand" size={20} color="white" />
              <Text style={styles.buttonText}>Update</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={handleSignOut}>
              <Ionicons name="log-out" size={20} color="white" />
              <Text style={styles.buttonText}>Sign Out</Text>
            </TouchableOpacity>
          </View>
        </>
      )}
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

export default UserProfile;

