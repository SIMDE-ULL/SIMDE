import { Instruction } from './Instruction';

export interface Status {
    instructionNumber: number;
    lastInstruction: Instruction;
    stall: number;
}

export enum FunctionalUnitType {
    INTEGERSUM = 0,
    INTEGERMULTIPLY,
    FLOATINGSUM,
    FLOATINGMULTIPLY,
    MEMORY,
    JUMP
}

export class FunctionalUnit {

    private status: Status;

    private type: FunctionalUnitType;
    latency: number;
    // TODO Cauce?
    cauce: Instruction;
}