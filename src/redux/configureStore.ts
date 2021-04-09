import { createStore, combineReducers } from 'redux';
import notificationReducer from './reducers/notificationReducer';

const rootReducer = combineReducers({
  notification: notificationReducer,
});

const configureStore = () => createStore(rootReducer);

export default configureStore;
