import { OpcodesNames, Opcodes } from './Opcodes';

export class Instruction {
    protected _id: number;
    protected _basicBlock: number;
    protected _opcode: number;
    protected _operands: number[];
    protected _operandsString: string[];
    protected _label: string;
    protected _breakPoint: boolean;
    protected _color: string;

    constructor() {
        this._breakPoint = false;
        this._color = 'white';
        this._operands = new Array(3);
        this._operandsString = new Array(3);
    }

    copy(other: Instruction) {
        this._id = other.id;
        this._basicBlock = other.basicBlock;
        this._opcode = other.opcode;
        this._operands = other.operands.slice();
        this._operandsString = other.operandsString.slice();
        this._breakPoint = other.breakPoint;
        this._color = other.color;
    }

    toString(): string {
        let aux: string = '';
        if (this._operandsString[1]) {
            aux += ' ' + this._operandsString[1];
        }
        if (this._operandsString[2]) {
            aux += ' ' + this._operandsString[2];
        }
        return `${OpcodesNames[this._opcode]} ${this._operandsString[0]} ${aux}`;
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

    public get id(): number {
        return this._id;
    }

    public set id(value: number) {
        this._id = value;
    }

    public get basicBlock(): number {
        return this._basicBlock;
    }

    public set basicBlock(value: number) {
        this._basicBlock = value;
    }

    public set opcode(value: number) {
        this._opcode = value;
    }

    public set breakPoint(value: boolean) {
        this._breakPoint = value;
    }

    public set color(value: string) {
        this._color = value;
    }

    public get opcode(): number {
        return this._opcode;
    }

    public get breakPoint(): boolean {
        return this._breakPoint;
    }

    public get color(): string {
        return this._color;
    }

    public get operands(): number[] {
        return this._operands;
    }

    public set operands(value: number[]) {
        this._operands = value;
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

    public set operandsString(value: string[]) {
        this._operandsString = value;
    }

}
