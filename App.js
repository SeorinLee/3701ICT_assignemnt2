// 3701ICT/assignment2/App.js
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Provider } from 'react-redux';
import store from './src/store/store';
import Splash from './src/screens/Splash';
import BottomTabNavigator from './src/navigation/BottomTabNavigator';
import UserProfileStack from './src/stack/UserProfileStack'; // UserProfileStack import 추가

const Stack = createNativeStackNavigator();

const App = () => {
  return (
    <Provider store={store}>
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Splash" component={Splash} />
          <Stack.Screen name="Main" component={BottomTabNavigator} />
        </Stack.Navigator>
      </NavigationContainer>
    </Provider>
  );
};

export default App;






/*import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Provider } from 'react-redux';
import { Ionicons } from '@expo/vector-icons';
import store from './src/store/store';
import Splash from './src/screens/Splash';
import Category from './src/screens/Category';
import ProductList from './src/screens/ProductList';
import ProductDetail from './src/screens/ProductDetail';
import ShoppingCartScreen from './src/screens/ShoppingCartScreen';
import CategoryHeader from './src/Header/CategoryHeader';
import ProductListHeader from './src/Header/ProductListHeader';
import ProductDetailHeader from './src/Header/ProductDetailHeader';
//import BottomTabNavigator from './src/screens/BottomTabNavigator';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

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
    </Stack.Navigator>
  );
}

function BottomTabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false, // 모든 탭에서 헤더를 숨김
        //tabBarShowLabel: false // 모든 탭에서 레이블을 숨김
      }}
    >
  <Tab.Screen 
        name="Home" 
        component={CategoryStack}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home-outline" size={size} color={color} />
          )
        }}
      />
      <Tab.Screen 
        name="Cart" 
        component={ShoppingCartScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="cart-outline" size={size} color={color} />
          )
        }}
      />
    </Tab.Navigator>
  );
}

export default function App() {
  return (
    <Provider store={store}>
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Splash" component={Splash} />
          <Stack.Screen name="Category" component={BottomTabNavigator} />
        </Stack.Navigator>
      </NavigationContainer>
    </Provider>
  );
}*/
