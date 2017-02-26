import { Instruction } from './Instruction';
import { Status } from './Status';

export enum FunctionalUnitType {
    INTEGERSUM = 0,
    INTEGERMULTIPLY,
    FLOATINGSUM,
    FLOATINGMULTIPLY,
    MEMORY,
    JUMP
}

export class FunctionalUnit {

    private _status: Status;

    private _type: FunctionalUnitType;
    private _latency: number;
    // TODO Cauce?
    private _cauce: Instruction[];


    constructor() {
        this._cauce = null;
        this._status = new Status();
        this._status.lastInstruction = 0;
        this._status.stall = 0;
        this._status.instructionNumber = 0;
    }


    public get status(): Status {
        return this._status;
    }

    public set status(value: Status) {
        this._status = value;
    }

    public get type(): FunctionalUnitType {
        return this._type;
    }

    public set type(value: FunctionalUnitType) {
        this._type = value;
    }


    public get latency(): number {
        return this._latency;
    }

    public set latency(value: number) {
        this._latency = value;
        this._status.lastInstruction = value - 1;
        this._status.instructionNumber = 0;
        this._cauce = new Array(value);
    }


    public get cauce(): Instruction[] {
        return this._cauce;
    }

    public set cauce(value: Instruction[]) {
        this._cauce = value;
    }

    tic() {
        if (this._status.stall === 0) {
            if (this._cauce[this._status.lastInstruction] != null) {
                this._cauce[this._status.lastInstruction] = null;
                this._status.instructionNumber--;
            }
            // WTF is this line?
            this._status.lastInstruction = (this._latency + this._status.lastInstruction - 1) % this._latency;
        } else {
            this._status.stall--;
        }

    }

    fillCauce(instruction: Instruction): number {
        this._cauce[(this._status.lastInstruction + 1) % this._latency] = instruction;
        if (instruction != null) {
            this._status.instructionNumber++;
        }

        return (this._status.lastInstruction + 1) % this._latency;
    }

    clean() {
        this._cauce = new Array(this._latency);
        this._status.lastInstruction = this._latency - 1;
        this._status.stall = 0;
        this._status.instructionNumber = 0;
    }

    getTopInstruction(): Instruction {
        return this._cauce[this._status.lastInstruction];
    }

    getInstructionByIndex(index: number): Instruction {
        return this._cauce[(this._status.lastInstruction + index + 1) % this._latency];
    }
}