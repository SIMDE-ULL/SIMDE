import {
    NEXT_PREFETCH_CYCLE,
    NEXT_DECODER_CYCLE,
    NEXT_JUMP_TABLE_CYCLE,
    FUNCTIONAL_UNIT_CYCLE,
    NEXT_RESERVE_STATION_CYCLE,
    NEXT_REORDER_BUFFER_MAPPER_CYCLE,
    NEXT_REORDER_BUFFER_CYCLE,
    NEXT_REGISTERS_CYCLE,
    NEXT_MEMORY_CYCLE,
    NEXT_CYCLE,
    SUPERESCALAR_LOAD,
    VIEW_BASIC_BLOCKS,
    COLOR_CELL
} from '../actions';
import {
    TOGGLE_LOAD_MODAL,
    TOGGLE_AUTHOR_MODAL,
    TOGGLE_OPTIONS_MODAL,
    TOGGLE_SUPER_CONFIG_MODAL,
    TOGGLE_LOAD_CONTENT_MODAL,
    TOGGLE_BATCH_MODAL,
    DISPLAY_BATCH_RESULTS,
    CLEAR_BATCH_RESULTS
} from '../actions/modals';
import {
    ADD_ROB_FPR_INTERVAL,
    ADD_ROB_GPR_INTERVAL,
    REMOVE_ROB_FPR_INTERVAL,
    REMOVE_ROB_GPR_INTERVAL,
    ADD_MEMORY_INTERVAL,
    REMOVE_MEMORY_INTERVAL,
    ADD_GENERAL_REGISTERS_INTERVAL,
    REMOVE_GENERAL_REGISTERS_INTERVAL,
    ADD_FLOATING_REGISTERS_INTERVAL,
    REMOVE_FLOATING_REGISTERS_INTERVAL
} from '../actions/intervals-actions';
import { generateRangeArray } from '../utils/interval';
import { PUSH_HISTORY, TAKE_HISTORY, RESET_HISTORY } from '../actions/history';

import { MACHINE_REGISTER_SIZE, MEMORY_SIZE } from '../../core/Constants';
import { colorHistoryInstruction } from './color';
import { removeInterval, addInterval } from './interval';

export const MAX_HISTORY_SIZE = 10;

export const initialState = {
    prefetchUnit: [],
    decoder: [],
    jumpPrediction: [],
    history: [],
    functionalUnitIntAdd: {},
    functionalUnitIntSub: {},
    functionalUnitFloAdd: {},
    functionalUnitFloSub: {},
    functionalUnitMemory: {},
    functionalUnitJump: {},
    functionalUnitAluMem: {},
    reserveStationIntAdd: [],
    reserveStationIntSub: [],
    reserveStationFloAdd: [],
    reserveStationFloSub: [],
    reserveStationMemory: [],
    reserveStationJump: [],
    ROBGpr: {
        data: [],
        visibleRangeValues: generateRangeArray(MACHINE_REGISTER_SIZE)
    },
    ROBFpr: {
        data: [],
        visibleRangeValues: generateRangeArray(MACHINE_REGISTER_SIZE)
    },
    reorderBuffer: [],
    generalRegisters: {
        data: [],
        visibleRangeValues: generateRangeArray(MACHINE_REGISTER_SIZE)
    },
    floatingRegisters: {
        data: [],
        visibleRangeValues: generateRangeArray(MACHINE_REGISTER_SIZE)
    },
    memory: {
        data: [],
        visibleRangeValues: generateRangeArray(MEMORY_SIZE)
    },
    cycle: 0,
    code: [],
    colorBasicBlocks: false,
    isLoadModalOpen: false,
    isAuthorModalOpen: false,
    isOptionsModalOpen: false,
    isSuperConfigModalOpen: false,
    isLoadContentModalOpen: false,
    isBatchModalOpen: false,
    isBatchResultsModalOpen: false,
    batchResults: {}
};

