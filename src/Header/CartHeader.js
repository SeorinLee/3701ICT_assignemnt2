// CategoryHeader.js
import React from 'react';
import { View, Text } from 'react-native';

const CategoryHeader = () => {
  return (
    <View style={{ backgroundColor: '#607274', height: 200, justifyContent: 'center', alignItems: 'center' }}>
      <Text style={{ fontSize: 50, fontWeight: 'bold', color: '#2a3738' }}>cart</Text>
    </View>
  );
};

export default CategoryHeader;
