import * as LexerJs from 'lex';

export interface Lexema {
   value?: any;
   yytext?: any;
}

export enum LEX {
   INMEDIATE = 1,
   REGFP,
   REGGP,
   ID,
   LABEL,
   ADDRESS,
   LINESNUMBER
}

export class Lexer {

   private LEX: LEX;

   private _lexer;

   constructor() {

      this._lexer = new LexerJs();

      this._lexer.addRule(/^[0-9]+/i, function (lexeme) {
         this.yytext = lexeme;
         return LEX.LINESNUMBER;
      }).addRule(/[Ff][0-9]+/i, function (lexeme) {
         this.yytext = lexeme;
         return LEX.REGFP;
      }).addRule(/[Rr][0-9]+/i, function (lexeme) {
         this.yytext = lexeme;
         return LEX.REGGP;
      }).addRule(/#[+-]?[0-9]+/i, function (lexeme) {
         this.yytext = lexeme;
         return LEX.INMEDIATE;
      }).addRule(/[A-Za-z][A-Za-z0-9]*\:/i, function (lexeme) {
         this.yytext = lexeme;
         return LEX.LABEL;
      }).addRule(/[A-Za-z][A-Za-z0-9]*/i, function (lexeme) {
         this.yytext = lexeme;
         return LEX.ID;
      }).addRule(/[+-]?[0-9]*\([Rr][0-9]+\)/i, function (lexeme) {
         this.yytext = lexeme;
         return LEX.ADDRESS;
      }).addRule(/^[0-9]+/i, function (lexeme) {
         return;
      }).addRule(/[ \t\v\f]+/i, function (lexeme) {
         return;
      }).addRule(/(.|\n)/i, function (lexeme) {
         return;
      }).addRule(/\/\/.*/, function (lexeme) {
         return;
      });
   }

   setInput(input: string) {
      this._lexer.input = input;
   }

   lex(): Lexema {
      let value = this._lexer.lex();
      return {
         value: value,
         yytext: this._lexer.yytext
      };
   }
}
