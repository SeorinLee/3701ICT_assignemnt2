// CartHeader.js
import React from 'react';
import { View, Text } from 'react-native';

const CartHeader = () => {
  return (
    <View style={{ backgroundColor: '#607274', height: 100, justifyContent: 'center', alignItems: 'center' }}>
      <Text style={{ fontSize: 30, fontWeight: 'bold', color: '#2a3738' }}>My Cart</Text>
    </View>
  );
};

export default CartHeader;
