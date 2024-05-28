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
      if (Array.isArray(action.payload)) {
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
      } else {
        return {
          ...state,
          orders: {
            newOrders: action.payload.newOrders || [],
            paidOrders: action.payload.paidOrders || [],
            deliveredOrders: action.payload.deliveredOrders || [],
          },
        };
      }
    case UPDATE_ORDER_STATUS:
      const { orderId, status } = action.payload;
      let updatedNewOrders = state.orders.newOrders;
      let updatedPaidOrders = state.orders.paidOrders;
      let updatedDeliveredOrders = state.orders.deliveredOrders;

      if (status.isPaid) {
        const updatedOrder = state.orders.newOrders.find(order => order.id === orderId);
        updatedNewOrders = state.orders.newOrders.filter(order => order.id !== orderId);
        updatedPaidOrders = [...state.orders.paidOrders, { ...updatedOrder, is_paid: 1 }];
      } else if (status.isDelivered) {
        const updatedOrder = state.orders.paidOrders.find(order => order.id === orderId);
        updatedPaidOrders = state.orders.paidOrders.filter(order => order.id !== orderId);
        updatedDeliveredOrders = [...state.orders.deliveredOrders, { ...updatedOrder, is_delivered: 1 }];
      }

      return {
        ...state,
        orders: {
          newOrders: updatedNewOrders,
          paidOrders: updatedPaidOrders,
          deliveredOrders: updatedDeliveredOrders,
        },
      };
    default:
      return state;
  }
};

export default userReducer;
