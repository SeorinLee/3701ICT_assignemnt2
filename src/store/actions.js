// src/store/actions.js
export const ADD_TO_CART = 'ADD_TO_CART';
export const INCREMENT_QUANTITY = 'INCREMENT_QUANTITY';
export const DECREMENT_QUANTITY = 'DECREMENT_QUANTITY';
export const REMOVE_FROM_CART = 'REMOVE_FROM_CART';
export const SIGN_IN = 'SIGN_IN';
export const SIGN_OUT = 'SIGN_OUT';
export const SIGN_UP = 'SIGN_UP';
export const LOAD_CART_ITEMS = 'LOAD_CART_ITEMS';
export const FETCH_ORDERS = 'FETCH_ORDERS';
export const UPDATE_ORDER_STATUS = 'UPDATE_ORDER_STATUS';

export const addToCart = (product) => ({
  type: ADD_TO_CART,
  payload: product,
});

export const incrementQuantity = (productId) => ({
  type: INCREMENT_QUANTITY,
  payload: productId,
});

export const decrementQuantity = (productId) => ({
  type: DECREMENT_QUANTITY,
  payload: productId,
});

export const removeFromCart = (productId) => ({
  type: REMOVE_FROM_CART,
  payload: productId,
});

export const signIn = (user) => ({
  type: SIGN_IN,
  payload: user,
});

export const signOut = () => ({
  type: SIGN_OUT,
});

export const signUp = (user) => ({
  type: SIGN_UP,
  payload: user,
});

export const loadCartItems = (items) => ({
  type: LOAD_CART_ITEMS,
  payload: items,
});

export const fetchOrders = (orders) => ({
  type: FETCH_ORDERS,
  payload: orders,
});

export const updateOrderStatus = (orderId, status) => ({
  type: UPDATE_ORDER_STATUS,
  payload: { orderId, status },
});