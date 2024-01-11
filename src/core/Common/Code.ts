import { Instruction } from './Instruction';

import { Opcodes } from './Opcodes';
import { CodeParser } from './CodeParser';
import { FunctionalUnitType } from './FunctionalUnit';

export class Code {
    private _lines: number;
    private _instructions: Instruction[];
    private _numberOfBlocks: number;

    constructor() {
        this._numberOfBlocks = 0;
        this._instructions = new Array();
    }


    /*
    * SETTERS Y GETTERS
    */
    public get instructions(): Instruction[] {
        return this._instructions;
    }

    public set instructions(value: Instruction[]) {
        this._instructions = value;
    }

    public get lines(): number {
        return this._lines;
    }

    public set lines(value: number) {
        this._lines = value;
    }

    public get numberOfBlocks(): number {
        return this._numberOfBlocks;
    }

    public set numberOfBlocks(value: number) {
        this._numberOfBlocks = value;
    }

    public getFunctionalUnitType(index: number) {
        // TODO: and NOP?
        switch (this._instructions[index].opcode) {
            case Opcodes.ADD:
            case Opcodes.ADDI:
            case Opcodes.SUB:
            case Opcodes.OR:
            case Opcodes.AND:
            case Opcodes.NOR:
            case Opcodes.XOR:
            case Opcodes.SLLV:
            case Opcodes.SRLV:
                return FunctionalUnitType.INTEGERSUM;
            case Opcodes.ADDF:
            case Opcodes.SUBF:
                return FunctionalUnitType.FLOATINGSUM;
            case Opcodes.MULT:
                return FunctionalUnitType.INTEGERMULTIPLY;
            case Opcodes.MULTF:
                return FunctionalUnitType.FLOATINGMULTIPLY;
            case Opcodes.SW:
            case Opcodes.SF:
            case Opcodes.LW:
            case Opcodes.LF:
                return FunctionalUnitType.MEMORY;
            case Opcodes.BGT:
            case Opcodes.BNE:
            case Opcodes.BEQ:
                return FunctionalUnitType.JUMP;
            default:
                throw new Error("Error at getFunctionalUnitType, unknown opcode : " + Opcodes[this._instructions[index].opcode]);
        }
    }

    public isJump(index: number) {
        //return (opcode === Opcodes.BEQ) || (opcode === Opcodes.BGT) || (opcode === Opcodes.BNE);
        // With this we evite redundant code that can produce bugs
        return this.getFunctionalUnitType(index) === FunctionalUnitType.JUMP;
    }

    public load(input: string) {
        let codeParsed = new CodeParser(input);

        // First we need the number of code lines
        this._lines = codeParsed.lines;
        this.instructions.length = codeParsed.instructions.length;

        // Iterate over all parsed instructions
        for (let i = 0; i < codeParsed.instructions.length; i++) {
            // add the instruction to the array and set its id
            this.instructions[i] = codeParsed.instructions[i];
            this.instructions[i].id = i;

            // Assign the label to the instruction, if is the first instruction of a block
            for (let key in codeParsed.labels) {
                if (codeParsed.labels[key] === i) {
                    this.instructions[i].label = key;
                    this._numberOfBlocks++;
                } else {
                    this.instructions[i].label = '';
                }
            }

            // Resolve labels on the operands of jump instructions
            if (this.isJump(i)) {
                if (this.instructions[i].operandsString[2] in codeParsed.labels) {
                    this.instructions[i].setOperand(2, codeParsed.labels[this.instructions[i].operandsString[2]], this.instructions[i].operandsString[2]);
                } else {
                    throw new Error(`Can not find Jump destination(labeled ${this.instructions[i].operandsString[2]}) on instruction ${this.instructions[i].id} at line ${i}`);
                }
            }


            // Set the basic block of the instruction
            this.instructions[i].basicBlock = this._numberOfBlocks;
        }
    }

    /**
     * save
     */
    public save(): string {
        let result = this.lines + "\n";

        for (let i = 0; i < this.instructions.length; i++) {
            // Check if there is a label at line i
            if (this.instructions[i].label !== '') {
                result += this.instructions[i].label + ":\n";
            }

            result += "\t" + this.instructions[i].toString() + "\n";
        }

        return result;
    }
}
