export class Instruction {
    private _id: number;
    private _basicBlock: number;
    private _opcode: number;
    private _operands: number[];

    private _breakPoint: boolean;
    private _color: string;

    constructor() {
        this._breakPoint = false;
        this._color = 'white';
        this._operands = new Array(3);
    }

    copy(other: Instruction) {
        // TODO Check this
        // Object.assign(this, other);
        this._id = other._id;
        this._basicBlock = other._basicBlock;
        this._opcode = other._opcode;
        this._operands = other._operands;
        this._breakPoint = other._breakPoint;
        this._color = other._color;
    }

    toString(): string {
        let aux: string = '';
        if (this._operands[1]) {
            aux = ' ' + this._operands[1];
        }

        if (this._operands[2]) {
            aux = ' ' + this._operands[2];
        }

        return '' + this._opcode + ' ' + this._operands[0] + aux;
    }

    setOperand(index: number, value: number) {
        this._operands[index] = value;
    }

    getOperand(index: number): number {
        return this._operands[index];
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
}