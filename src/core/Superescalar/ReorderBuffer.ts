import { SuperStage, stageToString } from "./SuperescalarEnums";
import type { Instruction } from "../Common/Instruction";

export interface VisualReorderBufferEntry {
  instruction: {
    id: string;
    uid: number;
    value: string;
  };
  destinyRegister: string;
  value: string;
  address: string;
  superStage: string;
}

interface ReorderBufferEntry {
  instruction: Instruction;
  ready: boolean;
  value: number;
  destinyRegister: number;
  address: number;
  superStage: SuperStage;
}

// TODO: dont use rob entry pos as a reference to the instruction, use an instruction uid instead?
export class ReorderBuffer {
  _queue: ReorderBufferEntry[] = [];
  _GprMapping: { [reg: number]: number } = {};
  _FprMapping: { [reg: number]: number } = {};

  public get size() {
    return this._size;
  }

  public get usage() {
    return this._queue.length / this._size;
  }

  constructor(private _size: number) {}

  /**
   * isFull - this method checks if the reorder buffer is full
   */
  public isFull(): boolean {
    return this._queue.length >= this._size;
  }

  /**
   * isEmpty - this method checks if the reorder buffer is empty
   */
  public isEmpty(): boolean {
    return this._queue.length === 0;
  }

  /**
   * isRegisterValueReady - this method checks if the rob entry wich will write in that register has already the new value
   */
  public isRegisterValueReady(
    register: number,
    isFloatRegister: boolean
  ): boolean {
    const mapping = isFloatRegister ? this._FprMapping : this._GprMapping;
    if (mapping[register] === undefined) {
      // error
      throw new Error("Register not found in mapping");
    }
    const entry = this._queue[this.getInstructionPos(mapping[register])];
    return entry.ready;
  }

  /**
   * getRegisterValue - this method returns the new value of a register wich still has not been written to the register file
   */
  public getRegisterValue(register: number, isFloatRegister: boolean): number {
    const mapping = isFloatRegister ? this._FprMapping : this._GprMapping;
    if (mapping[register] === undefined) {
      // error
      throw new Error("Register not found in mapping");
    }
    const entry = this._queue[this.getInstructionPos(mapping[register])];
    return entry.value;
  }

  /**
   * getRegisterMapping - this method returns the rob instr uid wich will write in that register.
   */
  public getRegisterMapping(
    register: number,
    isFloatRegister: boolean
  ): number {
    const mapping = isFloatRegister ? this._FprMapping : this._GprMapping;
    if (mapping[register] === undefined) {
      // error
      throw new Error("Register not found in mapping");
    }
    return mapping[register];
  }

  /**
   * canCommitStoreInstruction - this checks that the next instruction is an instruction that writes to a memory region and if it is ready to be commited
   */
  public canCommitStoreInstruction(): boolean {
    const entry = this._queue[0];
    return (
      entry?.ready &&
      entry.instruction.isStoreInstruction()
    );
  }

  /**
   * canCommitJumpInstruction - this checks that the next instruction to be commited is a jump instruction and if it is ready to be commited
   */
  public canCommitJumpInstruction(): boolean {
    const entry = this._queue[0];
    return (
      entry?.ready && entry.instruction.isJumpInstruction()
    );
  }

  /**
   * canCommitRegisterInstruction - this checks that the next instruction to be commited is an instruction that writes to a register and if it is ready to be commited
   */
  public canCommitRegisterInstruction(): boolean {
    const entry = this._queue[0];
    return (
      entry?.ready &&
      entry.instruction.isRegisterInstruction()
    );
  }

  /**
   * commitInstruction - this method commits an instruction from the reorder buffer, returning their uid
   */
  public commitInstruction(): number {
    const e = this._queue.shift();
    return e ? e.instruction.uid : -1;
  }

  /**
   * purgeCommitMapping - this method removes the mapping of the register of the instruction that is going to be commited. Returns true if no more instructions have a mapping to that register
   */
  public purgeCommitMapping(): boolean {
    const mapping = this._queue[0].instruction.isDestinyRegisterFloat()
      ? this._FprMapping
      : this._GprMapping;
    const register = this._queue[0].destinyRegister;
    const uid = this._queue[0].instruction.uid;

    if (mapping[register] === uid) {
      delete mapping[register];
      return true;
    }
    return false;
  }

  /**
   * issueInstruction - this method issues an instruction to the reorder buffer
   */
  public issueInstruction(instruction: Instruction) {
    const newEntry = {
      instruction: instruction,
      ready: false,
      value: 0.0,
      destinyRegister: instruction.getDestinyRegister(),
      address: -1,
      superStage: SuperStage.SUPER_ISSUE,
    };
    this._queue.push(newEntry) - 1;

    if (instruction.getDestinyRegister() !== -1) {
      if (instruction.isDestinyRegisterFloat()) {
        this._FprMapping[instruction.getDestinyRegister()] = instruction.uid;
      } else {
        this._GprMapping[instruction.getDestinyRegister()] = instruction.uid;
      }
    }
  }

