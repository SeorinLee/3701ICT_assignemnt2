// 3701/assignmnet2/src/screens/Order.js
import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList, Alert } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { fetchOrders, updateOrderStatus } from '../store/actions';
import { getOrders as getOrdersAPI, updateOrder as updateOrderAPI } from '../api/api';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Order = () => {
  const [expandedSection, setExpandedSection] = useState(null);
  const orders = useSelector(state => state.orders);
  const token = useSelector(state => state.user.token);
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchOrdersFromAPI = async () => {
      const storedToken = await AsyncStorage.getItem('userToken'); // 로컬 저장소에서 토큰 가져오기
      if (storedToken) {
        getOrdersAPI(storedToken).then(response => {
          if (response.status === 'OK') {
            dispatch(fetchOrders(response.orders));
          } else {
            Alert.alert('Error', 'Failed to load orders.');
          }
        }).catch(error => {
          console.error('GetOrders API Error:', error);
        });
      }
    };

    fetchOrdersFromAPI();
  }, [dispatch]);

  const handleToggleSection = (section) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  const handleToggleOrder = (orderId, status) => {
    const updateOrderStatusAPI = async () => {
      const storedToken = await AsyncStorage.getItem('userToken'); // 로컬 저장소에서 토큰 가져오기
      updateOrderAPI(storedToken, orderId, status).then(response => {
        if (response.status === 'OK') {
          dispatch(updateOrderStatus(orderId, status));
          Alert.alert('Success', `Your order is now ${status.isPaid ? 'paid' : 'delivered'}`);
        } else {
          Alert.alert('Error', 'Failed to update order status.');
        }
      }).catch(error => {
        console.error('UpdateOrder API Error:', error);
      });
    };

    updateOrderStatusAPI();
  };

  const renderOrder = ({ item }) => (
    <View style={styles.orderContainer}>
      <Text>Order ID: {item.id}</Text>
      <Text>Number of Items: {item.item_numbers}</Text>
      <Text>Total Price: ${item.total_price.toFixed(2)}</Text>
      <TouchableOpacity onPress={() => handleToggleOrder(item.id, { isPaid: !item.is_paid })}>
        <Text>{item.is_paid ? 'Paid' : 'Pay'}</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => handleToggleOrder(item.id, { isDelivered: !item.is_delivered })}>
        <Text>{item.is_delivered ? 'Delivered' : 'Receive'}</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => handleToggleSection('newOrders')}>
        <Text>New Orders ({orders.newOrders.length})</Text>
      </TouchableOpacity>
      {expandedSection === 'newOrders' && (
        <FlatList
          data={orders.newOrders}
          renderItem={renderOrder}
          keyExtractor={item => item.id.toString()}
        />
      )}

      <TouchableOpacity onPress={() => handleToggleSection('paidOrders')}>
        <Text>Paid Orders ({orders.paidOrders.length})</Text>
      </TouchableOpacity>
      {expandedSection === 'paidOrders' && (
        <FlatList
          data={orders.paidOrders}
          renderItem={renderOrder}
          keyExtractor={item => item.id.toString()}
        />
      )}

      <TouchableOpacity onPress={() => handleToggleSection('deliveredOrders')}>
        <Text>Delivered Orders ({orders.deliveredOrders.length})</Text>
      </TouchableOpacity>
      {expandedSection === 'deliveredOrders' && (
        <FlatList
          data={orders.deliveredOrders}
          renderItem={renderOrder}
          keyExtractor={item => item.id.toString()}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  orderContainer: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
});

export default Order;

