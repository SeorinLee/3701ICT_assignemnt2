import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { useSelector } from 'react-redux';
import { Alert } from 'react-native'; // Alert를 추가합니다
import CategoryStack from '../stack/CategoryStack';
import CartStack from '../stack/CartStack';
import UserProfileStack from '../stack/UserProfileStack';
import OrderStack from '../stack/OrderStack';

const Tab = createBottomTabNavigator();

function BottomTabNavigator() {
  const cartItems = useSelector(state => state.user.cartItems || []);
  const cartItemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  const orders = useSelector(state => state.user.orders);
  const newOrderCount = orders.newOrders ? orders.newOrders.length : 0;

  const token = useSelector(state => state.user.token); // 토큰 가져오기

  const handleTabPress = (screenName) => {
    if (!token) {
      Alert.alert('Not Logged In', 'Please sign in or sign up to access this screen.');
      return false; // Prevent navigation
    }
    return true; // Allow navigation
  };

  return (
    <Tab.Navigator screenOptions={{ headerShown: false }}>
      <Tab.Screen 
        name="Home" 
        component={CategoryStack}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home-outline" size={size} color={color} />
          ),
        }}
        listeners={{
          tabPress: e => {
            if (!handleTabPress('ShoppingCart')) {
              e.preventDefault();
            }
          },
        }}
        
      />
      <Tab.Screen 
        name="ShoppingCart" // 이름을 고유하게 변경
        component={CartStack}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="cart-outline" size={size} color={color} />
          ),
          tabBarBadge: cartItemCount > 0 ? cartItemCount : null,
        }}
        listeners={{
          tabPress: e => {
            if (!handleTabPress('ShoppingCart')) {
              e.preventDefault();
            }
          },
        }}
      />
      <Tab.Screen 
        name="OrderList" // 이름을 고유하게 변경
        component={OrderStack}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="list-outline" size={size} color={color} />
          ),
          tabBarBadge: newOrderCount > 0 ? newOrderCount : null,
        }}
        listeners={{
          tabPress: e => {
            if (!handleTabPress('OrderList')) {
              e.preventDefault();
            }
          },
        }}
      />
      <Tab.Screen 
        name="UserProfile" 
        component={UserProfileStack}
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
