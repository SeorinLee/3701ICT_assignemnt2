// src/store/actions.js
export const signIn = (user) => ({
  type: 'SIGN_IN',
  payload: { user },
});

export const signOut = () => ({
  type: 'SIGN_OUT',
  payload: { user },
});

export const addToCart = (product) => ({
  type: 'ADD_TO_CART',
  payload: product
});

export const incrementQuantity = (id) => ({
  type: 'INCREMENT_QUANTITY',
  payload: id
});

export const decrementQuantity = (id) => ({
  type: 'DECREMENT_QUANTITY',
  payload: id
});

export const removeFromCart = (id) => ({
  type: 'REMOVE_FROM_CART',
  payload: id
});
