// src/store/store.js
import { createStore, combineReducers } from 'redux';
import cartReducer from '../reducers/userReducer';

const rootReducer = combineReducers({
  cart: cartReducer
});

const store = createStore(rootReducer);

export default store;

