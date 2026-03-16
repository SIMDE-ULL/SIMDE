import { type Draft, type PayloadAction, createSlice } from "@reduxjs/toolkit";
import type { Instruction } from "../../core/Common/Instruction";
import { Machine } from "../../core/Common/Machine";
import { generateRangeArray } from "../utils/interval";

export const MAX_HISTORY_SIZE = 10;
export const PREDICATE_SIZE = 64;

interface RangedData {
  data: (number | boolean)[];
  visibleRangeValues: number[];
}

interface FunctionalUnitEntry {
  content: unknown[];
  header: string[];
}

export interface StatsEntry {
  name: string;
  value: number;
}

interface MachineStats {
  commited: number;
  discarded: number;
  commitedPerInstr: StatsEntry[];
  unitsUsage: Record<string, number[]>;
  statusesCount: Record<string, number[]>;
  instructionsStatusesAverageCycles: Record<number, InstructionStatsEntry>;
}

interface InstructionStatsEntry {
  prefetchCycles: number;
  decodeCycles: number;
  issueCycles: number;
  executeCycles: number;
  writeBackCycles: number;
}

interface ReserveStationEntry {
  instruction: { id: string; value: string; uid: string };
  Qj: string;
  Vj: string;
  Qk: string;
  Vk: string;
  A: string;
  ROB: string;
}

interface HistoryEntry {
  prefetchUnit: unknown[];
  decoder: unknown[];
  jumpPrediction: unknown[];
  functionalUnitIntAdd: FunctionalUnitEntry | Record<string, never>;
  functionalUnitIntSub: FunctionalUnitEntry | Record<string, never>;
  functionalUnitFloAdd: FunctionalUnitEntry | Record<string, never>;
  functionalUnitFloSub: FunctionalUnitEntry | Record<string, never>;
  functionalUnitMemory: FunctionalUnitEntry | Record<string, never>;
  functionalUnitJump: FunctionalUnitEntry | Record<string, never>;
  functionalUnitAluMem: FunctionalUnitEntry | Record<string, never>;
  reserveStationIntAdd: ReserveStationEntry[];
  reserveStationIntSub: ReserveStationEntry[];
  reserveStationFloAdd: ReserveStationEntry[];
  reserveStationFloSub: ReserveStationEntry[];
  reserveStationMemory: ReserveStationEntry[];
  reserveStationJump: ReserveStationEntry[];
  ROBGpr: { data: Record<string, number> };
  ROBFpr: { data: Record<string, number> };
  predicate: RangedData;
  natGpr: RangedData;
  natFpr: RangedData;
  reorderBuffer: unknown[];
  generalRegisters: RangedData;
  floatingRegisters: RangedData;
  memory: RangedData;
  cycle: number;
}

export interface MachineState {
  prefetchUnit: unknown[];
  decoder: unknown[];
  jumpPrediction: unknown[];
  history: HistoryEntry[];
  functionalUnitIntAdd: FunctionalUnitEntry | Record<string, never>;
  functionalUnitIntSub: FunctionalUnitEntry | Record<string, never>;
  functionalUnitFloAdd: FunctionalUnitEntry | Record<string, never>;
  functionalUnitFloSub: FunctionalUnitEntry | Record<string, never>;
  functionalUnitMemory: FunctionalUnitEntry | Record<string, never>;
  functionalUnitJump: FunctionalUnitEntry | Record<string, never>;
  functionalUnitAluMem: FunctionalUnitEntry | Record<string, never>;
  reserveStationIntAdd: ReserveStationEntry[];
  reserveStationIntSub: ReserveStationEntry[];
  reserveStationFloAdd: ReserveStationEntry[];
  reserveStationFloSub: ReserveStationEntry[];
  reserveStationMemory: ReserveStationEntry[];
  reserveStationJump: ReserveStationEntry[];
  ROBGpr: { data: Record<string, number> };
  ROBFpr: { data: Record<string, number> };
  reorderBuffer: unknown[];
  generalRegisters: RangedData;
  floatingRegisters: RangedData;
  memory: RangedData;
  predicate: RangedData;
  natGpr: RangedData;
  natFpr: RangedData;
  stats: MachineStats;
  cycle: number;
  pc: number;
  code: Instruction[];
  vliwCode: unknown[];
  vliwExecutionHeaderTable: unknown[];
  vliwExecutionTable: unknown[];
  colorBasicBlocks: boolean;
}

