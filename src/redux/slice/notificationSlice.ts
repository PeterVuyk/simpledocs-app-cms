import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AlertColor } from '@mui/material/Alert/Alert';

interface NotificationState {
  notificationOpen: boolean;
  notificationType: AlertColor;
  notificationMessage: string;
}

const initialState: NotificationState = {
  notificationOpen: false,
  notificationType: 'success',
  notificationMessage: '',
};

const notificationSlice = createSlice({
  name: 'notification',
  initialState,
  reducers: {
    notify(state, action: PayloadAction<NotificationState>) {
      // it's okey to do this because immer makes it immutable under the hood
      state.notificationOpen = action.payload.notificationOpen;
      state.notificationType = action.payload.notificationType;
      state.notificationMessage = action.payload.notificationMessage;
    },
  },
});

export const { notify } = notificationSlice.actions;
export default notificationSlice.reducer;
