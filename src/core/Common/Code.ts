import { Instruction } from './Instruction';
import { BasicBlock, SuccessorBlock } from './Blocks';
import { Label } from './Label';

import { Opcodes } from './Opcodes';
import { CodeParser } from './CodeParser';
import { FunctionalUnitType } from './FunctionalUnit';

export class Code {

    private _lines: number;
    private _instructions: Instruction[];
    private _labels: Label[];
    private _basicBlocks: BasicBlock;
    private _numberOfBlocks: number;

    constructor() {
        this._labels = new Array();
        this._numberOfBlocks = 0;
        this._basicBlocks = null;
        this._instructions = new Array();
    }

    private checkLabel(str: string, actual: BasicBlock): number {
        let index: number = -1;
        let basicBlock: BasicBlock;
        let nextSucessor: SuccessorBlock = new SuccessorBlock();
        actual.successor = nextSucessor;
        actual.successor.next = null;

        // TODO Why + ':'?
        str += ':';
        for (let i = 0; i < this._labels.length; i++) {
            if (this._labels[i].name === str) {
                index = i;
                i = this._labels.length + 1;
            }
        }

        if (index !== -1) {
            basicBlock = this.labels[index].blocks;
        } else {
            basicBlock = new BasicBlock(null, -1, null, null);
            // Add the label
            let label: Label = new Label();
            label.name = str;
            label.blocks = basicBlock;
            this._labels.push(label);
            index = this._labels.length - 1;
        }
        actual.successor.block = basicBlock;
        return index;
    }

    private addLabel(str: string, lineNumber: number, actual: BasicBlock): BasicBlock {
        let index: number = -1;
        let basicBlock: BasicBlock;
        for (let i = 0; i < this._labels.length; i++) {
            if (this._labels[i].name === str) {
                index = i;
                // Break loop
                i = this._labels.length;
            }
        }

        if (index !== -1) {
            basicBlock = this.labels[index].blocks;
            if (basicBlock.lineNumber !== -1) {
                // Repeated label
                basicBlock = null;
            } else {
                basicBlock.lineNumber = lineNumber;
                basicBlock.id = this._numberOfBlocks - 1;
                actual.next = basicBlock;
            }
        } else {
            // New label, need to create a new basicBlock
            basicBlock = new BasicBlock(this.numberOfBlocks - 1, lineNumber, null, null);

            let label: Label = new Label();
            label.name = str;
            label.blocks = basicBlock;
            this.labels.push(label);

            index = this.labels.length - 1;

            if (this._basicBlocks == null) {
                this._basicBlocks = basicBlock;
            } else {
                actual.next = basicBlock;
                let sucessor: SuccessorBlock = new SuccessorBlock();
                sucessor.block = basicBlock;
                sucessor.next = actual.successor;
                actual.successor = sucessor;
            }
        }

        return basicBlock;
    }

    private replaceLabels() {
        for (let i = 0; i < this._lines; i++) {
            if (this.isJump(this._instructions[i].opcode)) {
                let basicBlock: BasicBlock = this._labels[this._instructions[i].getOperand(2)].blocks;
                if (basicBlock.lineNumber === -1) {
                    return -1;
                }
                this._instructions[i].setOperand(2, basicBlock.id, '');
            }
        }
    }

    /*
    * PUBLIC METHODS
    */

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

    public get labels(): Label[] {
        return this._labels;
    }

    public set labels(value: Label[]) {
        this._labels = value;
    }

    public get numberOfBlocks(): number {
        return this._numberOfBlocks;
    }

    public set numberOfBlocks(value: number) {
        this._numberOfBlocks = value;
    }

    public get basicBlocks(): BasicBlock {
        return this._basicBlocks;
    }

    public set basicBlocks(value: BasicBlock) {
        this._basicBlocks = value;
    }

    // TODO: Move this to Instruction
    public getFunctionalUnitType(index: number) {
        switch (this._instructions[index].opcode) {
            case Opcodes.ADD:
            case Opcodes.ADDI:
                return FunctionalUnitType.INTEGERSUM;
            case Opcodes.ADDF:
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

    // TODO: Move this to Instruction
    public isJump(opcode: number) {
        //return (opcode === Opcodes.BEQ) || (opcode === Opcodes.BGT) || (opcode === Opcodes.BNE);
        // With this we evite redundant code that can produce bugs
        return this.getFunctionalUnitType(opcode) === FunctionalUnitType.JUMP;
    }

    public load(input: string) {
        let codeParsed = new CodeParser(input);
        let actual: BasicBlock;
        let newBlock: boolean = true;

        // First we need the number of code lines
        this._lines = codeParsed.lines;
        this.instructions.length = codeParsed.instructions.length;

        for (let i = 0; i < codeParsed.instructions.length; i++) {
            this.instructions[i] = codeParsed.instructions[i];
            this.instructions[i].id = i;

            if (i in codeParsed.labels) {
                this._numberOfBlocks++;
                this.instructions[i].label = codeParsed.labels[i];
                actual = this.addLabel(codeParsed.labels[i], i, actual);
                if (actual == null) {
                    // TODO: Try to use TokenPosition for a more accurate position. Maybe its better to move this check to CodeParser
                    throw new Error(`Error at instruction ${i + this.numberOfBlocks}, label ${codeParsed.labels[i]} already exists`);
                }
            } else {
                this.instructions[i].label = '';
                if (newBlock) {
                    this._numberOfBlocks++;
                    let basicBlock: BasicBlock = new BasicBlock(this._numberOfBlocks - 1, i, null, null);

                    if (this._basicBlocks == null) {
                        this._basicBlocks = actual = basicBlock;
                    } else {
                        actual.next = basicBlock;
                        let successor: SuccessorBlock = new SuccessorBlock();
                        successor.block = basicBlock;
                        successor.next = actual.successor;
                        actual.successor = successor;
                        actual = actual.next;
                    }
                }
            }
            newBlock = false;
            this._instructions[i].basicBlock = this._numberOfBlocks - 1;
            //TODO: fix jump instructions addresses
        }
        //this.replaceLabels();
    }

    /**
     * save
     */
    public save() : string {
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

    public getBasicBlockInstruction(basicBlockIndex: number) {
        if (basicBlockIndex > this._numberOfBlocks) {
            //TODO: throw exception
            return -1;
        }
        let actual: BasicBlock = this._basicBlocks;
        // WHaat why we are reinventing the wheel using a linked list?
        // TODO: just use an array
        for (let i = 0; i < basicBlockIndex; i++) {
            actual = actual.next;
        }
        return actual.lineNumber;
    }

}
