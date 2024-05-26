import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, Button, Alert, StyleSheet } from 'react-native';
import { updateUser } from '../api/api';

const UserProfile = ({ route, navigation }) => {
  const token = route.params?.token;
  const [user, setUser] = useState(route.params?.user || { name: '', email: '' });
  const [isEditing, setIsEditing] = useState(false);
  const [newName, setNewName] = useState(user?.name);
  const [newPassword, setNewPassword] = useState('');

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
      console.error('Update Profile Error:', error); // 에러 로그 추가
      Alert.alert('Network Error', 'Unable to connect to the server. Please try again later.');
    }
  };

  const handleCancel = () => {
    setNewName(user.name);
    setNewPassword('');
    setIsEditing(false);
  };

  const handleSignOut = () => {
    navigation.navigate('SignIn');
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
