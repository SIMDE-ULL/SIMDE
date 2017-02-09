import { Instruction } from './Instruction';
import { FunctionalUnit, FunctionalUnitType } from './FunctionalUnit';
import { BasicBlock, SuccessorBlock } from './Blocks';
import { LEX, Parser } from './Parser';
import { Label } from './Label';

enum Opcodes {
    NOP = 0,
    ADD,
    ADDF,
    ADDI,
    MULT,
    MULTF,
    SW,
    SF,
    LW,
    LF,
    BNE,
    BEQ,
    OPERROR
}


export class Code {
    private _lines: number;
    private _instructions: Instruction[];
    private _labels: Label[];
    private _basicBlocks: BasicBlock;
    private _numberOfBlocks: number;
    private _parser: Parser;

    private OpcodesNames: string[] =
    ['NOP', 'ADD', 'ADDF', 'ADDI', 'MULT', 'MULTF', 'SW', 'SF', 'LW', 'LF', 'BNE', 'BEQ'];

    constructor() {
        this._labels = new Array();
        this._numberOfBlocks = 0;
        this._basicBlocks = null;
        this._instructions = new Array();
        this._parser = new Parser();
    }

    checkLabel(label: string, actual: BasicBlock): number {
        let index: number;
        let basicBlock: BasicBlock;
        let nextSucessor: SuccessorBlock = new SuccessorBlock();
        actual.successor = nextSucessor;
        actual.successor.next = null;

        // TODO Why + ':'?
        index = this._labels.indexOf(label + ':');

        if (index != -1) {
            basicBlock
        } else {
            basicBlock = new BasicBlock();
            basicBlock.next = null;
            basicBlock.successor = null;
            basicBlock.id = -1;
            this._labels.push(label);
        }

        return index;
    }

    addLabel(str: string, lineNumber: number, actual: BasicBlock): BasicBlock {
        let index: number = -1;
        let basicBlock: BasicBlock = new BasicBlock();

        for (let i = 0; i < this._labels.length; i++) {
            if (this._labels[i].name === str) {
                index = i;
                i = this._labels.length + 1;
            }
        }

        if (index != -1) {
            basicBlock = this._labels[index].blocks;
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
            basicBlock.lineNumber = lineNumber;
            basicBlock.next = null;
            basicBlock.successor = null;
            basicBlock.id = this._numberOfBlocks - 1;

            let label: Label = new Label();
            label.name = str;
            label.blocks = basicBlock;
            this._labels.push(label);
            index = this._labels.length - 1;

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
            if (this._instructions[i].opcode === Opcodes.BNE
                || this._instructions[i].opcode === Opcodes.BEQ) {
                let basicBlock: BasicBlock = new BasicBlock();
                if (basicBlock.lineNumber === -1) {
                    return -1;
                }
                this._instructions[i].setOperand(2, basicBlock.id);
            }
        }
    }

