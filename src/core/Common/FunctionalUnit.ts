import { Instruction } from "./Instruction";
import { Opcodes } from "./Opcodes";

export enum FunctionalUnitType {
  INTEGERSUM = 0,
  INTEGERMULTIPLY,
  FLOATINGSUM,
  FLOATINGMULTIPLY,
  MEMORY,
  JUMP,
}

export let FunctionalUnitTypeNames: string[] = [
  "Integer Sum",
  "Integer Multiply",
  "Floating Sum",
  "Floating Multiply",
  "Memory",
  "Jump",
];

export const FUNCTIONALUNITTYPESQUANTITY =
  FunctionalUnitType.JUMP - FunctionalUnitType.INTEGERSUM + 1;

export interface FunctionalUntitVisualEntry {
  id: number;
  value: string;
  uuid: number;
}

const FunctionalUnitLantencies: Record<FunctionalUnitType, number> = {
  [FunctionalUnitType.INTEGERSUM]: 1,
  [FunctionalUnitType.INTEGERMULTIPLY]: 2,
  [FunctionalUnitType.FLOATINGSUM]: 4,
  [FunctionalUnitType.FLOATINGMULTIPLY]: 6,
  [FunctionalUnitType.MEMORY]: 4,
  [FunctionalUnitType.JUMP]: 2,
};

export const FunctionalUnitNumbers: Record<FunctionalUnitType, number> = {
  [FunctionalUnitType.INTEGERSUM]: 2,
  [FunctionalUnitType.INTEGERMULTIPLY]: 2,
  [FunctionalUnitType.FLOATINGSUM]: 2,
  [FunctionalUnitType.FLOATINGMULTIPLY]: 2,
  [FunctionalUnitType.MEMORY]: 2,
  [FunctionalUnitType.JUMP]: 1,
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
  private _stalled: number; // if >0, it is stalling (for ex because a memory fail) for that many cycles
  private _instructions: FunctionalUnitInstruction[];

  private _nextRef: number; //TODO: use instruction uid
  private _currentBlankTimeUnits: number;
  private _hasExectutedInstBeforeTick: boolean;

  public get type(): FunctionalUnitType {
    return this._type;
  }

  public get latency(): number {
    return this._latency;
  }

  constructor(
    private _type: FunctionalUnitType,
    private _latency: number = FunctionalUnitLantencies[_type]
  ) {
    this.clean();
  }

  public clean() {
    this._stalled = 0;
    this._nextRef = 0;
    this._currentBlankTimeUnits = this._latency - 1;
    this._hasExectutedInstBeforeTick = false;
    this._instructions = [];
  }

  public tic() {
    if (!this.isStalled()) {
      if (!this.isEmpty()) {
        //decrement blank time units of the next instruction to be executed
        if (this._instructions[0].blankTimeUnitsAhead == 0) {
          // If an instruction has 0 blank time units ahead, it means it was behind another
          // or it wasnt executed and should be dropped

          if (!this._hasExectutedInstBeforeTick) {
            // If no instruction was executed in this cycle,
            // it means that this instruction was skipped
            //TODO: throw error
            this._instructions.shift();
          }
        } else {
          // decrease blank time units, only if no instruction was executed in this cycle
          if (!this._hasExectutedInstBeforeTick) {
            this._instructions[0].blankTimeUnitsAhead--;
          }
        }
      }

      this._hasExectutedInstBeforeTick = false;

      // Acumulate blank time units for the next instruction to be pushed
      this._currentBlankTimeUnits++;
      this._currentBlankTimeUnits = Math.min(
        this._currentBlankTimeUnits,
        this._latency - 1
      ); // it cannot be more than the latency
    } else {
      // decrease stall time
      this._stalled--;
    }
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

  public getReadyInstructionUuid(): number {
    return this._instructions.length > 0 &&
      this._instructions[0].blankTimeUnitsAhead == 0
      ? this._instructions[0].instruction.uuid
      : -1;
  }

  // return the execution result of the instruction ready in the current cycle, or null if none
  public executeReadyInstruction(
    firstValue: number = 0,
    secondValue: number = 0
  ): FunctionalUnitResult {
    if (
      this._instructions.length > 0 &&
      this._instructions[0].blankTimeUnitsAhead == 0
    ) {
      let instruction = this._instructions[0].instruction;
      let opcode = instruction.opcode;
      let ref = this._instructions[0].ref;
      this._instructions.shift();

      // execute it
      let resul: number;
      switch (opcode) {
        case Opcodes.ADD:
        case Opcodes.ADDI:
        case Opcodes.ADDF:
          resul = firstValue + secondValue;
          break;
        case Opcodes.SUB:
        case Opcodes.SUBF:
          resul = firstValue - secondValue;
          break;
        case Opcodes.OR:
          resul = firstValue | secondValue;
          break;
        case Opcodes.AND:
          resul = firstValue & secondValue;
          break;
        case Opcodes.XOR:
          resul = firstValue ^ secondValue;
          break;
        case Opcodes.NOR:
          resul = ~(firstValue | secondValue);
          break;
        case Opcodes.SRLV:
          resul = firstValue >> secondValue;
          break;
        case Opcodes.SLLV:
          resul = firstValue << secondValue;
          break;
        case Opcodes.MULT:
        case Opcodes.MULTF:
          resul = firstValue * secondValue;
          break;
        case Opcodes.BEQ:
          resul = firstValue === secondValue ? 1 : 0;
          break;
        case Opcodes.BNE:
          resul = firstValue !== secondValue ? 1 : 0;
          break;
        case Opcodes.BGT:
          resul = firstValue > secondValue ? 1 : 0;
          break;
        default:
          resul = -1;
          break;
      }

      this._hasExectutedInstBeforeTick = true;

      return { instruction: instruction, result: resul, ref: ref };
    } else {
      return null;
    }
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
          uuid: this._instructions[j].instruction.uuid,
        });
        j++;
        lastPos = i + 1;
      } else {
        list.push({ id: -1, value: "", uuid: -1 });
      }
    }

    return list;
  }
}
