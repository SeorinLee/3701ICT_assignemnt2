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
  FETCH_ORDERS,
  UPDATE_ORDER_STATUS,
} from '../store/actions';

const initialState = {
  isLoggedIn: false,
  user: null,
  token: null, // 토큰 추가
  cartItems: [],
  orders: {
    newOrders: [],
    paidOrders: [],
    deliveredOrders: [],
  },
};

const userReducer = (state = initialState, action) => {
  switch (action.type) {
    case SIGN_IN:
    case SIGN_UP:
      return {
        ...state,
        isLoggedIn: true,
        user: action.payload.user,
        token: action.payload.token, // 토큰 저장
      };
    case SIGN_OUT:
      return {
        ...state,
        isLoggedIn: false,
        user: null,
        token: null, // 토큰 제거
        cartItems: [],
        orders: {
          newOrders: [],
          paidOrders: [],
          deliveredOrders: [],
        },
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
    case FETCH_ORDERS:
      const newOrders = action.payload.filter(order => !order.is_paid && !order.is_delivered);
      const paidOrders = action.payload.filter(order => order.is_paid && !order.is_delivered);
      const deliveredOrders = action.payload.filter(order => order.is_paid && order.is_delivered);
      return {
        ...state,
        orders: {
          newOrders,
          paidOrders,
          deliveredOrders,
        },
      };
    case UPDATE_ORDER_STATUS:
      const { orderId, status } = action.payload;
      let updatedOrders;
      if (status.isPaid) {
        updatedOrders = state.orders.newOrders.map(order => order.id === orderId ? { ...order, is_paid: 1 } : order);
        return {
          ...state,
          orders: {
            newOrders: updatedOrders.filter(order => !order.is_paid),
            paidOrders: [...state.orders.paidOrders, ...updatedOrders.filter(order => order.is_paid && !order.is_delivered)],
            deliveredOrders: state.orders.deliveredOrders,
          },
        };
      } else if (status.isDelivered) {
        updatedOrders = state.orders.paidOrders.map(order => order.id === orderId ? { ...order, is_delivered: 1 } : order);
        return {
          ...state,
          orders: {
            newOrders: state.orders.newOrders,
            paidOrders: updatedOrders.filter(order => !order.is_delivered),
            deliveredOrders: [...state.orders.deliveredOrders, ...updatedOrders.filter(order => order.is_delivered)],
          },
        };
      }
      return state;
    default:
      return state;
  }
};

export default userReducer;