  public getInstructionPos(uid: number): number {
    for (let i = 0; i < this._queue.length; i++) {
      if (this._queue[i].instruction.uid === uid) {
        return i;
      }
    }
    return -1;
  }

  /**
   * executeInstruction - this method executes an instruction from the reorder buffer
   */
  public executeInstruction(uid: number) {
    this._queue[this.getInstructionPos(uid)].superStage =
      SuperStage.SUPER_EXECUTE;
  }

  /**
   * writeResultValue - this method writes the result value of an instruction to the reorder buffer
   */
  public writeResultValue(uid: number, value: number) {
    const pos = this.getInstructionPos(uid);
    this._queue[pos].value = value;
    this._queue[pos].ready = true;
    this._queue[pos].superStage = SuperStage.SUPER_WRITERESULT;
  }

  public getInstruction(uid = -1): Instruction {
    const pos = uid === -1 ? 0 : this.getInstructionPos(uid);
    return this._queue[pos].instruction;
  }

  /**
   * writeResultAddress - this method writes the result address of an instruction to the reorder buffer
   */
  public writeResultAddress(uid: number, address: number) {
    const pos = this.getInstructionPos(uid);
    this._queue[pos].address = address;
  }

  /**
   * hasResultValue - this method checks if an instruction has already the result value
   */
  public hasResultValue(uid: number): boolean {
    const pos = this.getInstructionPos(uid);
    return this._queue[pos].ready;
  }

  /**
   * getResultValue - this method returns the result value of the top instruction
   */
  public getResultValue(): number {
    return this._queue[0].value;
  }

  /**
   * hasResultAddress - this method checks if an instruction has already the result address
   */
  public hasResultAddress(uid: number): boolean {
    const pos = this.getInstructionPos(uid);
    return this._queue[pos].address !== -1;
  }

  /**
   * getResultAddress - this method returns the result address of the top instruction
   */
  public getResultAddress(): number {
    return this._queue[0].address;
  }

  /**
   * hasPreviousStores - this method checks if there are previous store instructions that write to the same address
   */
  public hasPreviousStores(uid: number): boolean {
    const pos = this.getInstructionPos(uid);
    const address = this._queue[pos].address;
    for (let i = 0; i < pos; i++) {
      // check if it is a store instruction and if it the address is the same or if it doesn't have a result address yet
      if (
        this._queue[i].instruction.isStoreInstruction() &&
        (this._queue[pos].address === -1 || this._queue[i].address === address)
      ) {
        return true;
      }
    }
    return false;
  }

  public getVisualData(): VisualReorderBufferEntry[] {
    return this._queue.map((entry) => {
      if (entry != null) {
        const aux = {
          instruction: { id: "", uid: -1, value: "" },
          destinyRegister:
            entry.destinyRegister !== -1 ?  `${entry.destinyRegister}` : "-",
          value: `${entry.value}`,
          address: entry.address !== -1 ? `@${entry.address}` : "-",
          superStage: stageToString(entry.superStage),
        };
        if (entry.instruction != null) {
          if (entry.destinyRegister !== -1) {
            if (entry.instruction.isDestinyRegisterFloat()) {
              aux.destinyRegister = `F${aux.destinyRegister}`;
            } else {
              aux.destinyRegister = `R${aux.destinyRegister}`;
            }
          }
          aux.instruction.id = `${entry.instruction.id}`;
          aux.instruction.uid = entry.instruction.uid;
          aux.instruction.value = entry.instruction.toString();
        }
        return aux;
      }
      return {
        instruction: { id: "", uid: -1, value: "" },
        destinyRegister: "",
        value: "",
        address: "",
        superStage: "",
      };
    });
  }

  public getVisualRegisterMap(isFloat: boolean): { [reg: string]: number } {
    const mapping = isFloat ? this._FprMapping : this._GprMapping;

    const visualMap: { [reg: string]: number } = {};
    for (const key in mapping) {
      visualMap[(isFloat ? "F" : "R") + key] = this.getInstructionPos(
        mapping[key]
      );
    }
    return visualMap;
  }

  public getVisualInstructionMap(): { [uid: number]: number } {
    const visualMap: { [uid: string]: number } = {};
    for (let i = 0; i < this._queue.length; i++) {
      visualMap[this._queue[i].instruction.uid] = i;
    }
    return visualMap;
  }
}
