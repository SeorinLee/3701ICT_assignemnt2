import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Order from '../screens/Order';
import OrderHeader from '../Header/OrderHeader';  // 헤더 컴포넌트 경로가 맞는지 확인하세요

const Stack = createNativeStackNavigator();

const OrderStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Order"
        component={Order}
        options={{ header: OrderHeader }}
      />
    </Stack.Navigator>
  );
};

export default OrderStack;
