// src/store/store.js

import { createStore, combineReducers } from 'redux';
import userReducer from '../reducers/userReducer';
import cartReducer from '../reducers/cartReducer';
import ordersReducer from '../reducers/ordersReducer';

const rootReducer = combineReducers({
  user: userReducer,
  cart: cartReducer,
});

const store = createStore(rootReducer);

export default store;
