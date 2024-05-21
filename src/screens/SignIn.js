import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, Alert, StyleSheet, TouchableOpacity } from 'react-native';
import { signIn } from '../api/api';
import { useDispatch } from 'react-redux';
import { signIn as signInAction } from '../store/actions';
import { useRoute, useNavigation } from '@react-navigation/native';

const SignInScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useDispatch();

  useEffect(() => {
    if (route.params) {
      setEmail(route.params.email || '');
      setPassword(route.params.password || '');
    }
  }, [route.params]);

  const handleSignIn = async () => {
    if (!email || !password) {
      Alert.alert('Validation Error', 'Email and password are required');
      return;
    }
    const result = await signIn(email, password);
    if (result.status === 'OK') {
      dispatch(signInAction({ name: result.name, email: result.email }));
      navigation.replace('UserProfile', {
        token: result.token,
        user: {
          name: result.name,
          email: result.email,
        },
      });
    } else {
      Alert.alert('Login Failed', result.message || 'Unknown error');
    }
  };

  return (
    <View style={styles.container}>
      <Text>Sign in with your email and password</Text>
      <TextInput placeholder="Email" value={email} onChangeText={setEmail} autoCapitalize="none" />
      <TextInput placeholder="Password" value={password} onChangeText={setPassword} secureTextEntry />
      <Button title="Sign In" onPress={handleSignIn} />
      <Button title="Clear" onPress={() => { setEmail(''); setPassword(''); }} />
      <TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
        <Text style={styles.linkText}>Don't have an account? Sign up</Text>
      </TouchableOpacity>
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
  linkText: {
    color: 'blue',
    marginTop: 20,
  },
});

export default SignInScreen;
