import {
    nextPrefetchCycle,
    NEXT_PREFETCH_CYCLE,
    NEXT_DECODER_CYCLE
} from '../actions';

import {
    NEXT_JUMP_TABLE_CYCLE
} from '../actions/jump-table-actions';

import {
    STEP_FORWARD,
    STEP_BACK
} from '../actions/history';

import {
    FUNCTIONAL_UNIT_CYCLE
} from '../actions/functional-unit-actions';

import {
    NEXT_RESERVE_STATION_CYCLE
} from '../actions/reserve-station-actions';

import {
    NEXT_REORDER_BUFFER_MAPPER_CYCLE
} from '../actions/reorder-buffer-mapper-actions';
import { NEXT_REORDER_BUFFER_CYCLE } from '../actions/reorder-buffer-actions';
import { NEXT_REGISTERS_CYCLE } from '../actions/register-actions';
import { NEXT_MEMORY_CYCLE } from '../actions/memory-actions';
import { NEXT_CYCLE } from '../actions/cycle-actions';

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
    ROBGpr: [],
    ROBFpr: [],
    reorderBuffer: [],
    generalRegisters: [],
    floatingRegisters: [],
    memory: [],
    cycle: 0
}

export function SuperescalarReducers(state = initialState, action) {
    switch (action.type) {
        case NEXT_PREFETCH_CYCLE:
            return state = { ...state, prefetchUnit: action.value };
        case NEXT_DECODER_CYCLE:
            return state = { ...state, decoder: action.value };
        case NEXT_JUMP_TABLE_CYCLE:
            return state = { ...state, jumpPrediction: action.value };
        case STEP_FORWARD:
            let { history, ...currentState } = state;
            history = [history.slice(-9), currentState];
            return state = { ...state, history: history };
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
        default:
            return state
    }
}