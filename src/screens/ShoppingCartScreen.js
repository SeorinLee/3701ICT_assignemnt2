// 3701/assignmnet2/src/screens/ShoppingCartScreen.js

import React, { useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Image, Alert, Button } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { incrementQuantity, decrementQuantity, removeFromCart, loadCartItems, fetchOrders } from '../store/actions';
import { getCartItems as getCartItemsAPI, saveCartItems as saveCartItemsAPI, createOrderAPI, getOrders as getOrdersAPI } from '../api/api';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ShoppingCartScreen = () => {
  const cartItems = useSelector(state => state.user.cartItems || []);
  const token = useSelector(state => state.user.token); // Assuming the token is stored in the user state
  const dispatch = useDispatch();
  const navigation = useNavigation();

  useEffect(() => {
    if (token) {
      console.log('Fetching cart items with token:', token); // 디버깅용 로그
      getCartItemsAPI(token).then(response => {
        console.log('Cart items response:', response); // 디버깅용 로그
        if (response.status === 'OK') {
          dispatch(loadCartItems(response.items.map(item => ({
            id: item.id,
            price: item.price,
            quantity: item.count, // API에서 count로 불러오므로 quantity로 변환
          }))));
        } else {
          console.error('Error loading cart items:', response.message); // 디버깅용 로그
          Alert.alert('Error', 'Failed to load cart items.');
        }
      }).catch(error => {
        console.error('GetCartItems API Error:', error); // 디버깅용 로그
      });
    } else {
      navigation.navigate('SignIn');
    }
  }, [token]);

  useEffect(() => {
    if (token) {
      saveCartItemsAPI(token, cartItems.map(item => ({
        id: item.id,
        price: item.price,
        count: item.quantity, // 저장할 때는 quantity를 count로 변환
      }))).catch(error => {
        console.error('Error saving cart items:', error); // 디버깅용 로그
      });
    }
  }, [cartItems]);

  const handleIncrement = (id) => {
    dispatch(incrementQuantity(id));
  };

  const handleDecrement = (id) => {
    dispatch(decrementQuantity(id));
    const currentItem = cartItems.find(item => item.id === id);
    if (currentItem && currentItem.quantity === 1) {
      dispatch(removeFromCart(id));
    }
  };

  const handleCheckout = async () => {
    try {
      const storedToken = await AsyncStorage.getItem('userToken'); // 로컬 저장소에서 토큰 가져오기
      console.log('Token being used for checkout:', storedToken); // 토큰 확인용 로그
      const response = await createOrderAPI(storedToken, cartItems.map(item => ({
        prodID: item.id,
        price: item.price,
        quantity: item.quantity,
      })));
      console.log('CreateOrder Response:', response); // 응답 확인용 로그
      if (response.status === 'OK') {
        Alert.alert('Order Created', 'Your order has been placed successfully.');
        dispatch(loadCartItems([])); // Clear local cart state

        // 주문 상태를 업데이트하기 위해 새로고침
        const ordersResponse = await getOrdersAPI(storedToken);
        if (ordersResponse.status === 'OK') {
          dispatch(fetchOrders(ordersResponse.orders));
        }

        navigation.navigate('Order'); // Order 페이지로 이동
      } else {
        Alert.alert('Checkout Failed', response.message || 'Failed to create order.');
      }
    } catch (error) {
      console.error('Checkout Error:', error);
      Alert.alert('Network Error', 'Unable to connect to the server. Please try again later.');
    }
  };

  const renderCartItem = ({ item }) => (
    <View style={styles.itemContainer}>
      <Image source={{ uri: item.image }} style={styles.image} />
      <Text style={styles.itemText}>{item.title} - ${item.price}</Text>
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={() => handleDecrement(item.id)}>
          <Text>-</Text>
        </TouchableOpacity>
        <Text style={styles.quantity}>{item.quantity}</Text>
        <TouchableOpacity style={styles.button} onPress={() => handleIncrement(item.id)}>
          <Text>+</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const totalQuantity = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const totalPrice = cartItems.reduce((acc, item) => acc + (item.quantity * item.price), 0);

  return (
    <View style={styles.container}>
      {cartItems.length > 0 ? (
        <>
          <Text style={styles.total}>Total Items: {totalQuantity}, Total Price: ${totalPrice.toFixed(2)}</Text>
          <FlatList
            data={cartItems}
            renderItem={renderCartItem}
            keyExtractor={item => item.id.toString()}
          />
          <Button title="Check Out" onPress={handleCheckout} />
        </>
      ) : (
        <Text style={styles.emptyCart}>Your shopping cart is empty.</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc'
  },
  itemText: {
    flex: 1,
    fontSize: 16,
    marginHorizontal: 10,
  },
  image: {
    width: 50,
    height: 50,
  },
  buttonContainer: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  button: {
    marginHorizontal: 10,
    padding: 10,
    backgroundColor: '#ddd',
    borderRadius: 5
  },
  quantity: {
    fontSize: 16
  },
  total: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10
  },
  emptyCart: {
    fontSize: 18,
    fontStyle: 'italic'
  }
});

export default ShoppingCartScreen;

