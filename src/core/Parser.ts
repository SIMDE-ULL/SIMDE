import * as Lexer from "lex";

export enum LEX {
    INMEDIATE = 1,
    REGFP,
    REGGP,
    ID,
    LABEL,
    ADDRESS,
    LINESNUMBER
}

export class Parser {

    private LEX: LEX;

    private _lexer;

    constructor() {

        this._lexer = new Lexer;

        this._lexer.addRule(/^[0-9]+/i, function (lexeme) {
            this.yytext = lexeme;
            return LEX.LINESNUMBER;
        }).addRule(/#[+-]?[0-9]+/i, function (lexeme) {
            this.yytext = lexeme;
            return LEX.INMEDIATE;
        }).addRule(/^[0-9]+/i, function (lexeme) {
            this.yytext = lexeme;
            return LEX.REGFP;
        }).addRule(/[Rr][0-9]+/i, function (lexeme) {
            this.yytext = lexeme;
            return LEX.REGGP;
        }).addRule(/[A-Za-z_][A-Za-z0-9_]*/i, function (lexeme) {
            this.yytext = lexeme;
            return LEX.ID;
        }).addRule(/[A-Za-z_][A-Za-z0-9_]*:/i, function (lexeme) {
            this.yytext = lexeme;
            return LEX.LABEL;
        }).addRule(/[+-]?[0-9]*"("[Rr][0-9]+")"/i, function (lexeme) {
            this.yytext = lexeme;
            return LEX.ADDRESS;
        }).addRule(/^[0-9]+/i, function (lexeme) {
            return;
        }).addRule(/[ \t\v\f]+/i, function (lexeme) {
            return;
        }).addRule(/(.|\n)/i, function (lexeme) {
            return;
        });
    }

    setInput(input: string) {
        this._lexer.input = input;
    }

    lex() {
        let value = this._lexer.lex();
        return {
            value: value,
            yytext: this._lexer.yytext
        }
    }
}