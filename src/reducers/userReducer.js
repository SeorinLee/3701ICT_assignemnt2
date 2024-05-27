// src/reducers/userReducer.js
import {
  SIGN_IN,
  SIGN_OUT,
  SIGN_UP,
  ADD_TO_CART,
  INCREMENT_QUANTITY,
  DECREMENT_QUANTITY,
  REMOVE_FROM_CART,
  LOAD_CART_ITEMS,
} from '../store/actions';

const initialState = {
  isLoggedIn: false,
  user: null,
  cartItems: [],
};

const userReducer = (state = initialState, action) => {
  switch (action.type) {
    case SIGN_IN:
    case SIGN_UP:
      return {
        ...state,
        isLoggedIn: true,
        user: action.payload,
      };
    case SIGN_OUT:
      return {
        ...state,
        isLoggedIn: false,
        user: null,
        cartItems: [],
      };
    case ADD_TO_CART:
      const existingItem = state.cartItems.find((item) => item.id === action.payload.id);
      let updatedCartItems;
      if (existingItem) {
        updatedCartItems = state.cartItems.map((item) =>
          item.id === action.payload.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      } else {
        updatedCartItems = [...state.cartItems, { ...action.payload, quantity: 1 }];
      }
      return {
        ...state,
        cartItems: updatedCartItems,
      };
    case INCREMENT_QUANTITY:
      const incrementedCartItems = state.cartItems.map((item) =>
        item.id === action.payload ? { ...item, quantity: item.quantity + 1 } : item
      );
      return {
        ...state,
        cartItems: incrementedCartItems,
      };
    case DECREMENT_QUANTITY:
      const decrementedCartItems = state.cartItems
        .map((item) =>
          item.id === action.payload && item.quantity > 1 ? { ...item, quantity: item.quantity - 1 } : item
        )
        .filter((item) => item.quantity > 0);
      return {
        ...state,
        cartItems: decrementedCartItems,
      };
    case REMOVE_FROM_CART:
      const filteredCartItems = state.cartItems.filter((item) => item.id !== action.payload);
      return {
        ...state,
        cartItems: filteredCartItems,
      };
    case LOAD_CART_ITEMS:
      return {
        ...state,
        cartItems: action.payload,
      };
    default:
      return state;
  }
};

export default userReducer;
