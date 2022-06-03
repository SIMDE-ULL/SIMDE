import { Register } from './Register';
import { FunctionalUnit, FUNCTIONALUNITTYPESQUANTITY, FunctionalUnitType } from './FunctionalUnit';
import { Memory } from './Memory';
import { MachineStatus } from './MachineStatus';
import { MACHINE_REGISTER_SIZE } from '../Constants';

export class Machine {

    // Const properties
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
    protected static NGP: number = MACHINE_REGISTER_SIZE;
    protected static NFP: number = MACHINE_REGISTER_SIZE;

    public _functionalUnitNumbers: number[];
    protected _functionalUnitLatencies: number[];
    protected _memoryFailLatency: number;

    protected _gpr: Register;
    protected _fpr: Register;

    protected _functionalUnit: FunctionalUnit[][];
    protected _memory: Memory;
    protected _pc: number;
    protected _status: MachineStatus;

    constructor() {
        this.functionalUnitLatencies = Machine.LAT_DEF.slice();
        this.functionalUnitNumbers = Machine.NUF_DEF.slice();
        this.memoryFailLatency = Machine.MEMORYFAILLATENCYDEF;

        // Init val
        this.status = new MachineStatus();
        this.memory = new Memory();

        this._gpr = new Register();
        this._fpr = new Register();
        this.functionalUnit = new Array(FUNCTIONALUNITTYPESQUANTITY);
        this.functionalUnit.fill(null);
    }

    init(reset: boolean) {
        this.pc = 0;
        this.functionalUnit.fill(null);
        for (let i = 0; i < FUNCTIONALUNITTYPESQUANTITY; i++) {
            this.functionalUnit[i] = new Array(this._functionalUnitNumbers[i]);
            for (let j = 0; j < this.functionalUnitNumbers[i]; j++) {
                this.functionalUnit[i][j] = new FunctionalUnit();
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
        this._gpr.content.fill(0);
        this._fpr.content.fill(0);
        this.memory.setMem(0);
        this.memory.fail.fill(false);
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

    public getGpr(index: number): number {
        return (index >= Machine.NGP || index < 0) ? -1 : this._gpr.getContent(index);
    }

    public setGpr(index: number, value: number) {
        if (index < Machine.NGP && index >= 0) {
            this._gpr.setContent(index, value, false);
        }
    }

    public getFpr(index: number): number {
        return (index >= Machine.NGP || index < 0) ? -1 : this._fpr.getContent(index);
    }

    public setFpr(index: number, value: number) {
        if (index < Machine.NGP && index >= 0) {
            this._fpr.setContent(index, value, false);
        }
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

    public setFunctionalUnitNumber(index: number, quantity: number) {
        this.functionalUnitNumbers[index] = quantity;
    }

    public setFunctionalUnitLatency(index: number, latency: number) {
        this.functionalUnitLatencies[index] = latency;
    }
}
