import { Opcode, OpcodeMnemonic } from "./Opcode";


export enum InstructionFormat {
  TwoGeneralRegisters = 0, // OP R1, R2, R3
  TwoFloatingRegisters = 1, // OP F1, F2, F3
  GeneralRegisterAndInmediate = 2, // OP R1, R2, #X
  GeneralLoadStore = 3, // OP R1, X(R2)
  FloatingLoadStore = 4, // OP F1, X(R2)
  Jump = 5, // OP R1, R2, label
  Noop = 6, // NOP
}

interface Operand {
  a: string;
}

export interface Instruction {

}

export class Instruction {
  readonly id: number;
  readonly basicBlock: number;
  readonly opcode: Opcode;
  readonly operands: Operand[];
  readonly label: string;
  readonly breakpoint = false;

  constructor(from?: Instruction, protected _uid?: number) {
    if (from) {
      this.id = from.id;
      this.basicBlock = from.basicBlock;
      this.opcode = from.opcode;
      this.operands = from.operands.slice();
      this.breakpoint = from.breakpoint;
    }
  }

  toString(): string {
    return `${this.opcode.mnemonic} ${this.operands}`;
  }

  /**
   * isJumpInstruction - this method checks if the instruction is a jump instruction
   */
  public isJumpInstruction(): boolean {
    return [OpcodeMnemonic.BNE, OpcodeMnemonic.BEQ, OpcodeMnemonic.BGT].includes(this.opcode);
  }

  /**
   * isLoadInstruction - this method checks if the instruction that loads from memory
   */
  public isLoadInstruction() {
    return [OpcodeMnemonic.LW, OpcodeMnemonic.LF].includes(this.opcode);
  }

  /**
   * isStoreInstruction - this method checks if the instruction that stores from memory
   */
  public isStoreInstruction(): boolean {
    return [OpcodeMnemonic.SF, OpcodeMnemonic.SW].includes(this.opcode);
  }

  /**
   * isRegisterInstruction - this method checks if the instruction writes to a register
   */
  public isRegisterInstruction(): boolean {
    return (
      !this.isJumpInstruction() &&
      !this.isStoreInstruction() &&
      ![OpcodeMnemonic.NOP, OpcodeMnemonic.OPERROR].includes(this.opcode)
    );
  }

  /**
   * isDestinyRegisterFloat
   */
  public isDestinyRegisterFloat(): boolean {
    return [
      OpcodeMnemonic.ADDF,
      OpcodeMnemonic.SUBF,
      OpcodeMnemonic.MULTF,
      OpcodeMnemonic.LF,
      OpcodeMnemonic.SF,
    ].includes(this.opcode);
  }

  /**
   * getDestinyRegister - this method returns the destiny register of the instruction or -1 if it doesn't have one
   */
  public getDestinyRegister(): number {
    switch (this.opcode) {
      case OpcodeMnemonic.ADD:
      case OpcodeMnemonic.SUB:
      case OpcodeMnemonic.MULT:
      case OpcodeMnemonic.OR:
      case OpcodeMnemonic.AND:
      case OpcodeMnemonic.NOR:
      case OpcodeMnemonic.XOR:
      case OpcodeMnemonic.SLLV:
      case OpcodeMnemonic.SRLV:
      case OpcodeMnemonic.ADDI:
      case OpcodeMnemonic.ADDF:
      case OpcodeMnemonic.SUBF:
      case OpcodeMnemonic.MULTF:
      case OpcodeMnemonic.LW:
      case OpcodeMnemonic.LF:
        return this.operands[0];
      default:
        return -1;
    }
  }

  /**
   * isFirstOperandFloat
   */
  public isFirstOperandFloat(): boolean {
    return [OpcodeMnemonic.ADDF, OpcodeMnemonic.SUBF, OpcodeMnemonic.MULTF, OpcodeMnemonic.SF].includes(
      this.opcode
    );
  }

  /**
   * getFirstOperandRegister - this method returns the frist operand register of the instruction or -1 if it doesn't have one
   */
  public getFirstOperandRegister(): number {
    switch (this.opcode) {
      case OpcodeMnemonic.ADD:
      case OpcodeMnemonic.SUB:
      case OpcodeMnemonic.MULT:
      case OpcodeMnemonic.OR:
      case OpcodeMnemonic.AND:
      case OpcodeMnemonic.NOR:
      case OpcodeMnemonic.XOR:
      case OpcodeMnemonic.SLLV:
      case OpcodeMnemonic.SRLV:
      case OpcodeMnemonic.ADDI:
      case OpcodeMnemonic.ADDF:
      case OpcodeMnemonic.SUBF:
      case OpcodeMnemonic.MULTF:
        return this.operands[1];
      case OpcodeMnemonic.SW:
      case OpcodeMnemonic.SF:
      case OpcodeMnemonic.BEQ:
      case OpcodeMnemonic.BNE:
      case OpcodeMnemonic.BGT:
        return this.operands[0];
      default:
        return -1;
    }
  }

  /**
   * isSecondOperandFloat
   */
  public isSecondOperandFloat(): boolean {
    return [OpcodeMnemonic.ADDF, OpcodeMnemonic.SUBF, OpcodeMnemonic.MULTF].includes(this.opcode);
  }

  /**
   * getSecondOperandRegister - this method returns the second operand register of the instruction or -1 if it doesn't have one
   */
  public getSecondOperandRegister(): number {
    switch (this.opcode) {
      case OpcodeMnemonic.ADD:
      case OpcodeMnemonic.SUB:
      case OpcodeMnemonic.MULT:
      case OpcodeMnemonic.OR:
      case OpcodeMnemonic.AND:
      case OpcodeMnemonic.NOR:
      case OpcodeMnemonic.XOR:
      case OpcodeMnemonic.SLLV:
      case OpcodeMnemonic.SRLV:
      case OpcodeMnemonic.ADDF:
      case OpcodeMnemonic.SUBF:
      case OpcodeMnemonic.MULTF:
      case OpcodeMnemonic.SW:
      case OpcodeMnemonic.SF:
      case OpcodeMnemonic.LW:
      case OpcodeMnemonic.LF:
        return this.operands[2];
      case OpcodeMnemonic.BEQ:
      case OpcodeMnemonic.BNE:
      case OpcodeMnemonic.BGT:
        return this.operands[1];

      default:
        return -1;
    }
  }

  /**
   * getAddressOperand - this method returns the address operand of the instruction or -1 if it doesn't have one
   */
  public getAddressOperand(): number {
    switch (this.opcode) {
      case OpcodeMnemonic.SW:
      case OpcodeMnemonic.SF:
      case OpcodeMnemonic.LW:
      case OpcodeMnemonic.LF:
        return this.operands[1];
      case OpcodeMnemonic.BEQ:
      case OpcodeMnemonic.BNE:
      case OpcodeMnemonic.BGT:
        return this.operands[2];
      default:
        return -1;
    }
  }

  /**
   * hasImmediateOperand - this method checks if the instruction has an immediate operand
   */
  public hasImmediateOperand(): boolean {
    return this.opcode === OpcodeMnemonic.ADDI;
  }

  /**
   * getImmediateOperand - this method returns the immediate operand of the instruction or -1 if it doesn't have one
   */
  public getImmediateOperand(): number {
    return this.opcode === OpcodeMnemonic.ADDI ? this.operands[2] : -1;
  }

  public toggleBreakPoint() {
    this.breakpoint = !this.breakpoint;
  }

  public getFunctionalUnitType(): FunctionalUnitKind {
    return opcodeToFunctionalUnit(this.opcode);
  }
}
