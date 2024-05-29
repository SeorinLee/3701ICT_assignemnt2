// 3701/assignmnet2/src/screens/ShoppingCartScreen.js
import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Image, Alert, Button } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { Ionicons } from '@expo/vector-icons';
import { incrementQuantity, decrementQuantity, removeFromCart, loadCartItems, fetchOrders } from '../store/actions';
import { getCartItems as getCartItemsAPI, saveCartItems as saveCartItemsAPI, createOrderAPI, getOrders as getOrdersAPI, refreshToken as refreshTokenAPI, fetchProductDetails } from '../api/api';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ShoppingCartScreen = () => {
  const cartItems = useSelector(state => state.user.cartItems || []);
  const token = useSelector(state => state.user.token); // Assuming the token is stored in the user state
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const [productDetails, setProductDetails] = useState({});

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
          loadProductDetails(response.items.map(item => item.id)); // 제품 디테일 불러오기
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

  const loadProductDetails = async (itemIds) => {
    try {
      const details = {};
      for (const id of itemIds) {
        const detail = await fetchProductDetails(id);
        details[id] = detail;
      }
      setProductDetails(details);
    } catch (error) {
      console.error('Error loading product details:', error);
    }
  };

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
      let storedToken = await AsyncStorage.getItem('userToken'); // 로컬 저장소에서 토큰 가져오기
      console.log('Token being used for checkout:', storedToken); // 토큰 확인용 로그

      // 토큰 유효성 검증 및 재발급
      const tokenValidity = await checkTokenValidity(storedToken); // 토큰 유효성 확인 함수
      if (!tokenValidity) {
        storedToken = await refreshTokenAPI(); // 토큰 재발급
        await AsyncStorage.setItem('userToken', storedToken);
        console.log('New token:', storedToken);
      }

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

  const checkTokenValidity = async (token) => {
    // 여기에 토큰 유효성 검증 로직 추가 (예: 만료 시간 확인)
    // 유효하지 않으면 false 반환
    // 유효하면 true 반환
    return true; // 임시로 항상 true 반환
  };

  const renderCartItem = ({ item }) => {
    const productDetail = productDetails[item.id];
    return (
      <View style={styles.itemContainer}>
        {productDetail && (
          <Image source={{ uri: productDetail.image }} style={styles.image} />
        )}
        <Text style={styles.itemText}>{productDetail ? productDetail.title : 'Loading...'} - ${item.price}</Text>
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
  };

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
          <TouchableOpacity style={styles.checkoutButton} onPress={handleCheckout}>
            <Ionicons name="wallet" size={20} color="white" />
            <Text style={styles.buttonText}>Check Out</Text>
          </TouchableOpacity>
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
    padding: 20,
    backgroundColor: '#EEE3CB', 
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
    backgroundColor: '#AF8F6F',
    borderRadius: 5
  },
  quantity: {
    fontSize: 16, 
    fontWeight: 'bold'
  },
  total: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10
  },
  emptyCart: {
    fontSize: 18,
    fontStyle: 'italic'
  },
  checkoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#967E76',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
    marginTop: 20,
  },
  buttonText: {
    color: 'white',
    marginLeft: 10,
  },
});

export default ShoppingCartScreen;


