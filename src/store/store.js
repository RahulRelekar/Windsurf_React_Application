import { createStore, applyMiddleware, combineReducers } from 'redux';
import { thunk } from 'redux-thunk';
import { composeWithDevTools } from '@redux-devtools/extension';

// Import reducers here
import authReducer from '../reducers/authReducer';
import { roleListReducer, roleCreateReducer, roleUpdateReducer, roleDeleteReducer } from '../reducers/roleReducers';
import { userListReducer, userCreateReducer, userUpdateReducer, userDeleteReducer } from '../reducers/userReducers';

const rootReducer = combineReducers({
  auth: authReducer,
  roleList: roleListReducer,
  roleCreate: roleCreateReducer,
  roleUpdate: roleUpdateReducer,
  roleDelete: roleDeleteReducer,
  userList: userListReducer,
  userCreate: userCreateReducer,
  userUpdate: userUpdateReducer,
  userDelete: userDeleteReducer,
});

const middleware = [thunk];

const store = createStore(
  rootReducer,
  composeWithDevTools(applyMiddleware(...middleware))
);

export default store;