    load(input: string) {
        this._parser.setInput(input);
        let lexema;
        let actual: BasicBlock;
        let newBlock: boolean = false;
        // First we need the number of code lines
        lexema = this._parser.lex();

        if (lexema.value !== LEX.LINESNUMBER) {
            console.log('Error parsing lines number');
            // throw;
        }
        this._lines = +lexema.yytext;

        this._instructions.length = this._lines;
        for (let i = 0; i < this._lines; i++) {
            this._instructions[i] = new Instruction();
            this._instructions[i].id = i;
            lexema = this._parser.lex();
            if (lexema.value === LEX.LABEL) {
                this._numberOfBlocks++;
                // this._instructions[i].stringLabel = lexema.yytext;
                actual = this.addLabel(lexema.yytext, i, actual);
                if (actual == null) {
                    console.log('Error');
                    // throw;
                }
                lexema = this._parser.lex();
            } else {
                // this._instructions[i].stringLabel = '';
                if (newBlock) {
                    this._numberOfBlocks++;
                    let basicBlock: BasicBlock = new BasicBlock();
                    basicBlock.lineNumber = i;
                    basicBlock.next = null;
                    basicBlock.successor = null;
                    basicBlock.id = this._numberOfBlocks - 1;

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
            this.checkLexema(lexema.value, LEX.ID);
            let opcode = this.stringToOpcode(lexema.yytext);
            this._instructions[i].opcode = opcode;
            this._instructions[i].basicBlock = this._numberOfBlocks - 1;
            switch (opcode) {
                case Opcodes.NOP:
                    this._instructions[i].setOperand(0, 0);
                    this._instructions[i].setOperand(1, 0);
                    this._instructions[i].setOperand(2, 0);
                    break;
                case Opcodes.ADD:
                case Opcodes.MULT:
                    lexema = this._parser.lex();
                    this.checkLexema(lexema.value, LEX.REGGP);
                    this._instructions[i].setOperand(0, this.stringToRegister(lexema.yytext));
                    lexema = this._parser.lex();
                    this.checkLexema(lexema.value, LEX.REGGP);
                    this._instructions[i].setOperand(1, this.stringToRegister(lexema.yytext));
                    lexema = this._parser.lex();
                    this.checkLexema(lexema.value, LEX.REGGP);
                    this._instructions[i].setOperand(2, this.stringToRegister(lexema.yytext));
                    break;
                case Opcodes.ADDF:
                case Opcodes.MULTF:
                    lexema = this._parser.lex();
                    this.checkLexema(lexema.value, LEX.REGFP);
                    this._instructions[i].setOperand(0, this.stringToRegister(lexema.yytext));
                    lexema = this._parser.lex();
                    this.checkLexema(lexema.value, LEX.REGFP);
                    this._instructions[i].setOperand(1, this.stringToRegister(lexema.yytext));
                    lexema = this._parser.lex();
                    this.checkLexema(lexema.value, LEX.REGFP);
                    this._instructions[i].setOperand(2, this.stringToRegister(lexema.yytext));
                    break;
                case Opcodes.ADDI:
                    lexema = this._parser.lex();
                    this.checkLexema(lexema.value, LEX.REGGP);
                    this._instructions[i].setOperand(0, this.stringToRegister(lexema.yytext));
                    lexema = this._parser.lex();
                    this.checkLexema(lexema.value, LEX.REGGP);
                    this._instructions[i].setOperand(1, this.stringToRegister(lexema.yytext));
                    lexema = this._parser.lex();
                    this.checkLexema(lexema.value, LEX.INMEDIATE);
                    this._instructions[i].setOperand(2, this.stringToInmediate(lexema.yytext));
                    break;
                case Opcodes.SW:
                case Opcodes.LW:
                    lexema = this._parser.lex();
                    this.checkLexema(lexema.value, LEX.REGGP);
                    this._instructions[i].setOperand(0, this.stringToRegister(lexema.yytext));
                    lexema = this._parser.lex();
                    this.checkLexema(lexema.value, LEX.ADDRESS);
                    let result: number[] = this.stringToAddress(lexema.yytext);
                    this._instructions[i].setOperand(1, result[0]);
                    this._instructions[i].setOperand(2, result[1]);
                    break;
                case Opcodes.SF:
                case Opcodes.LF:
                    lexema = this._parser.lex();
                    this.checkLexema(lexema.value, LEX.REGGP);
                    this._instructions[i].setOperand(0, this.stringToRegister(lexema.yytext));
                    lexema = this._parser.lex();
                    this.checkLexema(lexema.value, LEX.ADDRESS);
                    let result2: number[] = this.stringToAddress(lexema.yytext);
                    this._instructions[i].setOperand(1, result2[0]);
                    this._instructions[i].setOperand(2, result2[1]);
                    break;
                case Opcodes.BNE:
                case Opcodes.BEQ:
                    lexema = this._parser.lex();
                    this.checkLexema(lexema.value, LEX.REGGP);
                    this._instructions[i].setOperand(0, this.stringToRegister(lexema.yytext));
                    lexema = this._parser.lex();
                    this.checkLexema(lexema.value, LEX.REGGP);
                    this._instructions[i].setOperand(1, this.stringToRegister(lexema.yytext));
                    lexema = this._parser.lex();
                    this.checkLexema(lexema.value, LEX.ID);
                    this._instructions[i].setOperand(2, this.checkLabel(lexema.yytext, actual));
                    newBlock = true;
                    break;
                case Opcodes.OPERROR:
                default:
                    throw 'Error';
            }
        }
        this.replaceLabels();
    }

    private stringToOpcode(stringOpcode: string): number {
        let opcode: number = this.OpcodesNames.indexOf(stringOpcode);
        if (opcode !== -1) {
            // TODO Is necessary cohercion here?
            for (let aux in Opcodes) {
                if (typeof Opcodes[aux] === 'number' && +Opcodes[aux] === opcode) {
                    return +Opcodes[aux];
                }
            }
        } else {
            return Opcodes.OPERROR;
        }
    }

    private stringToAddress(stringAddress: string): number[] {
        let result: number[] = new Array(2);
        let position = stringAddress.indexOf('(');
        if (position === 1) {
            result[0] = 0;
        } else {
            result[0] = +stringAddress.substring(1, position - 1);
        }
        // TODO substr or substring?
        result[1] = this.stringToRegister(stringAddress.substr(position + 1, stringAddress.length));
        return result;
    }

    private stringToRegister(stringRegister: string): number {
        // TODO Cohercion vs Number.parse?
        return +stringRegister.substring(2, stringRegister.length);
    }

    private stringToInmediate(stringInmediate: string): number {
        // TODO Cohercion vs Number.parse?
        return +stringInmediate.substring(2, stringInmediate.length);
    }

    private checkLexema(value: number, expectedLexema: number) {
        if (value !== expectedLexema) {
            console.log('Error in lexema');
            throw 'Error in lexema, expected ' + expectedLexema + ' got: ' + value;
        }
    }

    private getBasicBlockInstruction(basicBlockIndex: number) {
        if (basicBlockIndex > this._numberOfBlocks) {
            return -1;
        }
        let actual: BasicBlock = this._basicBlocks;
        for (let i = 0; i < basicBlockIndex; i++) {
            actual = actual.next;
        }

        return actual.lineNumber;
    }

    private getFunctionalUnitType(index: number): number {
        switch (this._instructions[index].opcode) {
            case Opcodes.ADD:
            case Opcodes.ADDI: return FunctionalUnitType.INTEGERSUM;
            case Opcodes.ADDF: return FunctionalUnitType.FLOATINGSUM;
            case Opcodes.MULT: return FunctionalUnitType.INTEGERMULTIPLY;
            case Opcodes.MULTF: return FunctionalUnitType.FLOATINGMULTIPLY;
            case Opcodes.SW:
            case Opcodes.SF:
            case Opcodes.LW:
            case Opcodes.LF: return FunctionalUnitType.MEMORY;
            case Opcodes.BNE:
            case Opcodes.BEQ: return FunctionalUnitType.JUMP;
            default: return FunctionalUnitType.INTEGERSUM;
        }
    }
}