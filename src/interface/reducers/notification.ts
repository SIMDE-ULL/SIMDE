import { type PayloadAction, createSlice } from "@reduxjs/toolkit";

export interface NotificationState {
  message: string | null;
}

const initialState: NotificationState = {
  message: null,
};

const notificationSlice = createSlice({
  name: "notification",
  initialState,
  reducers: {
    showNotification(state, action: PayloadAction<string>) {
      state.message = action.payload;
    },
    clearNotification(state) {
      state.message = null;
    },
  },
});

export const { showNotification, clearNotification } =
  notificationSlice.actions;
export const NotificationReducers = notificationSlice.reducer;
