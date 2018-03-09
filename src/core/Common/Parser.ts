import { LEX, Lexer } from './Lexer';
import { Opcodes, OpcodesNames } from './Opcodes';
import { FunctionalUnitType } from './FunctionalUnit';
import { Instruction } from './Instruction';
import { BasicBlock } from './Blocks';

export class Parser {

    /*
    * PARSE STEPS
    */
    constructor(private _lexer: Lexer, private checkLexema: Function) {

    }

    public static opcodeToFunctionalUnitType(opcode: number): FunctionalUnitType {
        /* tslint:disable:ter-indent */
        switch (opcode) {
            case Opcodes.ADD:
            case Opcodes.ADDI:
            case Opcodes.SUB:
            case Opcodes.OR:
            case Opcodes.AND:
            case Opcodes.NOR:
            case Opcodes.XOR:
            case Opcodes.SLLV:
            case Opcodes.SRLV: return FunctionalUnitType.INTEGERSUM;
            case Opcodes.ADDF:
            case Opcodes.SUBF: return FunctionalUnitType.FLOATINGSUM;
            case Opcodes.MULT: return FunctionalUnitType.INTEGERMULTIPLY;
            case Opcodes.MULTF: return FunctionalUnitType.FLOATINGMULTIPLY;
            case Opcodes.SW:
            case Opcodes.SF:
            case Opcodes.LW:
            case Opcodes.LF: return FunctionalUnitType.MEMORY;
            case Opcodes.BNE:
            case Opcodes.BEQ:
            case Opcodes.BGT: return FunctionalUnitType.JUMP;
            default: return FunctionalUnitType.INTEGERSUM;
        }
        /* tslint:enable:ter-indent */
    }

    public parseNooP(instruction: Instruction) {
        instruction.setOperand(0, 0, '');
        instruction.setOperand(1, 0, '');
        instruction.setOperand(2, 0, '');
    }

    public parseOperationWithTwoGeneralRegisters(index: number, instruction: Instruction) {

        let lexema = this._lexer.lex();
        this.checkLexema(lexema, LEX.REGGP, index);
        instruction.setOperand(0, this.stringToRegister(lexema.yytext), lexema.yytext);
        lexema = this._lexer.lex();
        this.checkLexema(lexema, LEX.REGGP, index);
        instruction.setOperand(1, this.stringToRegister(lexema.yytext), lexema.yytext);
        lexema = this._lexer.lex();
        this.checkLexema(lexema, LEX.REGGP, index);
        instruction.setOperand(2, this.stringToRegister(lexema.yytext), lexema.yytext);
    }

    public parseOperationWithTwoFloatingRegisters(index: number, instruction: Instruction) {
        let lexema = this._lexer.lex();
        this.checkLexema(lexema, LEX.REGFP, index);
        instruction.setOperand(0, this.stringToRegister(lexema.yytext), lexema.yytext);
        lexema = this._lexer.lex();
        this.checkLexema(lexema, LEX.REGFP, index);
        instruction.setOperand(1, this.stringToRegister(lexema.yytext), lexema.yytext);
        lexema = this._lexer.lex();
        this.checkLexema(lexema, LEX.REGFP, index);
        instruction.setOperand(2, this.stringToRegister(lexema.yytext), lexema.yytext);
    }

    public parseOperationWithGeneralRegisterAndInmediate(index: number, instruction: Instruction) {
        let lexema = this._lexer.lex();
        this.checkLexema(lexema, LEX.REGGP, index);
        instruction.setOperand(0, this.stringToRegister(lexema.yytext), lexema.yytext);
        lexema = this._lexer.lex();
        this.checkLexema(lexema, LEX.REGGP, index);
        instruction.setOperand(1, this.stringToRegister(lexema.yytext), lexema.yytext);
        lexema = this._lexer.lex();
        this.checkLexema(lexema, LEX.INMEDIATE, index);
        instruction.setOperand(2, this.stringToInmediate(lexema.yytext), lexema.yytext);
    }

    public parseGeneralLoadStoreOperation(index: number, instruction: Instruction) {
        let lexema = this._lexer.lex();
        this.checkLexema(lexema, LEX.REGGP, index);
        instruction.setOperand(0, this.stringToRegister(lexema.yytext), lexema.yytext);
        lexema = this._lexer.lex();
        this.checkLexema(lexema, LEX.ADDRESS, index);
        let result: number[] = this.stringToAddress(lexema.yytext);
        instruction.setOperand(1, result[0], lexema.yytext);
        instruction.setOperand(2, result[1], '');
    }

    public parseFloatingLoadStoreOperation(index: number, instruction: Instruction) {
        let lexema = this._lexer.lex();
        this.checkLexema(lexema, LEX.REGFP, index);
        instruction.setOperand(0, this.stringToRegister(lexema.yytext), lexema.yytext);
        lexema = this._lexer.lex();
        this.checkLexema(lexema, LEX.ADDRESS, index);
        let result2: number[] = this.stringToAddress(lexema.yytext);
        instruction.setOperand(1, result2[0], lexema.yytext);
        instruction.setOperand(2, result2[1], '');
    }

    public parseJumpOperation(index: number, instruction: Instruction, actual: BasicBlock, checkLabel: Function) {
        let lexema = this._lexer.lex();
        this.checkLexema(lexema, LEX.REGGP, index);
        instruction.setOperand(0, this.stringToRegister(lexema.yytext), lexema.yytext);
        lexema = this._lexer.lex();
        this.checkLexema(lexema, LEX.REGGP, index);
        instruction.setOperand(1, this.stringToRegister(lexema.yytext), lexema.yytext);
        lexema = this._lexer.lex();
        this.checkLexema(lexema, LEX.ID, index);
        instruction.setOperand(2, checkLabel(lexema.yytext, actual), lexema.yytext);
    }
    public stringToOpcode(stringOpcode: string): number {
        let opcode: number = OpcodesNames.indexOf(stringOpcode);
        if (opcode !== -1) {
            return opcode;
        } else {
            return Opcodes.OPERROR;
        }
    }

    public stringToAddress(stringAddress: string): number[] {
        let result: number[] = new Array(2);
        let position = stringAddress.indexOf('(');
        if (position === 0) {
            result[0] = 0;
        } else {
            result[0] = +stringAddress.substring(0, position);
        }
        result[1] = this.stringToRegister(stringAddress.substr(position + 1, stringAddress.length - position - 2));
        return result;
    }

    public stringToRegister(stringRegister: string): number {
        return +stringRegister.substring(1, stringRegister.length);
    }

    public stringToInmediate(stringInmediate: string): number {
        return +stringInmediate.substring(1, stringInmediate.length);
    }
}
