import { Instruction } from './Instruction';
import { BasicBlock, SuccessorBlock } from './Blocks';
import { LEX, Lexema, Lexer } from './Lexer';
import { Label } from './Label';

import { Opcodes } from './Opcodes';
import { Parser } from './Parser';
import { FunctionalUnitType } from './FunctionalUnit';

export class Code {

    private _lines: number;
    private _instructions: Instruction[];
    private _labels: Label[];
    private _basicBlocks: BasicBlock;
    private _numberOfBlocks: number;
    private _lexer: Lexer;
    private _parser: Parser;

    constructor() {
        this._labels = new Array();
        this._numberOfBlocks = 0;
        this._basicBlocks = null;
        this._instructions = new Array();
        this._lexer = new Lexer();
        this._parser = new Parser(this._lexer, this.checkLexema.bind(this));
    }

    checkLabel(str: string, actual: BasicBlock): number {
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

    addLabel(str: string, lineNumber: number, actual: BasicBlock): BasicBlock {
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

    replaceLabels() {
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

    load(input: string) {
        this._lexer.setInput(input);
        let lexema: Lexema;
        let actual: BasicBlock;
        let newBlock: boolean = true;
        // First we need the number of code lines
        lexema = this._lexer.lex();

        if (lexema.value !== LEX.LINESNUMBER) {
            throw new Error('Error parsing lines number');
        }
        this._lines = +lexema.yytext;

        this.instructions.length = this._lines;

        for (let i = 0; i < this._lines; i++) {
            this.instructions[i] = new Instruction();
            this.instructions[i].id = i;
            lexema = this._lexer.lex();

            if (lexema.value === LEX.LABEL) {
                this._numberOfBlocks++;
                this.instructions[i].label = lexema.yytext;
                actual = this.addLabel(lexema.yytext, i, actual);
                if (actual == null) {
                    throw new Error(`Error at line ${i + this.numberOfBlocks}, label ${lexema.yytext} already exists`);
                }
                lexema = this._lexer.lex();
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
            this.checkLexema(lexema, LEX.ID, i);
            let opcode = this._parser.stringToOpcode(lexema.yytext);
            this._instructions[i].opcode = opcode;
            this._instructions[i].basicBlock = this._numberOfBlocks - 1;
            switch (opcode) {
                case Opcodes.NOP:
                    this._parser.parseNooP(this._instructions[i]);
                    break;
                case Opcodes.ADD:
                case Opcodes.SUB:
                case Opcodes.MULT:
                case Opcodes.OR:
                case Opcodes.AND:
                case Opcodes.XOR:
                case Opcodes.NOR:
                case Opcodes.SLLV:
                case Opcodes.SRLV:
                    this._parser.parseOperationWithTwoGeneralRegisters(i, this._instructions[i]);
                    break;
                case Opcodes.ADDF:
                case Opcodes.SUBF:
                case Opcodes.MULTF:
                    this._parser.parseOperationWithTwoFloatingRegisters(i, this._instructions[i]);
                    break;
                case Opcodes.ADDI:
                    this._parser.parseOperationWithGeneralRegisterAndInmediate(i, this._instructions[i]);
                    break;
                case Opcodes.SW:
                case Opcodes.LW:
                    this._parser.parseGeneralLoadStoreOperation(i, this._instructions[i]);
                    break;
                case Opcodes.SF:
                case Opcodes.LF:
                    this._parser.parseFloatingLoadStoreOperation(i, this._instructions[i]);
                    break;
                case Opcodes.BNE:
                case Opcodes.BEQ:
                case Opcodes.BGT:
                    this._parser.parseJumpOperation(i, this._instructions[i], actual, this.checkLabel.bind(this));
                    newBlock = true;
                    break;
                case Opcodes.OPERROR:
                    throw new Error(`Error at line ${i + this.numberOfBlocks + 1} unknown opcode ${lexema.yytext}`);
                default:
                    throw new Error(`Error at line ${i + this.numberOfBlocks + 1} unknown opcode ${lexema.yytext}`);
            }
        }
        this.replaceLabels();
    }

    public checkLexema(lexema: Lexema, expectedLexema: number, i: number) {
        if (lexema.value !== expectedLexema) {
            throw new Error(`Error at line ${i + this.numberOfBlocks + 1}, expected: ${LEX[expectedLexema]} got: ${lexema.yytext}`);
        }
    }

    public getBasicBlockInstruction(basicBlockIndex: number) {
        if (basicBlockIndex > this._numberOfBlocks) {
            return -1;
        }
        let actual: BasicBlock = this._basicBlocks;
        for (let i = 0; i < basicBlockIndex; i++) {
            actual = actual.next;
        }
        return actual.lineNumber;
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

    private isJump(opcode: number) {
        return (opcode === Opcodes.BEQ) || (opcode === Opcodes.BGT) || (opcode === Opcodes.BNE);
    }
}