export function SuperescalarReducers(state = initialState, action) {
    switch (action.type) {
        case NEXT_PREFETCH_CYCLE:
            return (state = { ...state, prefetchUnit: action.value });
        case NEXT_DECODER_CYCLE:
            return (state = { ...state, decoder: action.value });
        case NEXT_JUMP_TABLE_CYCLE:
            return (state = { ...state, jumpPrediction: action.value });
        case FUNCTIONAL_UNIT_CYCLE:
            return (state = {
                ...state,
                functionalUnitIntAdd: action.value[0],
                functionalUnitIntSub: action.value[1],
                functionalUnitFloAdd: action.value[2],
                functionalUnitFloSub: action.value[3],
                functionalUnitMemory: action.value[4],
                functionalUnitJump: action.value[5],
                functionalUnitAluMem: action.value[6]
            });
        case NEXT_RESERVE_STATION_CYCLE:
            return (state = {
                ...state,
                reserveStationIntAdd: action.value[0],
                reserveStationIntSub: action.value[1],
                reserveStationFloAdd: action.value[2],
                reserveStationFloSub: action.value[3],
                reserveStationMemory: action.value[4],
                reserveStationJump: action.value[5]
            });
        case NEXT_REORDER_BUFFER_MAPPER_CYCLE:
            return (state = {
                ...state,
                ROBGpr: { ...state.ROBGpr, data: [...action.value[0]] },
                ROBFpr: { ...state.ROBFpr, data: [...action.value[1]] }
            });
        case NEXT_REORDER_BUFFER_CYCLE:
            return (state = {
                ...state,
                reorderBuffer: action.value
            });
        case NEXT_REGISTERS_CYCLE:
            return (state = {
                ...state,
                generalRegisters: {
                    ...state.generalRegisters,
                    data: [...action.value[0]]
                },
                floatingRegisters: {
                    ...state.floatingRegisters,
                    data: [...action.value[1]]
                }
            });
        case NEXT_MEMORY_CYCLE:
            return (state = {
                ...state,
                memory: {
                    ...state.memory,
                    data: action.value
                }
            });
        case NEXT_CYCLE:
            return (state = {
                ...state,
                cycle: action.value
            });
        case SUPERESCALAR_LOAD:
            return (state = {
                ...state,
                code: action.value
            });
        case TOGGLE_LOAD_MODAL:
            return (state = {
                ...state,
                isLoadModalOpen: action.value
            });
        case TOGGLE_AUTHOR_MODAL:
            return (state = {
                ...state,
                isAuthorModalOpen: action.value
            });
        case TOGGLE_OPTIONS_MODAL:
            return (state = {
                ...state,
                isOptionsModalOpen: action.value
            });
        case TOGGLE_SUPER_CONFIG_MODAL:
            return (state = {
                ...state,
                isSuperConfigModalOpen: action.value
            });
        case TOGGLE_BATCH_MODAL:
            return (state = {
                ...state,
                isBatchModalOpen: action.value
            });
        case TOGGLE_LOAD_CONTENT_MODAL:
            return (state = {
                ...state,
                isLoadContentModalOpen: action.value
            });
        case VIEW_BASIC_BLOCKS:
            return (state = {
                ...state,
                colorBasicBlocks: action.value
            });
        case ADD_ROB_FPR_INTERVAL:
            return addInterval(state, 'ROBFpr', action.value);
        case ADD_ROB_GPR_INTERVAL:
            return addInterval(state, 'ROBGpr', action.value);
        case REMOVE_ROB_FPR_INTERVAL:
            return removeInterval(state, 'ROBFpr', action.value);
        case REMOVE_ROB_GPR_INTERVAL:
            return removeInterval(state, 'ROBGpr', action.value);
        case ADD_MEMORY_INTERVAL:
            return addInterval(state, 'memory', action.value);
        case REMOVE_MEMORY_INTERVAL:
            return removeInterval(state, 'memory', action.value);
        case ADD_GENERAL_REGISTERS_INTERVAL:
            return addInterval(state, 'generalRegisters', action.value);
        case REMOVE_GENERAL_REGISTERS_INTERVAL:
            return removeInterval(state, 'generalRegisters', action.value);
        case ADD_FLOATING_REGISTERS_INTERVAL:
            return addInterval(state, 'floatingRegisters', action.value);
        case REMOVE_FLOATING_REGISTERS_INTERVAL:
            return addInterval(state, 'floatingRegisters', action.value);
        case PUSH_HISTORY:
            return (state = {
                ...state,
                history: [
                    ...state.history,
                    {
                        prefetchUnit: state.prefetchUnit,
                        decoder: state.decoder,
                        jumpPrediction: state.jumpPrediction,
                        functionalUnitIntAdd: state.functionalUnitIntAdd,
                        functionalUnitIntSub: state.functionalUnitIntSub,
                        functionalUnitFloAdd: state.functionalUnitFloAdd,
                        functionalUnitFloSub: state.functionalUnitFloSub,
                        functionalUnitMemory: state.functionalUnitMemory,
                        functionalUnitJump: state.functionalUnitJump,
                        functionalUnitAluMem: state.functionalUnitAluMem,
                        reserveStationIntAdd: state.reserveStationIntAdd,
                        reserveStationIntSub: state.reserveStationIntSub,
                        reserveStationFloAdd: state.reserveStationFloAdd,
                        reserveStationFloSub: state.reserveStationFloSub,
                        reserveStationMemory: state.reserveStationMemory,
                        reserveStationJump: state.reserveStationJump,
                        ROBGpr: { ...state.ROBGpr },
                        ROBFpr: { ...state.ROBFpr },
                        reorderBuffer: state.reorderBuffer,
                        generalRegisters: state.generalRegisters,
                        floatingRegisters: state.floatingRegisters,
                        memory: state.memory,
                        cycle: state.cycle
                    }
                ].slice(-MAX_HISTORY_SIZE)
            });
        case COLOR_CELL:
            let newState = { ...state };
            newState.history = colorHistoryInstruction(
                newState.history,
                action.value[0],
                action.value[1]
            );
            return newState;
        case TAKE_HISTORY:
            return (state = {
                ...state,
                ...state.history[state.history.length - 1 - action.value]
            });
        case RESET_HISTORY:
            return (state = {
                ...state,
                history: []
            });
        case DISPLAY_BATCH_RESULTS:
            return (state = {
                ...state,
                batchResults: action.value,
                isBatchResultsModalOpen: true
            });
        case CLEAR_BATCH_RESULTS:
            return (state = {
                ...state,
                batchResults: {},
                isBatchResultsModalOpen: false
            });
        default:
            return state;
    }
}
