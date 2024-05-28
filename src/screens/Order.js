// 3701/assignmnet2/src/screens/Order.js
import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList, Alert, Image, Button, ActivityIndicator } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { Ionicons } from '@expo/vector-icons';
import { fetchOrders, updateOrderStatus } from '../store/actions';
import { getOrders as getOrdersAPI, updateOrder as updateOrderAPI, fetchProductDetails } from '../api/api';

const Order = () => {
  const [expandedSection, setExpandedSection] = useState(null);
  const [expandedOrders, setExpandedOrders] = useState({});
  const [productDetails, setProductDetails] = useState({});
  const [loading, setLoading] = useState(false);
  const [loadingDetails, setLoadingDetails] = useState({});
  const orders = useSelector(state => state.user.orders);
  const token = useSelector(state => state.user.token); // 토큰 가져오는 부분
  const dispatch = useDispatch();

  useEffect(() => {
    if (token) {
      setLoading(true);
      getOrdersAPI(token).then(response => {
        setLoading(false);
        if (response.status === 'OK') {
          dispatch(fetchOrders(response.orders));
        } else {
          Alert.alert('Error', 'Failed to load orders.');
        }
      }).catch(error => {
        setLoading(false);
        console.error('GetOrders API Error:', error);
        Alert.alert('Error', 'Failed to load orders.');
      });
    }
  }, [token]);

  useEffect(() => {
    console.log('Orders state updated:', orders); // 상태 변화 확인용 로그 추가
  }, [orders]);

  const handleToggleSection = (section) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  const handleToggleOrder = async (orderId, items) => {
    setExpandedOrders({
      ...expandedOrders,
      [orderId]: !expandedOrders[orderId]
    });

    if (!expandedOrders[orderId]) {
      setLoadingDetails(prevLoadingDetails => ({
        ...prevLoadingDetails,
        [orderId]: true
      }));
      try {
        const productPromises = items.map(item => fetchProductDetails(item.prodID));
        const products = await Promise.all(productPromises);
        const productDetailsMap = products.reduce((acc, product) => {
          acc[product.id] = product;
          return acc;
        }, {});

        setProductDetails(prevDetails => ({
          ...prevDetails,
          ...productDetailsMap
        }));
      } catch (error) {
        console.error('Error fetching product details:', error);
        Alert.alert('Error', 'Failed to load product details.');
      } finally {
        setLoadingDetails(prevLoadingDetails => ({
          ...prevLoadingDetails,
          [orderId]: false
        }));
      }
    }
  };

  const handleUpdateOrder = async (orderId, status) => {
    console.log('Using token:', token); // 토큰 로그 추가
    console.log('Updating order with orderId:', orderId); // orderId 로그 추가
    console.log('Updating order with status:', status); // status 로그 추가

    const fullStatus = {
      ...status,
      isPaid: status.isPaid ?? false,
      isDelivered: status.isDelivered ?? false,
    };

    setLoading(true);
    try {
      const response = await updateOrderAPI(token, orderId, fullStatus);
      setLoading(false);
      if (response.status === 'OK') {
        dispatch(updateOrderStatus(orderId, fullStatus));
        Alert.alert('Success', `Your order is now ${status.isPaid ? 'paid' : 'delivered'}`);
      } else {
        Alert.alert('Error', `Failed to update order status: ${response.message}`);
      }
    } catch (error) {
      setLoading(false);
      console.error('UpdateOrder API Error:', error);
      Alert.alert('Error', 'Failed to update order status.');
    }
  };

  const renderOrderItem = (product) => {
    const productDetail = productDetails[product.prodID];
    if (!productDetail) return null;

    return (
      <View key={product.prodID} style={styles.productContainer}>
        <Image source={{ uri: productDetail.image }} style={styles.productImage} />
        <View style={styles.productDetails}>
          <Text>{productDetail.title}</Text>
          <Text>Quantity: {product.quantity}</Text>
          <Text>Price: ${product.price}</Text>
        </View>
      </View>
    );
  };

  const renderOrder = ({ item }) => (
    <View style={styles.orderContainer}>
      <TouchableOpacity onPress={() => handleToggleOrder(item.id, JSON.parse(item.order_items))}>
        <View style={styles.orderSummary}>
          <Text>Order ID: {item.id}</Text>
          <Text>Number of Items: {item.item_numbers}</Text>
          <Text>Total Price: ${item.total_price.toFixed(2)}</Text>
          <Ionicons
            name={expandedOrders[item.id] ? 'caret-up' : 'caret-down'}
            size={20}
            color="black"
          />
        </View>
      </TouchableOpacity>
      {expandedOrders[item.id] && (
        <View style={styles.orderDetails}>
          {loadingDetails[item.id] ? (
            <ActivityIndicator size="small" color="#0000ff" />
          ) : (
            JSON.parse(item.order_items).map(renderOrderItem)
          )}
          {item.is_paid ? (
            !item.is_delivered && (
              <Button
                title="Receive"
                onPress={() => handleUpdateOrder(item.id, { isDelivered: true })}
              />
            )
          ) : (
            <Button
              title="Pay"
              onPress={() => handleUpdateOrder(item.id, { isPaid: true })}
            />
          )}
        </View>
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <>
          <TouchableOpacity onPress={() => handleToggleSection('newOrders')}>
            <View style={styles.sectionHeader}>
              <Text>New Orders ({orders.newOrders.length})</Text>
              <Ionicons
                name={expandedSection === 'newOrders' ? 'caret-up' : 'caret-down'}
                size={20}
                color="black"
              />
            </View>
          </TouchableOpacity>
          {expandedSection === 'newOrders' && (
            <FlatList
              data={orders.newOrders}
              renderItem={renderOrder}
              keyExtractor={item => item.id.toString()}
            />
          )}

          <TouchableOpacity onPress={() => handleToggleSection('paidOrders')}>
            <View style={styles.sectionHeader}>
              <Text>Paid Orders ({orders.paidOrders.length})</Text>
              <Ionicons
                name={expandedSection === 'paidOrders' ? 'caret-up' : 'caret-down'}
                size={20}
                color="black"
              />
            </View>
          </TouchableOpacity>
          {expandedSection === 'paidOrders' && (
            <FlatList
              data={orders.paidOrders}
              renderItem={renderOrder}
              keyExtractor={item => item.id.toString()}
            />
          )}

          <TouchableOpacity onPress={() => handleToggleSection('deliveredOrders')}>
            <View style={styles.sectionHeader}>
              <Text>Delivered Orders ({orders.deliveredOrders.length})</Text>
              <Ionicons
                name={expandedSection === 'deliveredOrders' ? 'caret-up' : 'caret-down'}
                size={20}
                color="black"
              />
            </View>
          </TouchableOpacity>
          {expandedSection === 'deliveredOrders' && (
            <FlatList
              data={orders.deliveredOrders}
              renderItem={renderOrder}
              keyExtractor={item => item.id.toString()}
            />
          )}
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  orderContainer: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  orderSummary: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  orderDetails: {
    paddingVertical: 10,
  },
  productContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 5,
  },
  productImage: {
    width: 50,
    height: 50,
    marginRight: 10,
  },
  productDetails: {
    flex: 1,
  },
});

export default Order;
