import {
    NEXT_PREFETCH_CYCLE,
    NEXT_DECODER_CYCLE,
    NEXT_JUMP_TABLE_CYCLE,
    FUNCTIONAL_UNIT_CYCLE,
    HEADER_TABLE_CYCLE,
    TABLE_CYCLE,
    NEXT_RESERVE_STATION_CYCLE,
    NEXT_REORDER_BUFFER_MAPPER_CYCLE,
    NEXT_REORDER_BUFFER_CYCLE,
    NEXT_REGISTERS_CYCLE,
    NEXT_MEMORY_CYCLE,
    NEXT_CYCLE,
    NEXT_INSTRUCTIONS_COMMITED,
    NEXT_TOTAL_COMMITED,
    NEXT_UNITS_OCUPATION,
    NEXT_STATUSES_COUNT,
    NEXT_INSTRUCTIONS_STATUSES_AVERAGE_CYCLES,
    CURRENT_PC,
    SUPERSCALAR_LOAD,
    VIEW_BASIC_BLOCKS
} from '../actions';

import {
    ADD_MEMORY_INTERVAL,
    REMOVE_MEMORY_INTERVAL,
    ADD_GENERAL_REGISTERS_INTERVAL,
    REMOVE_GENERAL_REGISTERS_INTERVAL,
    ADD_FLOATING_REGISTERS_INTERVAL,
    REMOVE_FLOATING_REGISTERS_INTERVAL
} from '../actions/intervals-actions';
import { generateRangeArray } from '../utils/interval';
import { PUSH_HISTORY, TAKE_HISTORY, RESET_HISTORY } from '../actions/history';

import { Machine } from '../../core/Common/Machine';
import { removeInterval, addInterval } from './interval';
import {
    NEXT_NAT_FPR_CYCLE,
    ADD_NAT_FPR_INTERVAL,
    ADD_NAT_GPR_INTERVAL,
    ADD_PREDICATE_INTERVAL,
    REMOVE_NAT_GPR_INTERVAL,
    REMOVE_PREDICATE_INTERVAL,
    REMOVE_NAT_FPR_INTERVAL,
    NEXT_NAT_GPR_CYCLE,
    NEXT_PREDICATE_CYCLE
} from '../actions/predicate-nat-actions';

export const MAX_HISTORY_SIZE = 10;
export const PREDICATE_SIZE = 64;

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
        data: {}
    },
    ROBFpr: {
        data: {}
    },
    reorderBuffer: [],
    generalRegisters: {
        data: [],
        visibleRangeValues: generateRangeArray(Machine.NGP)
    },
    floatingRegisters: {
        data: [],
        visibleRangeValues: generateRangeArray(Machine.NFP)
    },
    memory: {
        data: [],
        visibleRangeValues: generateRangeArray(Machine.MEMORY_SIZE)
    },
    predicate: {
        data: [],
        visibleRangeValues: generateRangeArray(PREDICATE_SIZE)
    },
    natGpr: {
        data: [],
        visibleRangeValues: generateRangeArray(PREDICATE_SIZE)
    },
    natFpr: {
        data: [],
        visibleRangeValues: generateRangeArray(PREDICATE_SIZE)
    },
    stats: {
        commited: 0,
        discarded: 0,
        commitedPerInstr: [],
        unitsUsage: new Map(),
        statusesCount: new Map(),
        instructionsStatusesAverageCycles: new Map()
    },
    cycle: 0,
    pc: 0,
    code: [],
    vliwCode: [],
    vliwExecutionHeaderTable: [],
    vliwExecutionTable: [],
    colorBasicBlocks: false
};

export function MachineReducers(state = initialState, action): typeof initialState {
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
        case HEADER_TABLE_CYCLE:
            return (state = {
                ...state,
                vliwExecutionHeaderTable: action.value
            });
        case TABLE_CYCLE:
            return (state = {
                ...state,
                vliwExecutionTable: action.value
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
                ROBGpr: { ...state.ROBGpr, data: action.value[0] },
                ROBFpr: { ...state.ROBFpr, data: action.value[1] }
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
        case CURRENT_PC:
            return (state = {
                ...state,
                pc: action.value
            });
        case NEXT_INSTRUCTIONS_COMMITED:
            return (state = {
                ...state,
                stats: {
                    ...state.stats,
                    commitedPerInstr: Array.from(action.value, ([name, value]) => ({ name, value }))
                }
            });
        case NEXT_TOTAL_COMMITED:
            return (state = {
                ...state,
                stats: {
                    ...state.stats,
                    commited: action.value.commited,
                    discarded: action.value.discarded
                }
            });
        case NEXT_UNITS_OCUPATION:
            return (state = {
                ...state,
                stats: {
                    ...state.stats,
                    unitsUsage: action.value
                }
            });
        case NEXT_STATUSES_COUNT:
            return (state = {
                ...state,
                stats: {
                    ...state.stats,
                    statusesCount: action.value
                }
            });
        case NEXT_INSTRUCTIONS_STATUSES_AVERAGE_CYCLES:
            return (state = {
                ...state,
                stats: {
                    ...state.stats,
                    instructionsStatusesAverageCycles: action.value
                }
            });
        case SUPERSCALAR_LOAD:
            return (state = {
                ...state,
                code: action.value
            });
        case VIEW_BASIC_BLOCKS:
            return (state = {
                ...state,
                colorBasicBlocks: action.value
            });
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
                        predicate: { ...state.predicate },
                        NatGpr: { ...state.natGpr },
                        NatFpr: { ...state.natFpr },
                        reorderBuffer: state.reorderBuffer,
                        generalRegisters: state.generalRegisters,
                        floatingRegisters: state.floatingRegisters,
                        memory: state.memory,
                        cycle: state.cycle
                    }
                ].slice(-MAX_HISTORY_SIZE)
            });
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
        case NEXT_NAT_FPR_CYCLE:
            return {
                ...state,
                natFpr: {
                    ...state.natFpr,
                    data: [...action.value]
                }
            };
        case NEXT_NAT_GPR_CYCLE:
            return {
                ...state,
                natGpr: {
                    ...state.natGpr,
                    data: [...action.value]
                }
            };
        case NEXT_PREDICATE_CYCLE:
            return {
                ...state,
                predicate: {
                    ...state.predicate,
                    data: [...action.value]
                }
            };
        case ADD_NAT_FPR_INTERVAL:
            return addInterval(state, 'NatFpr', action.value);
        case ADD_NAT_GPR_INTERVAL:
            return addInterval(state, 'NatGpr', action.value);
        case ADD_PREDICATE_INTERVAL:
            return addInterval(state, 'Predicate', action.value);
        case REMOVE_NAT_FPR_INTERVAL:
            return removeInterval(state, 'NatFpr', action.value);
        case REMOVE_NAT_GPR_INTERVAL:
            return removeInterval(state, 'NatGpr', action.value);
        case REMOVE_PREDICATE_INTERVAL:
            return removeInterval(state, 'Predicate', action.value);
        default:
            return state;
    }
}
