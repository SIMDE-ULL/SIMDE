import type { Instruction } from "./Instruction";
import type { Opcode } from "./Opcode";

export enum FunctionalUnitKind {
  INTEGERSUM = 0,
  INTEGERMULTIPLY = 1,
  FLOATINGSUM = 2,
  FLOATINGMULTIPLY = 3,
  MEMORY = 4,
  JUMP = 5,
}

export const FunctionalUnitTypeNames: string[] = [
  "Integer Sum",
  "Integer Multiply",
  "Floating Sum",
  "Floating Multiply",
  "Memory",
  "Jump",
];

export const FUNCTIONALUNITTYPESQUANTITY =
  FunctionalUnitKind.JUMP - FunctionalUnitKind.INTEGERSUM + 1;

export interface FunctionalUntitVisualEntry {
  id: number;
  value: string;
  uid: number;
}

const FunctionalUnitLantencies: Record<FunctionalUnitKind, number> = {
  [FunctionalUnitKind.INTEGERSUM]: 1,
  [FunctionalUnitKind.INTEGERMULTIPLY]: 2,
  [FunctionalUnitKind.FLOATINGSUM]: 4,
  [FunctionalUnitKind.FLOATINGMULTIPLY]: 6,
  [FunctionalUnitKind.MEMORY]: 4,
  [FunctionalUnitKind.JUMP]: 2,
};

export const FunctionalUnitNumbers: Record<FunctionalUnitKind, number> = {
  [FunctionalUnitKind.INTEGERSUM]: 2,
  [FunctionalUnitKind.INTEGERMULTIPLY]: 2,
  [FunctionalUnitKind.FLOATINGSUM]: 2,
  [FunctionalUnitKind.FLOATINGMULTIPLY]: 2,
  [FunctionalUnitKind.MEMORY]: 2,
  [FunctionalUnitKind.JUMP]: 1,
};

export interface FunctionalUnitResult {
  instruction: Instruction;
  result: number;
  ref: number; // TODO: use instruction uid
}

interface FunctionalUnitInstruction {
  instruction: Instruction;
  ref: number; // TODO: use instruction uid
  blankTimeUnitsAhead: number; // how many time units ahead are blank, i.e. how many time units need to pass before the instruction can be executed
}

export class FunctionalUnit {
  private _stalled = 0; // if >0, it is stalling (for ex because a memory fail) for that many cycles
  private _instructions: FunctionalUnitInstruction[] = [];

  private _nextRef = 0; //TODO: use instruction uid
  private _currentBlankTimeUnits: number;
  private _hasExectutedInstBeforeTick = false;

  public get type(): FunctionalUnitKind {
    return this._type;
  }

  public get latency(): number {
    return this._latency;
  }

  public get usage(): number {
    return this._instructions.length / this._latency;
  }

  constructor(
    private _type: FunctionalUnitKind,
    private _latency: number = FunctionalUnitLantencies[_type]
  ) {
    this._currentBlankTimeUnits = this._latency - 1;
  }

  public tic() {
    if (this.isStalled()) {
      // only decrease stall time
      this._stalled--;
      return;
    }

    if (!this.isEmpty() && !this._hasExectutedInstBeforeTick) {
      //decrement blank time units of the next instruction to be executed
      if (this._instructions[0].blankTimeUnitsAhead == 0) {
        // If an instruction has 0 blank time units ahead, it means it was behind another
        // or it wasnt executed and should be dropped
        // If no instruction was executed in this cycle,
        // it means that this instruction was skipped
        //TODO: throw error
        this._instructions.shift();
      } else {
        // decrease blank time units, only if no instruction was executed in this cycle
        this._instructions[0].blankTimeUnitsAhead--;
      }
    }

    this._hasExectutedInstBeforeTick = false;
    // Acumulate blank time units for the next instruction to be pushed
    this._currentBlankTimeUnits++;
    this._currentBlankTimeUnits = Math.min(
      this._currentBlankTimeUnits,
      this._latency - 1
    ); // it cannot be more than the latency
  }

  public stall(time: number) {
    this._stalled = time;
  }

  // We can push an instruction to the functional unit if it is free
  public isFree(): boolean {
    return this._currentBlankTimeUnits !== -1; // if it is -1, it means that an instruction was just pushed but tic() was not called yet
  }

  public isEmpty(): boolean {
    return this._instructions.length == 0;
  }

  public isStalled(): boolean {
    return this._stalled > 0;
  }

  public getReadyInstructionUid(): number {
    return this._instructions.length > 0 &&
      this._instructions[0].blankTimeUnitsAhead == 0
      ? this._instructions[0].instruction.uid
      : -1;
  }

