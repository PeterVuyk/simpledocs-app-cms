import { configureStore } from '@reduxjs/toolkit';
import notificationReducer from './slice/notificationSlice';

export const store = configureStore({
  reducer: {
    notification: notificationReducer,
  },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