type RangedField =
  | "memory"
  | "generalRegisters"
  | "floatingRegisters"
  | "predicate"
  | "natGpr"
  | "natFpr";

function addIntervalToField(
  state: Draft<MachineState>,
  field: RangedField,
  interval: number[],
) {
  const current = state[field];
  const newVisibleRangeValues = Array.from(
    new Set([...current.visibleRangeValues, ...interval]),
  ).sort((a, b) => a - b);

  state[field] = {
    ...current,
    visibleRangeValues: newVisibleRangeValues,
  };
  for (const entry of state.history) {
    (entry[field] as RangedData).visibleRangeValues = newVisibleRangeValues;
  }
}

function removeIntervalFromField(
  state: Draft<MachineState>,
  field: RangedField,
  interval: number[],
) {
  const toRemove = new Set(interval);
  const current = state[field];
  const newVisibleRangeValues = current.visibleRangeValues.filter(
    (x: number) => !toRemove.has(x),
  );

  state[field] = {
    ...current,
    visibleRangeValues: newVisibleRangeValues,
  };
  for (const entry of state.history) {
    (entry[field] as RangedData).visibleRangeValues = newVisibleRangeValues;
  }
}

export const initialState: MachineState = {
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
    data: {},
  },
  ROBFpr: {
    data: {},
  },
  reorderBuffer: [],
  generalRegisters: {
    data: [],
    visibleRangeValues: generateRangeArray(Machine.NGP),
  },
  floatingRegisters: {
    data: [],
    visibleRangeValues: generateRangeArray(Machine.NFP),
  },
  memory: {
    data: [],
    visibleRangeValues: generateRangeArray(Machine.MEMORY_SIZE),
  },
  predicate: {
    data: [],
    visibleRangeValues: generateRangeArray(PREDICATE_SIZE),
  },
  natGpr: {
    data: [],
    visibleRangeValues: generateRangeArray(PREDICATE_SIZE),
  },
  natFpr: {
    data: [],
    visibleRangeValues: generateRangeArray(PREDICATE_SIZE),
  },
  stats: {
    commited: 0,
    discarded: 0,
    commitedPerInstr: [],
    unitsUsage: {},
    statusesCount: {},
    instructionsStatusesAverageCycles: {},
  },
  cycle: 0,
  pc: 0,
  code: [],
  vliwCode: [],
  vliwExecutionHeaderTable: [],
  vliwExecutionTable: [],
  colorBasicBlocks: false,
};

