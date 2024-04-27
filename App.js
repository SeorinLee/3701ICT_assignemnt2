// App.js
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Splash from './src/screens/Splash';
import Category from './src/screens/Category';
import ProductList from './src/screens/ProductList';
import ProductDetail from './src/screens/ProductDetail';
import CategoryHeader from './src/Header/CategoryHeader';
import ProductListHeader from './src/Header/ProductListHeader';
import ProductDetailHeader from './src/Header/ProductDetailHeader';


const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Splash"
          component={Splash}
          options={{ headerShown: false }} 
        />
        <Stack.Screen
          name="Category"
          component={Category}
          options={{ header: CategoryHeader }} 
        />
        <Stack.Screen
          name="ProductList"
          component={ProductList}
          options={{ header: ProductListHeader }} 
        />
        <Stack.Screen
          name="ProductDetail"
          component={ProductDetail}
          options={{ header: ProductDetailHeader }} 
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
