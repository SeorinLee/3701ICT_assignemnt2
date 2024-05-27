// 3701/assignmnet2/src/screens/UserProfileStack.js
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SignIn from '../screens/SignIn';
import SignUp from '../screens/SignUp';
import UserProfile from '../screens/UserProfile';

const Stack = createNativeStackNavigator();

function UserProfileStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="MainUserProfile" component={UserProfile} />
      <Stack.Screen name="SignIn" component={SignIn} />
      <Stack.Screen name="SignUp" component={SignUp} />
    </Stack.Navigator>
  );
}

export default UserProfileStack;
