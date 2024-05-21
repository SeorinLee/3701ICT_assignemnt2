import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { useSelector } from 'react-redux';
import { Alert } from 'react-native';
import CategoryStack from '../stack/CategoryStack';
import ShoppingCartScreen from '../screens/ShoppingCartScreen';
import UserProfileStack from '../stack/UserProfileStack';
import Order from '../screens/Order';
import SignIn from '../screens/SignIn';

const Tab = createBottomTabNavigator();

function BottomTabNavigator() {
  const isLoggedIn = useSelector((state) => state.user.isLoggedIn);
  const cartItemCount = useSelector(state => state.user.cartItems.reduce((sum, item) => sum + item.quantity, 0));

  const requireAuth = (component, screenName) => {
    if (!isLoggedIn) {
      Alert.alert("NOT LOGGED IN", "You must log in to view this tab");
      return SignIn;
    }
    return component;
  };

  return (
    <Tab.Navigator screenOptions={{ headerShown: false }}>
      <Tab.Screen 
        name="Home" 
        component={requireAuth(CategoryStack, 'Home')}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home-outline" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen 
        name="Cart" 
        component={requireAuth(ShoppingCartScreen, 'Cart')}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="cart-outline" size={size} color={color} />
          ),
          tabBarBadge: cartItemCount > 0 ? cartItemCount : null,
        }}
      />
      <Tab.Screen 
        name="Order" 
        component={requireAuth(Order, 'Order')}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="list-outline" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen 
        name="UserProfile" 
        component={requireAuth(UserProfileStack, 'UserProfile')}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="person-circle-outline" size={size} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

export default BottomTabNavigator;
