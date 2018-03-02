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
    VIEW_BASIC_BLOCKS
} from '../actions';
import { TOGGLE_LOAD_MODAL, TOGGLE_AUTHOR_MODAL, TOGGLE_OPTIONS_MODAL, TOGGLE_SUPER_CONFIG_MODAL } from '../actions/modals';
import { ADD_ROB_FPR_INTERVAL } from '../actions/intervals-actions';

    // STEP_FORWARD,
    // STEP_BACK

const MAX_HISTORY_SIZE = 10;

export const initialState = {
    prefetchUnit: [],
    decoder: [],
    jumpPrediction: [],
    historyIndex: 0,
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
        showableData: [],
        visibleRangeValues: []
    },
    ROBFpr: {
        datat: [],
        showableData: [],
        visibleRangeValues: []
    },
    reorderBuffer: [],
    generalRegisters: [],
    floatingRegisters: [],
    memory: [],
    cycle: 0,
    code: [],
    colorBasicBlocks: false,
    isLoadModalOpen: false,
    isAuthorModalOpen: false,
    isOptionsModalOpen: false,
    isSuperConfigModalOpen: false
}

export function SuperescalarReducers(state = initialState, action) {
    switch (action.type) {
        case NEXT_PREFETCH_CYCLE:
            return state = { ...state, prefetchUnit: action.value };
        case NEXT_DECODER_CYCLE:
            return state = { ...state, decoder: action.value };
        case NEXT_JUMP_TABLE_CYCLE:
            return state = { ...state, jumpPrediction: action.value };
        case FUNCTIONAL_UNIT_CYCLE:
            return state = {
                ...state,
                functionalUnitIntAdd: action.value[0],
                functionalUnitIntSub: action.value[1],
                functionalUnitFloAdd: action.value[2],
                functionalUnitFloSub: action.value[3],
                functionalUnitMemory: action.value[4],
                functionalUnitJump: action.value[5],
                functionalUnitAluMem: action.value[6]
            };
        case NEXT_RESERVE_STATION_CYCLE:
            return state = {
                ...state,
                reserveStationIntAdd: action.value[0],
                reserveStationIntSub: action.value[1],
                reserveStationFloAdd: action.value[2],
                reserveStationFloSub: action.value[3],
                reserveStationMemory: action.value[4],
                reserveStationJump: action.value[5]
            };
        case NEXT_REORDER_BUFFER_MAPPER_CYCLE:
            return state = {
                ...state,
                ROBGpr: action.value[0],
                ROBFpr: action.value[1]
            };
        case NEXT_REORDER_BUFFER_CYCLE:
            return state = {
                ...state,
                reorderBuffer: action.value
            };
        case NEXT_REGISTERS_CYCLE:
            return state = {
                ...state,
                generalRegisters: action.value[0],
                floatingRegisters: action.value[1]
            };
        case NEXT_MEMORY_CYCLE:
            return state = {
                ...state,
                memory: action.value
            };
        case NEXT_CYCLE:
            return state = {
                ...state,
                cycle: action.value
            };
        case SUPERESCALAR_LOAD:
            return state = {
                ...state,
                code: action.value
            };
        case TOGGLE_LOAD_MODAL:
            return state = {
                ...state,
                isLoadModalOpen: action.value
            };
        case TOGGLE_AUTHOR_MODAL:
            return state = {
                ...state,
                isAuthorModalOpen: action.value
            };
        case TOGGLE_OPTIONS_MODAL:
            return state = {
                ...state,
                isOptionsModalOpen: action.value
            };
        case TOGGLE_SUPER_CONFIG_MODAL:
            return state = {
                ...state,
                isSuperConfigModalOpen: action.value
            };
        case VIEW_BASIC_BLOCKS:
            return state = {
                ...state,
                colorBasicBlocks: action.value
            };
        case ADD_ROB_FPR_INTERVAL:
            return state = {
                ...state,
                ROBGpr: action.value
            }        
        default:
            return state
    }
}
