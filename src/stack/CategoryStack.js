// 3701/assignmnet2/src/screens/CategoryStack.js
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Category from '../screens/Category';
import ProductList from '../screens/ProductList';
import ProductDetail from '../screens/ProductDetail';
import CategoryHeader from '../Header/CategoryHeader';
import ProductListHeader from '../Header/ProductListHeader';
import ProductDetailHeader from '../Header/ProductDetailHeader';
import UserProfile from '../screens/UserProfile';
import SignIn from '../screens/SignIn';


const Stack = createNativeStackNavigator();

function CategoryStack() {
  return (
    <Stack.Navigator>
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
      <Stack.Screen
        name="UserProfile"
        component={UserProfile}
      />
      <Stack.Screen
        name="SignIn"
        component={SignIn}
      />
    </Stack.Navigator>
  );
}

export default CategoryStack;