import { combineReducers } from 'redux'
import { MachineReducers } from './machine'
import { UiReducers } from './ui'
import { ColorReducers } from './color'

export interface GlobalState {
    Machine: typeof MachineReducers,
    Ui: typeof UiReducers,
    Colors: typeof ColorReducers
}

export default combineReducers({
    Machine: MachineReducers,
    Ui: UiReducers,
    Colors: ColorReducers
})