  // return the execution result of the instruction ready in the current cycle, or null if none
  public executeReadyInstruction(
    firstValue: number = 0,
    secondValue: number = 0
  ): FunctionalUnitResult {
    if (
      this._instructions.length == 0 ||
      this._instructions[0].blankTimeUnitsAhead > 0
    ) {
      return null;
    }

    let instruction = this._instructions[0].instruction;
    let opcode = instruction.opcode;
    let ref = this._instructions[0].ref;
    this._instructions.shift();

    // execute it
    let resul: number;
    switch (opcode) {
      case OpcodeMnemonic.ADD:
      case OpcodeMnemonic.ADDI:
      case OpcodeMnemonic.ADDF:
        resul = firstValue + secondValue;
        break;
      case OpcodeMnemonic.SUB:
      case OpcodeMnemonic.SUBF:
        resul = firstValue - secondValue;
        break;
      case OpcodeMnemonic.OR:
        resul = firstValue | secondValue;
        break;
      case OpcodeMnemonic.AND:
        resul = firstValue & secondValue;
        break;
      case OpcodeMnemonic.XOR:
        resul = firstValue ^ secondValue;
        break;
      case OpcodeMnemonic.NOR:
        resul = ~(firstValue | secondValue);
        break;
      case OpcodeMnemonic.SRLV:
        resul = firstValue >> secondValue;
        break;
      case OpcodeMnemonic.SLLV:
        resul = firstValue << secondValue;
        break;
      case OpcodeMnemonic.MULT:
      case OpcodeMnemonic.MULTF:
        resul = firstValue * secondValue;
        break;
      case OpcodeMnemonic.BEQ:
        resul = firstValue === secondValue ? 1 : 0;
        break;
      case OpcodeMnemonic.BNE:
        resul = firstValue !== secondValue ? 1 : 0;
        break;
      case OpcodeMnemonic.BGT:
        resul = firstValue > secondValue ? 1 : 0;
        break;
      default:
        resul = -1;
        break;
    }

    this._hasExectutedInstBeforeTick = true;

    return { instruction: instruction, result: resul, ref: ref };
  }

  // return instruction reference (TODO: use instruction uid)
  public addInstruction(instruction: Instruction): number {
    let ref = this._nextRef++;
    let blankTimeUnitsAhead =
      this._currentBlankTimeUnits > 0 ? this._currentBlankTimeUnits : 0;
    this._instructions.push({
      instruction: instruction,
      ref: ref,
      blankTimeUnitsAhead: blankTimeUnitsAhead,
    });
    this._currentBlankTimeUnits = -1; // hack: -1 because it will be incremented to 0, as tic() should be called after this
    return ref;
  }

  public getInstruction(id: number): Instruction {
    for (let i = 0; i < this._instructions.length; i++) {
      if (this._instructions[i].instruction.id === id) {
        return this._instructions[i].instruction;
      }
    }
    return null;
  }

  public getVisualData(): FunctionalUntitVisualEntry[] {
    let list = [];
    let lastPos = 0;
    let j = 0;
    for (let i = 0; i < this._latency; i++) {
      if (
        this._instructions[j] != null &&
        this._instructions[j].blankTimeUnitsAhead === i - lastPos
      ) {
        list.push({
          id: this._instructions[j].instruction.id,
          value: this._instructions[j].instruction.toString(),
          uid: this._instructions[j].instruction.uid,
        });
        j++;
        lastPos = i + 1;
      } else {
        list.push({ id: -1, value: "", uid: -1 });
      }
    }

    return list;
  }

  public static newFromOpcode(opcode: Opcode) {
    switch (opcode.mnemonic) {
      case OpcodeMnemonic.ADD:
      case OpcodeMnemonic.ADDI:
      case OpcodeMnemonic.SUB:
      case OpcodeMnemonic.OR:
      case OpcodeMnemonic.AND:
      case OpcodeMnemonic.NOR:
      case OpcodeMnemonic.XOR:
      case OpcodeMnemonic.SLLV:
      case OpcodeMnemonic.SRLV:
        return FunctionalUnitKind.INTEGERSUM;
      case OpcodeMnemonic.ADDF:
      case OpcodeMnemonic.SUBF:
        return FunctionalUnitKind.FLOATINGSUM;
      case OpcodeMnemonic.MULT:
        return FunctionalUnitKind.INTEGERMULTIPLY;
      case OpcodeMnemonic.MULTF:
        return FunctionalUnitKind.FLOATINGMULTIPLY;
      case OpcodeMnemonic.SW:
      case OpcodeMnemonic.SF:
      case OpcodeMnemonic.LW:
      case OpcodeMnemonic.LF:
        return FunctionalUnitKind.MEMORY;
      case OpcodeMnemonic.BGT:
      case OpcodeMnemonic.BNE:
      case OpcodeMnemonic.BEQ:
        return FunctionalUnitKind.JUMP;
    }
  } 
}
