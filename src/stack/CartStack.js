import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ShoppingCartScreen from '../screens/ShoppingCartScreen';
import CartHeader from '../Header/CartHeader';  // 헤더 컴포넌트 경로가 맞는지 확인하세요

const Stack = createNativeStackNavigator();

const CartStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Cart"
        component={ShoppingCartScreen}
        options={{ header: CartHeader }}
      />
    </Stack.Navigator>
  );
};

export default CartStack;
