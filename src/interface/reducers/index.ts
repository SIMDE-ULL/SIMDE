import { combineReducers } from 'redux'
import { MachineReducers } from './machine'
import { UiReducers } from './ui'

export default combineReducers({
    Machine: MachineReducers,
    Ui: UiReducers
})
