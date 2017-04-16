import { Register } from './Register';
import { FunctionalUnit, FUNCTIONALUNITTYPESQUANTITY, FunctionalUnitType } from './FunctionalUnit';
import { Memory } from './Memory';
import { MachineStatus } from './MachineStatus';



export class Machine {

    // Const propierties
    protected static LAT_MAX: number[] = [100, 100, 100, 100, 100, 100];
    protected static LAT_MIN: number[] = [1, 1, 1, 1, 1, 1];
    protected static LAT_DEF: number[] = [1, 2, 4, 6, 4, 2];
    protected static NUF_MAX: number[] = [10, 10, 10, 10, 10, 10];
    protected static NUF_MIN: number[] = [1, 1, 1, 1, 1, 1];
    protected static NUF_DEF: number[] = [2, 2, 2, 2, 2, 1];

    protected static MEMORYFAILLATENCYDEF = 9;
    protected static MEMORYFAILLATENCYMIN = 0;
    protected static MEMORYFAILLATENCYMAX = 100;

    protected static WORD_SIZE: number = 32;
    protected static NGP: number = 64;
    protected static NFP: number = 64;

    protected _functionalUnitNumbers: number[];
    protected _functionalUnitLatencies: number[];
    protected _memoryFailLatency: number;

    protected _gpr: Register;
    protected _fpr: Register;

    protected _functionalUnit: FunctionalUnit[][];
    protected _memory: Memory;
    protected _pc: number;
    protected _status: MachineStatus;

    constructor() {
        // TODO: Update with config values not default values
        this.functionalUnitLatencies = Machine.LAT_DEF.slice();
        this.functionalUnitNumbers = Machine.NUF_DEF.slice();
        this.memoryFailLatency = Machine.MEMORYFAILLATENCYDEF;

        // TODO: Check this
        this.gpr = new Register();
        this.fpr = new Register();

        for (let i = 0; i < FUNCTIONALUNITTYPESQUANTITY; i++) {
            this.functionalUnit[i] = null;
        }
        this.init(true);
    }

    init(reset: boolean) {
        this.pc = 0;
        this.functionalUnit = new Array().fill(null);
        for (let i = 0; i < FUNCTIONALUNITTYPESQUANTITY; i++) {
            this.functionalUnit[i] = new Array().fill(new FunctionalUnit());
            for (let j = 0; j < this.functionalUnitNumbers[i]; j++) {
                this.functionalUnit[i][j].type = FunctionalUnitType[FunctionalUnitType[i]];
                this.functionalUnit[i][j].latency = this.functionalUnitLatencies[i];
            }
        }
        this.status.cycle = 0;
        this.status.breakPoint = false;
        this.status.executing = false;

        if (reset) {
            this.reset();
        }
    }

    execute(): void {
        this.status.executing = true;
        this.status.breakPoint = false;
    }

    stop(): void {
        this.status.executing = false;
    }

    reset() {
        // TODO Check this values, are always fixed?
        this.gpr.content = new Array(Machine.NGP).fill(0);
        this.fpr.content = new Array(Machine.NFP).fill(0);
        this.memory.setMem(0);
    }

    public getTotalFunctionalUnit(): number {
        let sum = 0;
        for (let i = 0; i < FUNCTIONALUNITTYPESQUANTITY; i++) {
            sum += this.functionalUnitNumbers[i];
        }

        return sum;
    }

    public get functionalUnitNumbers(): number[] {
        return this._functionalUnitNumbers;
    }

    public set functionalUnitNumbers(value: number[]) {
        this._functionalUnitNumbers = value;
    }


    public get functionalUnitLatencies(): number[] {
        return this._functionalUnitLatencies;
    }

    public set functionalUnitLatencies(value: number[]) {
        this._functionalUnitLatencies = value;
    }


    public get memoryFailLatency(): number {
        return this._memoryFailLatency;
    }

    public set memoryFailLatency(value: number) {
        this._memoryFailLatency = value;
    }


    public get gpr(): Register {
        return this._gpr;
    }

    public set gpr(value: Register) {
        this._gpr = value;
    }


    public get fpr(): Register {
        return this._fpr;
    }

    public set fpr(value: Register) {
        this._fpr = value;
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
}