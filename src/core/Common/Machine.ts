import { Register } from './Register';
import { FunctionalUnit, FUNCTIONALUNITTYPESQUANTITY, FunctionalUnitType } from './FunctionalUnit';
import { Memory } from './Memory';
import { MachineStatus } from './MachineStatus';

const MACHINE_REGISTER_SIZE = 64;
const MACHINE_MEMORY_SIZE = 1024;

export class Machine {

    // Const properties
    protected static NUF_MAX: number[] = [10, 10, 10, 10, 10, 10];
    protected static NUF_MIN: number[] = [1, 1, 1, 1, 1, 1];
    protected static NUF_DEF: number[] = [2, 2, 2, 2, 2, 1];

    protected static MEMORYFAILLATENCYDEF = 9;
    protected static MEMORYFAILLATENCYMIN = 0;
    protected static MEMORYFAILLATENCYMAX = 100;

    public static MEMORY_SIZE: number = MACHINE_MEMORY_SIZE;
    protected static WORD_SIZE: number = 32;
    public static NGP: number = MACHINE_REGISTER_SIZE;
    public static NFP: number = MACHINE_REGISTER_SIZE;

    public _functionalUnitNumbers: number[];
    protected _functionalUnitLatencies: number[];
    protected _memoryFailLatency: number;

    protected _gpr: Register;
    protected _fpr: Register;

    protected _functionalUnit: FunctionalUnit[][];
    protected _memory: Memory;
    protected _pc: number;
    protected _status: MachineStatus;

    public get functionalUnitNumbers(): number[] {
        return this._functionalUnitNumbers;
    }

    public set functionalUnitNumbers(value: number[]) {
        this._functionalUnitNumbers = value;
    }

    public get memoryFailLatency(): number {
        return this._memoryFailLatency;
    }

    public set memoryFailLatency(value: number) {
        this._memoryFailLatency = value;
    }

    public get functionalUnit(): FunctionalUnit[][] {
        return this._functionalUnit;
    }

    public set functionalUnit(value: FunctionalUnit[][]) {
        this._functionalUnit = value;
    }

    public get memory(): Memory {
        return this._memory;
    }

    public set memory(value: Memory) {
        this._memory = value;
    }

    public get pc(): number {
        return this._pc;
    }

    public set pc(value: number) {
        this._pc = value;
    }

    public get status(): MachineStatus {
        return this._status;
    }

    public set status(value: MachineStatus) {
        this._status = value;
    }

    public get gpr(): Register {
        return this._gpr;
    }

    public get fpr(): Register {
        return this._fpr;
    }

    constructor() {
        this.functionalUnitNumbers = Machine.NUF_DEF.slice();
        this.memoryFailLatency = Machine.MEMORYFAILLATENCYDEF;

        // Init val
        this.status = {
            cycle: 0,
            executing: false,
            breakPoint: false
        };
        this.memory = new Memory(Machine.MEMORY_SIZE);

        this._gpr = new Register(Machine.NGP);
        this._fpr = new Register(Machine.NFP, true); // F0 is writable, not always 0
        this.functionalUnit = new Array(FUNCTIONALUNITTYPESQUANTITY);
        this.functionalUnit.fill(null);
        for (let i = 0; i < FUNCTIONALUNITTYPESQUANTITY; i++) {
            this.functionalUnit[i] = new Array(this._functionalUnitNumbers[i]);
            for (let j = 0; j < this.functionalUnitNumbers[i]; j++) {
                this.functionalUnit[i][j] = new FunctionalUnit(i);
            }
        }
    }

    public init(reset: boolean) {
        this.pc = 0;
        this.functionalUnit.fill(null);
        for (let i = 0; i < FUNCTIONALUNITTYPESQUANTITY; i++) {
            this.functionalUnit[i] = new Array(this._functionalUnitNumbers[i]);
            for (let j = 0; j < this.functionalUnitNumbers[i]; j++) {
                this.functionalUnit[i][j] = new FunctionalUnit(i);
            }
        }
        this.status.cycle = 0;
        this.status.breakPoint = false;
        this.status.executing = false;

        if (reset) {
            this.reset();
        }
    }

    public execute(): void {
        this.status.executing = true;
        this.status.breakPoint = false;
    }

    public stop(): void {
        this.status.executing = false;
    }

    public reset() {
        this._gpr.setAllContent(0);
        this._fpr.setAllContent(0);
        this.memory.clean();
    }

    public getTotalFunctionalUnit(): number {
        let sum = 0;
        for (let i = 0; i < FUNCTIONALUNITTYPESQUANTITY; i++) {
            sum += this.functionalUnitNumbers[i];
        }

        return sum;
    }

    public getGpr(index: number): number {
        return (index >= Machine.NGP || index < 0) ? -1 : this._gpr.content[index];
    }

    public setGpr(index: number, value: number) {
        if (index < Machine.NGP && index >= 0) {
            this._gpr.setContent(index, value, false);
        }
    }

    public getFpr(index: number): number {
        return (index >= Machine.NGP || index < 0) ? -1 : this._fpr.content[index];
    }

    public setFpr(index: number, value: number) {
        if (index < Machine.NGP && index >= 0) {
            this._fpr.setContent(index, value, false);
        }
    }

    public setFunctionalUnitNumber(index: number, quantity: number) {
        this.functionalUnitNumbers[index] = quantity;
    }
}
