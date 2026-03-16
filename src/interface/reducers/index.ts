import { combineReducers } from '@reduxjs/toolkit'
import { MachineReducers, type MachineState } from './machine'
import { ColorReducers, type ColorState } from './color'
import { UiReducers, type UiState } from './ui'

export interface GlobalState {
    Machine: MachineState,
    Ui: UiState,
    Colors: ColorState
}

export default combineReducers({
    Machine: MachineReducers,
    Ui: UiReducers,
    Colors: ColorReducers
})
