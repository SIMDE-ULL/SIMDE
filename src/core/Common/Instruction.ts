import { OpcodesNames, Opcodes } from './Opcodes';
import { FunctionalUnitType } from './FunctionalUnit';
import { opcodeToFunctionalUnit } from './Opcodes';

export class Instruction {
    public id: number;
    public basicBlock: number;
    public opcode: number;
    protected _uuid: number;
    protected _operands: number[];
    protected _operandsString: string[];
    protected _label: string;
    protected _breakPoint: boolean;

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

    constructor() {
        this._breakPoint = false;
        this._operands = new Array(3);
        this._operandsString = new Array(3);
    }

    instantiate(from: Instruction, cycle: number) {
        this.copy(from);
        this._uuid = cycle * 1000 + this.id;
    }

    copy(other: Instruction) {
        this.id = other.id;
        this.basicBlock = other.basicBlock;
        this.opcode = other.opcode;
        this._operands = other.operands.slice();
        this._operandsString = other.operandsString.slice();
        this._breakPoint = other.breakPoint;
    }

    toString(): string {
        let aux: string = '';
        if (this._operandsString[1]) {
            aux += ' ' + this._operandsString[1];
        }
        if (this._operandsString[2]) {
            aux += ' ' + this._operandsString[2];
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
        return this.opcode === Opcodes.BNE || this.opcode === Opcodes.BEQ || this.opcode === Opcodes.BGT;
    }

    /**
     * isLoadInstruction - this method checks if the instruction that loads from memory
     */
    public isLoadInstruction() {
        return this.opcode === Opcodes.LW || this.opcode === Opcodes.LF;
    }

    /**
     * isStoreInstruction - this method checks if the instruction that stores from memory
     */
    public isStoreInstruction(): boolean {
        return this.opcode === Opcodes.SW || this.opcode === Opcodes.SF;
    }

    /**
     * isRegisterInstruction - this method checks if the instruction writes to a register
     */
    public isRegisterInstruction(): boolean {
        return !this.isJumpInstruction() && !this.isStoreInstruction() && this.opcode !== Opcodes.NOP && this.opcode !== Opcodes.OPERROR;
    }

    /**
     * isDestinyRegisterFloat
     */
    public isDestinyRegisterFloat(): boolean {
        return this.opcode === Opcodes.ADDF || this.opcode === Opcodes.SUBF || this.opcode === Opcodes.MULTF || this.opcode === Opcodes.LF || this.opcode === Opcodes.SF;
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
        return this.opcode === Opcodes.ADDF || this.opcode === Opcodes.SUBF || this.opcode === Opcodes.MULTF || this.opcode === Opcodes.SF;
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
        return this.opcode === Opcodes.ADDF || this.opcode === Opcodes.SUBF || this.opcode === Opcodes.MULTF;
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
        switch (this.opcode) {
            case Opcodes.ADDI:
                return this.operands[2];
            default:
                return -1;
        }
    }

    public toggleBreakPoint() {
        this._breakPoint = !this._breakPoint;
    }

    public getFunctionalUnitType(): FunctionalUnitType {
        return opcodeToFunctionalUnit(this.opcode);
    }
}
