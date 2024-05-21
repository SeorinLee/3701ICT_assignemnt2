import React from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { incrementQuantity, decrementQuantity, removeFromCart } from '../store/actions';

const ShoppingCartScreen = () => {
  const cartItems = useSelector(state => state.user.cartItems || []);

  const dispatch = useDispatch();

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