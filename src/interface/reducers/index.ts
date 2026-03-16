import { combineReducers } from '@reduxjs/toolkit'
import { MachineReducers, type MachineState } from './machine'
import { ColorReducers, type ColorState } from './color'
import { UiReducers, type UiState } from './ui'
import { NotificationReducers, type NotificationState } from './notification'

export interface GlobalState {
    Machine: MachineState,
    Ui: UiState,
    Colors: ColorState,
    Notification: NotificationState
}

export default combineReducers({
    Machine: MachineReducers,
    Ui: UiReducers,
    Colors: ColorReducers,
    Notification: NotificationReducers
})
