// 3701/assignmnet2/src/screens/UserProfileStack.js
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SignIn from '../screens/SignIn';
import SignUp from '../screens/SignUp';
import UserProfile from '../screens/UserProfile';
import ProfileHeader from '../Header/ProfileHeader';


const Stack = createNativeStackNavigator();

function UserProfileStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
       name="MainUserProfile"
       component={UserProfile} 
       options={{ header: ProfileHeader }} 
       />
      <Stack.Screen
       name="SignIn" 
       component={SignIn} 
       options={{ headerShown: false }}
       />
      <Stack.Screen
       name="SignUp" 
       component={SignUp} 
       options={{ headerShown: false }}
       />
    </Stack.Navigator>
  );
}

export default UserProfileStack;