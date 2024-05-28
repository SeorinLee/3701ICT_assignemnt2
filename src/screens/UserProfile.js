//3701/assignmnet2/src/screens/UserProfile.js
// 3701/assignmnet2/src/screens/UserProfile.js
import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, Button, Alert, StyleSheet } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
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
      if (cartItems && cartItems.length > 0) {
        await AsyncStorage.setItem(`cart_${user.email}`, JSON.stringify(cartItems));
      } else {
        await AsyncStorage.removeItem(`cart_${user.email}`);
      }

      if (orders && Object.keys(orders).length > 0) {
        await AsyncStorage.setItem(`orders_${user.email}`, JSON.stringify(orders));
      } else {
        await AsyncStorage.removeItem(`orders_${user.email}`);
      }

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
          <Button title="Confirm" onPress={handleUpdate} />
          <Button title="Cancel" onPress={handleCancel} />
        </>
      ) : (
        <>
          <Text>Name: {user.name}</Text>
          <Text>Email: {user.email}</Text>
          <Button title="Update" onPress={() => setIsEditing(true)} />
          <Button title="Sign Out" onPress={handleSignOut} />
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
  },
  input: {
    width: '80%',
    padding: 10,
    margin: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
  },
});

export default UserProfile;
