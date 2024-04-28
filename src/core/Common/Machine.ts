import { Register } from "./Register";
import {
  FunctionalUnit,
  FUNCTIONALUNITTYPESQUANTITY,
  FunctionalUnitType,
  FunctionalUnitNumbers,
} from "./FunctionalUnit";
import { Cache } from "./Cache";
import { Memory } from "./Memory";

const MACHINE_REGISTER_SIZE = 64;
const MACHINE_MEMORY_SIZE = 1024;
const MACHINE_MEMORY_FAIL_LATENCY = 9;

export interface MachineStatus {
  cycle: number;
  executing: boolean;
  breakPoint: boolean;
}

export class Machine {
  protected static MEMORY_FAIL_LATENCY = MACHINE_MEMORY_FAIL_LATENCY;

  public static MEMORY_SIZE: number = MACHINE_MEMORY_SIZE;
  public static NGP: number = MACHINE_REGISTER_SIZE;
  public static NFP: number = MACHINE_REGISTER_SIZE;

  protected _memoryFailLatency: number;

  protected _gpr: Register;
  protected _fpr: Register;

  protected _functionalUnit: FunctionalUnit[][];
  protected _memory: Memory;
  protected _cache: Cache;
  protected _pc: number;
  protected _status: MachineStatus;

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

  public get cache(): Cache {
    return this._cache;
  }

  public set cache(value: Cache) {
    this._cache = value;
    // Proxy the memory access to the cache
    this.resetContent();
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
    this.memoryFailLatency = Machine.MEMORY_FAIL_LATENCY;

    // Init val
    this.status = {
      cycle: 0,
      executing: false,
      breakPoint: false,
    };
    this.memory = new Memory(Machine.MEMORY_SIZE);

    this._gpr = new Register(Machine.NGP);
    this._fpr = new Register(Machine.NFP, true); // F0 is writable, not always 0
    this.functionalUnit = new Array(FUNCTIONALUNITTYPESQUANTITY);
    this.functionalUnit.fill(null);
    for (let i = 0; i < FUNCTIONALUNITTYPESQUANTITY; i++) {
      this.functionalUnit[i] = new Array(FunctionalUnitNumbers[i]);
      for (let j = 0; j < FunctionalUnitNumbers[i]; j++) {
        this.functionalUnit[i][j] = new FunctionalUnit(i);
      }
    }
  }

  public init(resetContent: boolean) {
    this.pc = 0;
    for (let i = 0; i < FUNCTIONALUNITTYPESQUANTITY; i++) {
      for (let j = 0; j < this.functionalUnit[i].length; j++) {
        this.functionalUnit[i][j] = new FunctionalUnit(
          this.functionalUnit[i][j].type,
          this.functionalUnit[i][j].latency
        );
      }
    }
    this.status.cycle = 0;
    this.status.breakPoint = false;
    this.status.executing = false;

    if (resetContent) {
      this.resetContent();
    }
  }

  public execute(): void {
    this.status.executing = true;
    this.status.breakPoint = false;
  }

  public stop(): void {
    this.status.executing = false;
  }

  public resetContent() {
    this._gpr.setAllContent(0);
    this._fpr.setAllContent(0);
    this.memory = new Memory(Machine.MEMORY_SIZE);
    if (this.cache) {
      this.memory.getData = new Proxy(this.memory.getData, this.cache.getHandler);
      this.memory.setData = new Proxy(this.memory.setData, this.cache.setHandler);
    }
  }

  public changeFunctionalUnitLatency(
    type: FunctionalUnitType,
    latency: number
  ) {
    if (latency == 0) {
      return;
    }

    for (let i = 0; i < this.functionalUnit[type].length; i++) {
      this.functionalUnit[type][i] = new FunctionalUnit(type, latency);
    }
  }

  public changeFunctionalUnitNumber(type: FunctionalUnitType, num: number) {
    if (num === 0) {
      return;
    }

    const currentLatency = this.functionalUnit[type][0].latency;
    this.functionalUnit[type] = new Array(num);
    for (let i = 0; i < num; i++) {
      this.functionalUnit[type][i] = new FunctionalUnit(type, currentLatency);
    }
  }

  public getGpr(index: number): number {
    return index >= Machine.NGP || index < 0 ? -1 : this._gpr.content[index];
  }

  public setGpr(index: number, value: number) {
    if (index < Machine.NGP && index >= 0) {
      this._gpr.setContent(index, value, false);
    }
  }

  public getFpr(index: number): number {
    return index >= Machine.NGP || index < 0 ? -1 : this._fpr.content[index];
  }

  public setFpr(index: number, value: number) {
    if (index < Machine.NGP && index >= 0) {
      this._fpr.setContent(index, value, false);
    }
  }
}
