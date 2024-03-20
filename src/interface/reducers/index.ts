import { combineReducers } from 'redux'
import { MachineReducers, type initialState as machineInitialState } from './machine'
import { ColorReducers, type initialState as colorsInitialState } from './color'
import { UiReducers, type initialState as uiInitialState } from './ui'

export interface GlobalState {
    Machine: typeof machineInitialState,
    Ui: typeof uiInitialState,
    Colors: typeof colorsInitialState
}

export default combineReducers({
    Machine: MachineReducers,
    Ui: UiReducers,
    Colors: ColorReducers
})
