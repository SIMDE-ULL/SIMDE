import { OpcodesNames, Opcodes } from "./Opcodes";
import { FunctionalUnitType } from "./FunctionalUnit";
import { opcodeToFunctionalUnit } from "./Opcodes";

export class Instruction {
  public id: number;
  public basicBlock: number;
  public opcode: number;
  protected _operands: number[] = new Array(3);
  protected _operandsString: string[] = new Array(3);
  protected _label: string;
  protected _breakPoint: boolean = false;

  public get uuid(): number {
    return this._uuid;
  }

  public get breakPoint(): boolean {
    return this._breakPoint;
  }

  public get operands(): number[] {
    return this._operands;
  }

  public get label(): string {
    return this._label;
  }

  public set label(value: string) {
    this._label = value;
  }

  public get operandsString(): string[] {
    return this._operandsString;
  }

  constructor(from?: Instruction, protected _uuid?: number) {
    if (from) {
      this.id = from.id;
      this.basicBlock = from.basicBlock;
      this.opcode = from.opcode;
      this._operands = from.operands.slice();
      this._operandsString = from.operandsString.slice();
      this._breakPoint = from.breakPoint;
    }
  }

  toString(): string {
    let aux: string = "";
    if (this._operandsString[1]) {
      aux += " " + this._operandsString[1];
    }
    if (this._operandsString[2]) {
      aux += " " + this._operandsString[2];
    }
    return `${OpcodesNames[this.opcode]} ${this._operandsString[0]} ${aux}`;
  }

  setOperand(index: number, value: number, valueString: string) {
    this._operands[index] = value;
    this.operandsString[index] = valueString;
  }

  getOperand(index: number): number {
    return this._operands[index];
  }

  /**
   * isJumpInstruction - this method checks if the instruction is a jump instruction
   */
  public isJumpInstruction(): boolean {
    return [Opcodes.BNE, Opcodes.BEQ, Opcodes.BGT].includes(this.opcode);
  }

  /**
   * isLoadInstruction - this method checks if the instruction that loads from memory
   */
  public isLoadInstruction() {
    return [Opcodes.LW, Opcodes.LF].includes(this.opcode);
  }

  /**
   * isStoreInstruction - this method checks if the instruction that stores from memory
   */
  public isStoreInstruction(): boolean {
    return [Opcodes.SF, Opcodes.SW].includes(this.opcode);
  }

  /**
   * isRegisterInstruction - this method checks if the instruction writes to a register
   */
  public isRegisterInstruction(): boolean {
    return (
      !this.isJumpInstruction() &&
      !this.isStoreInstruction() &&
      ![Opcodes.NOP, Opcodes.OPERROR].includes(this.opcode)
    );
  }

  /**
   * isDestinyRegisterFloat
   */
  public isDestinyRegisterFloat(): boolean {
    return [
      Opcodes.ADDF,
      Opcodes.SUBF,
      Opcodes.MULTF,
      Opcodes.LF,
      Opcodes.SF,
    ].includes(this.opcode);
  }

  /**
   * getDestinyRegister - this method returns the destiny register of the instruction or -1 if it doesn't have one
   */
  public getDestinyRegister(): number {
    switch (this.opcode) {
      case Opcodes.ADD:
      case Opcodes.SUB:
      case Opcodes.MULT:
      case Opcodes.OR:
      case Opcodes.AND:
      case Opcodes.NOR:
      case Opcodes.XOR:
      case Opcodes.SLLV:
      case Opcodes.SRLV:
      case Opcodes.ADDI:
      case Opcodes.ADDF:
      case Opcodes.SUBF:
      case Opcodes.MULTF:
      case Opcodes.LW:
      case Opcodes.LF:
        return this.operands[0];
      default:
        return -1;
    }
  }

  /**
   * isFirstOperandFloat
   */
  public isFirstOperandFloat(): boolean {
    return [Opcodes.ADDF, Opcodes.SUBF, Opcodes.MULTF, Opcodes.SF].includes(
      this.opcode
    );
  }

  /**
   * getFirstOperandRegister - this method returns the frist operand register of the instruction or -1 if it doesn't have one
   */
  public getFirstOperandRegister(): number {
    switch (this.opcode) {
      case Opcodes.ADD:
      case Opcodes.SUB:
      case Opcodes.MULT:
      case Opcodes.OR:
      case Opcodes.AND:
      case Opcodes.NOR:
      case Opcodes.XOR:
      case Opcodes.SLLV:
      case Opcodes.SRLV:
      case Opcodes.ADDI:
      case Opcodes.ADDF:
      case Opcodes.SUBF:
      case Opcodes.MULTF:
        return this.operands[1];
      case Opcodes.SW:
      case Opcodes.SF:
      case Opcodes.BEQ:
      case Opcodes.BNE:
      case Opcodes.BGT:
        return this.operands[0];
      default:
        return -1;
    }
  }

  /**
   * isSecondOperandFloat
   */
  public isSecondOperandFloat(): boolean {
    return [Opcodes.ADDF, Opcodes.SUBF, Opcodes.MULTF].includes(this.opcode);
  }

  /**
   * getSecondOperandRegister - this method returns the second operand register of the instruction or -1 if it doesn't have one
   */
  public getSecondOperandRegister(): number {
    switch (this.opcode) {
      case Opcodes.ADD:
      case Opcodes.SUB:
      case Opcodes.MULT:
      case Opcodes.OR:
      case Opcodes.AND:
      case Opcodes.NOR:
      case Opcodes.XOR:
      case Opcodes.SLLV:
      case Opcodes.SRLV:
      case Opcodes.ADDF:
      case Opcodes.SUBF:
      case Opcodes.MULTF:
      case Opcodes.SW:
      case Opcodes.SF:
      case Opcodes.LW:
      case Opcodes.LF:
        return this.operands[2];
      case Opcodes.BEQ:
      case Opcodes.BNE:
      case Opcodes.BGT:
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
      case Opcodes.SW:
      case Opcodes.SF:
      case Opcodes.LW:
      case Opcodes.LF:
        return this.operands[1];
      case Opcodes.BEQ:
      case Opcodes.BNE:
      case Opcodes.BGT:
        return this.operands[2];
      default:
        return -1;
    }
  }

  /**
   * hasImmediateOperand - this method checks if the instruction has an immediate operand
   */
  public hasImmediateOperand(): boolean {
    return this.opcode === Opcodes.ADDI;
  }

  /**
   * getImmediateOperand - this method returns the immediate operand of the instruction or -1 if it doesn't have one
   */
  public getImmediateOperand(): number {
    return this.opcode === Opcodes.ADDI ? this.operands[2] : -1;
  }

  public toggleBreakPoint() {
    this._breakPoint = !this._breakPoint;
  }

  public getFunctionalUnitType(): FunctionalUnitType {
    return opcodeToFunctionalUnit(this.opcode);
  }
}
