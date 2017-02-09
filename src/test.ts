import { Parser } from './core/Parser';

const input = `11
ADDI	R2 R0 #50
ADDI	R3 R0 #70
ADDI	R4 R0 #40
LF	F0 (R4)
ADDI	R5 R2 #16
LOOP:
LF 	F1 (R2)
ADDF	F1 F1 F0
SF	F1 (R3)
ADDI 	R2 R2 #1
ADDI	R3 R3 #1
BNE	R2 R5 LOOP`

let parser: Parser = new Parser();

parser.setInput(input);

console.log(parser.lex());
console.log(parser.lex());
console.log(parser.lex());