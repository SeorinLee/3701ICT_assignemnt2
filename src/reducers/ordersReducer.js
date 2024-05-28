
// src/reducers/ordersReducer.js

const initialState = {
  newOrders: [],
  paidOrders: [],
  deliveredOrders: [],
};

const ordersReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'FETCH_ORDERS':
      const newOrders = action.payload.filter(order => !order.is_paid && !order.is_delivered);
      const paidOrders = action.payload.filter(order => order.is_paid && !order.is_delivered);
      const deliveredOrders = action.payload.filter(order => order.is_paid && order.is_delivered);
      return {
        ...state,
        newOrders,
        paidOrders,
        deliveredOrders,
      };
    case 'UPDATE_ORDER_STATUS':
      const { orderId, status } = action.payload;
      let updatedOrders;
      if (status.isPaid) {
        updatedOrders = state.newOrders.map(order => order.id === orderId ? { ...order, is_paid: 1 } : order);
        return {
          ...state,
          newOrders: updatedOrders.filter(order => !order.is_paid),
          paidOrders: [...state.paidOrders, ...updatedOrders.filter(order => order.is_paid && !order.is_delivered)],
        };
      } else if (status.isDelivered) {
        updatedOrders = state.paidOrders.map(order => order.id === orderId ? { ...order, is_delivered: 1 } : order);
        return {
          ...state,
          paidOrders: updatedOrders.filter(order => !order.is_delivered),
          deliveredOrders: [...state.deliveredOrders, ...updatedOrders.filter(order => order.is_delivered)],
        };
      }
      return state;
    default:
      return state;
  }
};

export default ordersReducer;
