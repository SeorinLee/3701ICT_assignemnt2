
//3701/assignmnet2/src/screens/SignUp.js
import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert, StyleSheet } from 'react-native';
import { signUp } from '../api/api';

const SignUp = ({ navigation }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSignUp = async () => {
    if (!name || !email || !password) {
      Alert.alert('Validation Error', 'All fields are required.');
      return;
    }

    try {
      const result = await signUp(name, email, password);
      if (result.status === 'OK') {
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
      <Button title="Sign Up" onPress={handleSignUp} />
      <Button title="Clear" onPress={clearFields} />
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

export default SignUp;