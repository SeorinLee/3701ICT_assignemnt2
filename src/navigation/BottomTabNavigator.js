import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { useSelector } from 'react-redux';
import CategoryStack from '../screens/CategoryStack';
import ShoppingCartScreen from '../screens/ShoppingCartScreen';

const Tab = createBottomTabNavigator();

function BottomTabNavigator() {
  // Redux 상태에서 총 아이템 수를 가져옵니다.
  const cartItemCount = useSelector(state => state.cart.items.reduce((sum, item) => sum + item.quantity, 0));

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Tab.Screen 
        name="Home" 
        component={CategoryStack}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home-outline" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen 
        name="Cart" 
        component={ShoppingCartScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="cart-outline" size={size} color={color} />
          ),
          tabBarBadge: cartItemCount > 0 ? cartItemCount : null, // 아이템이 있을 때만 배지를 표시
        }}
      />
    </Tab.Navigator>
  );
}

export default BottomTabNavigator;
