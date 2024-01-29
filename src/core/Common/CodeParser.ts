
import { apply, buildLexer, expectEOF, expectSingleResult, rep_sc, seq, tok, opt_sc, Token, TokenError, alt_sc, fail, TokenPosition } from 'typescript-parsec';
import { OpcodesNames } from './Opcodes';
import { Formats, FormatsNames, opcodeToFormat } from './InstructionFormats'
import { Instruction } from './Instruction';


enum Tokens {
    Inmediate,
    RegFP,
    RegGP,
    Id,
    Label,
    BraketOpen,
    BraketClose,
    Number,
    Comma,
    Space,
    NewLine,
    Comment
}

enum RegType {
    FP,
    GP
}
let RegTypeNames: string[] = ["FP", "GP"];

interface Reg {
    type: RegType;
    pos: TokenPosition;
    num: number;
    text: string;
}

interface Address {
    address: number;
    reg: Reg;
}

interface OpcodeToken {
    opcode: number;
    pos: TokenPosition;
}


const tokenizer = buildLexer([
    [true, /^#[+-]?[0-9]+/g, Tokens.Inmediate],
    [true, /^[Ff][0-9]+/g, Tokens.RegFP],
    [true, /^[Rr][0-9]+/g, Tokens.RegGP],
    [true, /^[A-Za-z][A-Za-z0-9]*\:/g, Tokens.Label],
    [true, /^[A-Za-z][A-Za-z0-9]*/g, Tokens.Id],
    [true, /^\(/g, Tokens.BraketOpen],
    [true, /^\)/g, Tokens.BraketClose],
    [true, /^[+-]?[0-9]+/g, Tokens.Number],
    [false, /^\,/g, Tokens.Comma],
    [false, /^[ \t\v\f]+/g, Tokens.Space],
    [false, /^\n/g, Tokens.NewLine],
    [false, /^\/\/.*\n/g, Tokens.Comment]
]);

const inmParser = apply(
    tok(Tokens.Inmediate),
    (num: Token<Tokens.Inmediate>) => {
        return +num.text.slice(1);
    }
);

const regParser = apply(
    alt_sc(tok(Tokens.RegFP), tok(Tokens.RegGP)),
    (reg: Token<Tokens.RegFP> | Token<Tokens.RegGP>) => {
        let type = RegType.GP;
        if (reg.kind == Tokens.RegFP) {
            type = RegType.FP;
        }
        return { type: type, pos: reg.pos, num: +reg.text.slice(1), text: reg.text };
    }
);

const addressParser = apply(
    seq(opt_sc(tok(Tokens.Number)), tok(Tokens.BraketOpen), regParser, tok(Tokens.BraketClose)),
    (address: [Token<Tokens.Number>, Token<Tokens.BraketOpen>, Reg, Token<Tokens.BraketClose>]) => {
        if (address[2].type == RegType.FP) {
            throw new TokenError(address[2].pos, "Address register cannot be FP register");
        }
        return { address: (address[0]) ? +address[0].text : 0, reg: address[2] };
    }
);

const opcodeParser = apply(
    tok(Tokens.Id),
    (opcodeTok: Token<Tokens.Id>): OpcodeToken => {
        let opcode: number = OpcodesNames.indexOf(opcodeTok.text);
        if (opcode !== -1) {
            return { opcode: opcode, pos: opcodeTok.pos };
        } else {
            throw new TokenError(opcodeTok.pos, `Unknown opcode ${opcodeTok.text}`);
        }
    }
);

export class CodeParser {
    private _instructions: Instruction[] = [];
    private _labels: { [k: string]: number } = {};

    private _generalRegisters: number;
    private _memorySize: number;

    public get instructions(): Instruction[] {
        return this._instructions;
    }

    public get labels(): { [k: string]: number } {
        return this._labels;
    }

    public get lines(): number {
        return this._instructions.length;
    }

    constructor(code: string, generalRegisters: number, memorySize: number) {
        this._generalRegisters = generalRegisters;
        this._memorySize = memorySize;
        this.parse(code);
    }

    private parse(code: string) {
        let result = expectSingleResult(expectEOF(this.genCodeParser().parse(tokenizer.parse(code))));

        // Create labels and instructions
        let pos = 0;
        for (let i = 0; i < result[1].length; i++) {
            let line = result[1][i];
            if ('kind' in line && line.kind == Tokens.Label) {
                let name = line.text.slice(0, -1);
                if (name in this._labels) {
                    throw new Error(`Error at instruction ${pos}, label ${line.text.slice(0, -1)} already exists`);
                }
                this._labels[name] = pos;
            } else if (line instanceof Instruction) {
                this._instructions.push(line);
                pos++;
            } else {
                throw new Error(`Unexpected code parser fail: ${JSON.stringify(line)}`);
            }
        }
    }

    private genCodeParser() {
        return seq(tok(Tokens.Number), rep_sc(alt_sc(this.genOperationParser(), tok(Tokens.Label))));
    }

    private genOperationParser() {
        return apply(
            alt_sc(
                seq(opcodeParser, regParser, regParser, regParser),
                seq(opcodeParser, regParser, regParser, inmParser),
                seq(opcodeParser, regParser, regParser, tok(Tokens.Id)),
                seq(opcodeParser, regParser, addressParser),
                opcodeParser
            ), // The order is important, the first succesfull match is the one that is returned
            (operation: OpcodeToken | [OpcodeToken, Reg, Reg, Reg] | [OpcodeToken, Reg, Reg, number] | [OpcodeToken, Reg, Address] | [OpcodeToken, Reg, Reg, Token<Tokens.Id>]) => {
                var type: Formats;
                var instruction: Instruction = new Instruction();
                var pos: TokenPosition;

                // set the opcode and get the current position
                if (operation instanceof Array) {
                    instruction.opcode = operation[0].opcode;
                    pos = operation[0].pos;
                } else {
                    instruction.opcode = operation.opcode;
                    pos = operation.pos;
                }

                // Check the recived instruction format and set the operands
                if (!(operation instanceof Array)) {
                    type = Formats.Noop;
                } else if ('num' in operation[2] && operation.length == 4) {
                    if (operation[2].type !== operation[1].type) {
                        throw new TokenError(operation[2].pos, `Second operand register type(${RegTypeNames[operation[2].type]}) mistmatch. Expected ${RegTypeNames[operation[1].type]}`);
                    }

                    if (typeof operation[3] == "number") {
                        type = Formats.GeneralRegisterAndInmediate;

                        // Check that the registers are in bounds
                        if (operation[1].num > this._generalRegisters) {
                            throw new TokenError(operation[1].pos, `Destiny register number out of bounds`);
                        } else if (operation[2].num > this._generalRegisters) {
                            throw new TokenError(operation[2].pos, `Operand 1 register number out of bounds`);
                        }

                        instruction.setOperand(0, operation[1].num, operation[1].text);
                        instruction.setOperand(1, operation[2].num, operation[2].text);
                        instruction.setOperand(2, operation[3], "#" + operation[3].toString());
                        if (operation[1].type == RegType.FP) {
                            throw new TokenError(operation[1].pos, `Inmediate operand not allowed for floating point registers`);
                        }

                    } else if ('num' in operation[3]) {
                        if (operation[3].type !== operation[1].type) {
                            throw new TokenError(operation[3].pos, `Third operand register type(${RegTypeNames[operation[3].type]}) mistmatch. Expected ${RegTypeNames[operation[1].type]}`);
                        }

                        if (operation[1].type == RegType.FP) {
                            type = Formats.TwoFloatingRegisters;
                        } else {
                            type = Formats.TwoGeneralRegisters;
                        }

                        // Check that the registers are in bounds
                        if (operation[1].num > this._generalRegisters) {
                            throw new TokenError(operation[1].pos, `Destiny register number out of bounds`);
                        } else if (operation[2].num > this._generalRegisters) {
                            throw new TokenError(operation[2].pos, `Operand 1 register number out of bounds`);
                        } else if (operation[3].num > this._generalRegisters) {
                            throw new TokenError(operation[3].pos, `Operand 2 register number out of bounds`);
                        }

                        instruction.setOperand(0, operation[1].num, operation[1].text);
                        instruction.setOperand(1, operation[2].num, operation[2].text);
                        instruction.setOperand(2, operation[3].num, operation[3].text);
                    } else if ('pos' in operation[3]) {
                        type = Formats.Jump;

                        // Check that the registers are in bounds
                        if (operation[1].num > this._generalRegisters) {
                            throw new TokenError(operation[1].pos, `Operand 1 register number out of bounds`);
                        } else if (operation[2].num > this._generalRegisters) {
                            throw new TokenError(operation[2].pos, `Operand 2 register number out of bounds`);
                        }

                        instruction.setOperand(0, operation[1].num, operation[1].text);
                        instruction.setOperand(1, operation[2].num, operation[2].text);
                        instruction.setOperand(2, undefined, operation[3].text);
                    }
                } else if (operation.length == 3) {
                    if (operation[1].type == RegType.FP) {
                        type = Formats.FloatingLoadStore;
                    } else {
                        type = Formats.GeneralLoadStore;
                    }

                    // Check that the registers are in bounds
                    if (operation[1].num > this._generalRegisters) {
                        throw new TokenError(operation[1].pos, `Destiny register number out of bounds`);
                    } else if (operation[2].reg.num > this._generalRegisters) {
                        throw new TokenError(operation[2].reg.pos, `Adress register number out of bounds`);
                    } else if (operation[2].address > this._memorySize) {
                        throw new TokenError(operation[2].reg.pos, `Memory address out of bounds`);
                    }

                    instruction.setOperand(0, operation[1].num, operation[1].text);
                    instruction.setOperand(1, operation[2].address, operation[2].address.toString());
                    instruction.setOperand(2, operation[2].reg.num, "(" + operation[2].reg.text + ")");

                }

                let expectedType = opcodeToFormat(instruction.opcode);
                if (type !== expectedType) {
                    //return fail(`Invalid instruction format for ${OpcodesNames[instruction.opcode]}. Expected ${FormatsNames[expectedType]} format, got ${FormatsNames[type]} format or similar`);
                    throw new TokenError(pos, `Invalid instruction format for ${OpcodesNames[instruction.opcode]}. Expected ${FormatsNames[expectedType]} format, got ${FormatsNames[type]} format or similar`);
                }

                return instruction;
            }
        );
    }
}