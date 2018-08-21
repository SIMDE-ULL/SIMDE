import { LargeInstruction } from './LargeInstructions';
import { VLIWOperation } from './VLIWOperation'
import { Opcodes } from '../Common/Opcodes';
import { Code } from '../Common/Code';
import { VLIWParser } from './VLIWParser';

export class VLIWCode {
    public _instructions: LargeInstruction[];
    private _largeInstructionNumber: number;
    private _superescalarCode: Code;

    constructor(n?: number) {
        if(n) {
            this._instructions = new Array(n);
            this._instructions.fill(new LargeInstruction());
        } else {
            this._instructions = [];
        }
        this._largeInstructionNumber = 0;
    }

    //Getters
    public getLargeInstructionNumber(): number {
        return this._largeInstructionNumber;
    }

    public getLargeInstruction(index: number): LargeInstruction {
        if((index < 0) || (index >= this._largeInstructionNumber)) {
            return null;
        }
        return this._instructions[index];
    }

    public getBreakPoint(index: number): boolean {
        return this._instructions[index].getBreakPoint();
    }

    //Setters
    public setInstructionNumber(index: number) {
        this._instructions = new Array<LargeInstruction>(index);
        this._largeInstructionNumber = index;
    }

    public setBreakPoint(ind: number, b: boolean) {
        this._instructions[ind].setBreakPoint(b);
    }

    public addOperacion(ind: number, oper: VLIWOperation) {
        this._instructions[ind].addOperation(oper);
    }

    public get superescalarCode(): Code {
        return this._superescalarCode;
    }

    public set superescalarCode(code: Code) {
        this._superescalarCode = code;
    }

    public clear() {
        this._instructions = null;
        this._largeInstructionNumber = 0;
    }

    public save(): string {

       return VLIWParser.ExportAsString(this._largeInstructionNumber, this._instructions);
    }

    public load(input: string, code: Code): void {
        this._instructions = VLIWParser.Parse(input, code);
        this._largeInstructionNumber = this._instructions.length;
        this._superescalarCode = code;
    }
}
