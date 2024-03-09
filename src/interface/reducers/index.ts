import { combineReducers } from 'redux'
import { MachineReducers, initialState as machineInitialState } from './machine'
import { UiReducers, initialState as uiInitialState } from './ui'
import { ColorReducers, initialState as colorsInitialState } from './color'

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
