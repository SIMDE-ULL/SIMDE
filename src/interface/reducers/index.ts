import { combineReducers } from "@reduxjs/toolkit";
import { ColorReducers, type ColorState } from "./color";
import { MachineReducers, type MachineState } from "./machine";
import { NotificationReducers, type NotificationState } from "./notification";
import { UiReducers, type UiState } from "./ui";

export interface GlobalState {
  Machine: MachineState;
  Ui: UiState;
  Colors: ColorState;
  Notification: NotificationState;
}

export default combineReducers({
  Machine: MachineReducers,
  Ui: UiReducers,
  Colors: ColorReducers,
  Notification: NotificationReducers,
});
