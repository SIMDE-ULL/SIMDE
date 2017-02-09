let Lexer = require("lex");

export function parse() {

    const LEX = {
        INMEDIATE: 1,
        REGFP: 2,
        REGGP: 3,
        ID: 4,
        LABEL: 5,
        ADDRESS: 6,
        LINESNUMBER: 7
    }

    let lexer = new Lexer;

    lexer.addRule(/^[0-9]+/i, function (lexeme) {
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

    this.setInput = function (input) {
        lexer.input = input;
    }

    this.doLex = function () {
        let value = lexer.lex();
        return {
            value: value,
            yytext: lexer.yytext
        }
    }
    return {
        setInput: setInput,
        lex: doLex
    }
};
