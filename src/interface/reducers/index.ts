import { combineReducers } from 'redux'
import { MachineReducers } from './machine'
import { UiReducers } from './ui'
import { ColorReducers } from './color'

export default combineReducers({
    Machine: MachineReducers,
    Ui: UiReducers,
    Colors: ColorReducers
})
