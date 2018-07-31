import { LargeInstruction } from './LargeInstructions';
import { VLIWOperation } from './VLIWOperation'
import { Opcodes } from '../Common/Opcodes';
import { Code } from '../Common/Code';
import { VLIWParser } from './VLIWParser';

export class VLIWCode {
    private _instructions: LargeInstruction[];
    private _instructionNumber: number;

    constructor(n?: number) {
        if(n) {
            this._instructions = new Array(n);
            this._instructions.fill(new LargeInstruction());
        } else {
            this._instructions = [];
        }
        this._instructionNumber = 0;
    }

    //Getters
    public getInstructionNumber(): number {
        return this._instructionNumber;
    }

    public getLargeInstruction(index: number): LargeInstruction {
        if((index < 0) || (index >= this._instructionNumber)) {
            return null;
        }
        return this._instructions[index];
    }

    public getBreakPoint(index: number): boolean {
        return this._instructions[index].getBreakPoint();
    }

    //Setters
    public setInstructionNumber(index: number) {
        this._instructions = new LargeInstruction[index];
        this._instructionNumber = index;
    }

    public setBreakPoint(ind: number, b: boolean) {
        this._instructions[ind].setBreakPoint(b);
    }

    public addOperacion(ind: number, oper: VLIWOperation) {
        this._instructions[ind].addOperation(oper);
    }

    public clear() {
        this._instructions = null;
        this._instructionNumber = 0;
    }

    public save(): string {

       return VLIWParser.ExportAsString(this._instructionNumber, this._instructions);
    }

    public load(input: string, code: Code): void {
        this._instructions = VLIWParser.Parse(input, code);
        this._instructionNumber = this._instructions.length;
    }
}
