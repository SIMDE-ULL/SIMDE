
import { apply, buildLexer, expectEOF, expectSingleResult, rep_sc, seq, tok, opt_sc, Token, TokenError, alt_sc, list_sc, TokenPosition } from 'typescript-parsec';
import { Opcodes, OpcodesNames } from './Opcodes';
import { Formats, FormatsNames, opcodeToFormat } from './InstructionFormats'
import { Instruction } from './Instruction';
import { throws } from 'assert';

enum Tokens {
    Inmediate,
    RegFP,
    RegGP,
    Id,
    Label,
    BraketOpen,
    BraketClose,
    Number,
    Space,
    NewLine,
    Comment
}

enum RegType {
    FP,
    GP
}

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

const tokenizer = buildLexer([
    [true, /^#[+-]?[0-9]+/g, Tokens.Inmediate],
    [true, /^[Ff][0-9]+/g, Tokens.RegFP],
    [true, /^[Rr][0-9]+/g, Tokens.RegGP],
    [true, /^[A-Za-z][A-Za-z0-9]+\:/g, Tokens.Label],
    [true, /^[A-Za-z][A-Za-z0-9]+/g, Tokens.Id],
    [true, /^\(/g, Tokens.BraketOpen],
    [true, /^\)/g, Tokens.BraketClose],
    [true, /^[+-]?[0-9]+/g, Tokens.Number],
    [false, /^[ \t\v\f]+/g, Tokens.Space],
    [false, /^\n/g, Tokens.NewLine],
    [false, /^\/\/.*\n/g, Tokens.Comment]
]);

const inmParser = apply(
    tok(Tokens.Inmediate),
    (num: Token<Tokens.Inmediate>) => {
        //TODO: allow hex numbers
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
        return { address: (address[0])? +address[0].text : 0, reg: address[2] };
    }
);

const opcodeParser = apply(
    tok(Tokens.Id),
    (opcodeTok: Token<Tokens.Id>) => {
        let opcode: number = OpcodesNames.indexOf(opcodeTok.text);
        if (opcode !== -1) {
            return opcode;
        } else {
            throw new TokenError(opcodeTok.pos, `Unknown opcode ${opcodeTok.text}`);
        }
    }
);

const operationParser = apply(
    alt_sc(
        seq(opcodeParser, regParser, regParser, regParser),
        seq(opcodeParser, regParser, regParser, inmParser),
        seq(opcodeParser, regParser, regParser, tok(Tokens.Id)),
        seq(opcodeParser, regParser, addressParser),
        opcodeParser
        ), // The order is important, the first succesfull match is the one that is returned
    (operation: number | [number, Reg, Reg, Reg] | [number, Reg, Reg, number] | [number, Reg, Address] | [number, Reg, Reg, Token<Tokens.Id>]) => {
        var type: Formats;
        var instruction: Instruction = new Instruction();

        instruction.opcode = (typeof operation == "number") ? operation : operation[0];

        if (typeof operation == "number") {
            type = Formats.NooP;
        } else if ('num' in operation[2] && operation.length == 4) {
            if (operation[2].type !== operation[1].type) {
                throw new TokenError(operation[2].pos, `Third operand register type(${operation[2].type}) mistmatch. Expected ${operation[1].type}`);
            }

            if (typeof operation[3] == "number") {
                type = Formats.GeneralRegisterAndInmediate;
                instruction.setOperand(0, operation[1].num, operation[1].text);
                instruction.setOperand(1, operation[2].num, operation[2].text);
                instruction.setOperand(2, operation[3], operation[3].toString());
                if (operation[1].type == RegType.FP) {
                    throw new TokenError(operation[1].pos, `Inmediate operand not allowed for floating point registers`);
                }

            } else if ('num' in operation[3]) {
                if (operation[3].type !== operation[1].type) {
                    throw new TokenError(operation[3].pos, `Third operand register type(${operation[3].type}) mistmatch. Expected ${operation[1].type}`);
                }

                if (operation[1].type == RegType.FP) {
                    type = Formats.TwoFloatingRegisters;
                } else {
                    type = Formats.TwoGeneralRegisters;
                }
                instruction.setOperand(0, operation[1].num, operation[1].text);
                instruction.setOperand(1, operation[2].num, operation[2].text);
                instruction.setOperand(2, operation[3].num, operation[3].text);
            } else if ('pos' in operation[3]) {
                type = Formats.Jump;
                instruction.setOperand(0, operation[1].num, operation[1].text);
                instruction.setOperand(1, operation[2].num, operation[2].text);
                //TODO: pass label to instruction
            }
        } else if (operation.length == 3) {
            if (operation[1].type == RegType.FP) {
                type = Formats.FloatingLoadStore;
            } else {
                type = Formats.GeneralLoadStore;
            }
            instruction.setOperand(0, operation[1].num, operation[1].text);
            instruction.setOperand(1, operation[2].address, operation[2].address.toString());
            instruction.setOperand(2, operation[2].reg.num, operation[2].reg.text);

        }

        //TODO: check if registers are in range?

        let expectedType = opcodeToFormat(instruction.opcode);
        if (type !== expectedType) {
            throw new TokenError(undefined, `Invalid instruction format for ${OpcodesNames[instruction.opcode]}. Expected ${FormatsNames[expectedType]}, got ${FormatsNames[type]}`); //TODO: add position
        }

        return instruction;
    }
);

const codeParser = seq(tok(Tokens.Number), rep_sc(alt_sc(operationParser, tok(Tokens.Label))));

export class CodeParser {
    public instructions: Instruction[] = [];
    public labels: { [k: number]: string } = {};
    public lines: number = 0;

    constructor(code: string) {
        this.parse(code);
    }

    private parse(code: string) {
        let result = expectSingleResult(expectEOF(codeParser.parse(tokenizer.parse(code))));
        
        let pos = 0;
        this.lines = +result[0].text;
        for (let i = 0; i < result[1].length; i++) {
            let line = result[1][i];
            if ('kind' in line && line.kind == Tokens.Label) {
                this.labels[pos] = line.text.slice(0, -1);
            } else if (line instanceof Instruction) {
                this.instructions.push(line);
                pos++;
            } else {
                throw new Error(`Unexpected code par fail: ${JSON.stringify(line)}`);
            }
        }
    }
}