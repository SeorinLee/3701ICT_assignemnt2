// 3701ICT/src/reducers/index.js
import { combineReducers } from 'redux';
import userReducer from './userReducer';

const rootReducer = combineReducers({
  user: userReducer,
  // 다른 reducer들이 있다면 여기에 추가
});

export default rootReducer;