const machineSlice = createSlice({
  name: "machine",
  initialState,
  reducers: {
    nextPrefetchCycle(state, action: PayloadAction<unknown[]>) {
      state.prefetchUnit = action.payload;
    },
    nextDecoderCycle(state, action: PayloadAction<unknown[]>) {
      state.decoder = action.payload;
    },
    nextJumpTableCycle(state, action: PayloadAction<unknown[]>) {
      state.jumpPrediction = action.payload;
    },
    nextFunctionalUnitCycle(
      state,
      action: PayloadAction<(FunctionalUnitEntry | Record<string, never>)[]>,
    ) {
      state.functionalUnitIntAdd = action.payload[0];
      state.functionalUnitIntSub = action.payload[1];
      state.functionalUnitFloAdd = action.payload[2];
      state.functionalUnitFloSub = action.payload[3];
      state.functionalUnitMemory = action.payload[4];
      state.functionalUnitJump = action.payload[5];
      state.functionalUnitAluMem = action.payload[6];
    },
    nextVliwHeaderTableCycle(state, action: PayloadAction<unknown[]>) {
      state.vliwExecutionHeaderTable = action.payload;
    },
    nextVliwTableCycle(state, action: PayloadAction<unknown[]>) {
      state.vliwExecutionTable = action.payload;
    },
    nextReserveStationCycle(state, action: PayloadAction<unknown[][]>) {
      state.reserveStationIntAdd = action.payload[0] as ReserveStationEntry[];
      state.reserveStationIntSub = action.payload[1] as ReserveStationEntry[];
      state.reserveStationFloAdd = action.payload[2] as ReserveStationEntry[];
      state.reserveStationFloSub = action.payload[3] as ReserveStationEntry[];
      state.reserveStationMemory = action.payload[4] as ReserveStationEntry[];
      state.reserveStationJump = action.payload[5] as ReserveStationEntry[];
    },
    nextReorderBufferMapperCycle(
      state,
      action: PayloadAction<[Record<string, number>, Record<string, number>]>,
    ) {
      state.ROBGpr = { ...state.ROBGpr, data: action.payload[0] };
      state.ROBFpr = { ...state.ROBFpr, data: action.payload[1] };
    },
    nextReorderBufferCycle(state, action: PayloadAction<unknown[]>) {
      state.reorderBuffer = action.payload;
    },
    nextRegistersCycle(state, action: PayloadAction<[number[], number[]]>) {
      state.generalRegisters = {
        ...state.generalRegisters,
        data: [...action.payload[0]],
      };
      state.floatingRegisters = {
        ...state.floatingRegisters,
        data: [...action.payload[1]],
      };
    },
    nextMemoryCycle(state, action: PayloadAction<number[]>) {
      state.memory = {
        ...state.memory,
        data: action.payload,
      };
    },
    nextCycle(state, action: PayloadAction<number>) {
      state.cycle = action.payload;
    },
    currentPC(state, action: PayloadAction<number>) {
      state.pc = action.payload;
    },
    nextInstructionsCommited: {
      reducer(state, action: PayloadAction<StatsEntry[]>) {
        state.stats.commitedPerInstr = action.payload;
      },
      prepare(data: Map<number, number>) {
        return {
          payload: Array.from(data, ([name, value]) => ({
            name: String(name),
            value,
          })),
        };
      },
    },
    nextTotalCommited(
      state,
      action: PayloadAction<{ commited: number; discarded: number }>,
    ) {
      state.stats.commited = action.payload.commited;
      state.stats.discarded = action.payload.discarded;
    },
    nextUnitsUsage: {
      reducer(state, action: PayloadAction<Record<string, number[]>>) {
        state.stats.unitsUsage = action.payload;
      },
      prepare(data: Map<string, number[]>) {
        return { payload: Object.fromEntries(data) };
      },
    },
    nextStatusesCount: {
      reducer(state, action: PayloadAction<Record<string, number[]>>) {
        state.stats.statusesCount = action.payload;
      },
      prepare(data: Map<string, number[]>) {
        return { payload: Object.fromEntries(data) };
      },
    },
    nextInstructionsStatusesAverageCycles: {
      reducer(
        state,
        action: PayloadAction<Record<number, InstructionStatsEntry>>,
      ) {
        state.stats.instructionsStatusesAverageCycles = action.payload;
      },
      prepare(data: Map<number, InstructionStatsEntry>) {
        return { payload: Object.fromEntries(data) };
      },
    },
    superscalarLoad(state, action: PayloadAction<Instruction[]>) {
      state.code = action.payload;
    },
    viewBasicBlocks(state, action: PayloadAction<boolean>) {
      state.colorBasicBlocks = action.payload;
    },
    addMemoryInterval(state, action: PayloadAction<number[]>) {
      addIntervalToField(state, "memory", action.payload);
    },
    removeMemoryInterval(state, action: PayloadAction<number[]>) {
      removeIntervalFromField(state, "memory", action.payload);
    },
    addGeneralRegistersInterval(state, action: PayloadAction<number[]>) {
      addIntervalToField(state, "generalRegisters", action.payload);
    },
    removeGeneralRegistersInterval(state, action: PayloadAction<number[]>) {
      removeIntervalFromField(state, "generalRegisters", action.payload);
    },
    addFloatingRegistersInterval(state, action: PayloadAction<number[]>) {
      addIntervalToField(state, "floatingRegisters", action.payload);
    },
    removeFloatingRegistersInterval(state, action: PayloadAction<number[]>) {
      removeIntervalFromField(state, "floatingRegisters", action.payload);
    },
    pushHistory(state) {
      state.history = [
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
          natGpr: { ...state.natGpr },
          natFpr: { ...state.natFpr },
          reorderBuffer: state.reorderBuffer,
          generalRegisters: state.generalRegisters,
          floatingRegisters: state.floatingRegisters,
          memory: state.memory,
          cycle: state.cycle,
        },
      ].slice(-MAX_HISTORY_SIZE);
    },
    takeHistory(state, action: PayloadAction<number>) {
      const entry = state.history[state.history.length - 1 - action.payload];
      if (entry) {
        Object.assign(state, entry);
      }
    },
    resetHistory(state) {
      state.history = [];
    },
    nextNatFprCycle(state, action: PayloadAction<boolean[]>) {
      state.natFpr = {
        ...state.natFpr,
        data: [...action.payload],
      };
    },
    nextNatGprCycle(state, action: PayloadAction<boolean[]>) {
      state.natGpr = {
        ...state.natGpr,
        data: [...action.payload],
      };
    },
    nextPredicateCycle(state, action: PayloadAction<boolean[]>) {
      state.predicate = {
        ...state.predicate,
        data: [...action.payload],
      };
    },
    addNatFprInterval(state, action: PayloadAction<number[]>) {
      addIntervalToField(state, "natFpr", action.payload);
    },
    addNatGprInterval(state, action: PayloadAction<number[]>) {
      addIntervalToField(state, "natGpr", action.payload);
    },
    addPredicateInterval(state, action: PayloadAction<number[]>) {
      addIntervalToField(state, "predicate", action.payload);
    },
    removeNatFprInterval(state, action: PayloadAction<number[]>) {
      removeIntervalFromField(state, "natFpr", action.payload);
    },
    removeNatGprInterval(state, action: PayloadAction<number[]>) {
      removeIntervalFromField(state, "natGpr", action.payload);
    },
    removePredicateInterval(state, action: PayloadAction<number[]>) {
      removeIntervalFromField(state, "predicate", action.payload);
    },
  },
});

export const {
  nextPrefetchCycle,
  nextDecoderCycle,
  nextJumpTableCycle,
  nextFunctionalUnitCycle,
  nextVliwHeaderTableCycle,
  nextVliwTableCycle,
  nextReserveStationCycle,
  nextReorderBufferMapperCycle,
  nextReorderBufferCycle,
  nextRegistersCycle,
  nextMemoryCycle,
  nextCycle,
  currentPC,
  nextInstructionsCommited,
  nextTotalCommited,
  nextUnitsUsage,
  nextStatusesCount,
  nextInstructionsStatusesAverageCycles,
  superscalarLoad,
  viewBasicBlocks,
  addMemoryInterval,
  removeMemoryInterval,
  addGeneralRegistersInterval,
  removeGeneralRegistersInterval,
  addFloatingRegistersInterval,
  removeFloatingRegistersInterval,
  pushHistory,
  takeHistory,
  resetHistory,
  nextNatFprCycle,
  nextNatGprCycle,
  nextPredicateCycle,
  addNatFprInterval,
  addNatGprInterval,
  addPredicateInterval,
  removeNatFprInterval,
  removeNatGprInterval,
  removePredicateInterval,
} = machineSlice.actions;

export const MachineReducers = machineSlice.reducer;
