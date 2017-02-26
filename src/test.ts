import { Parser } from './core/Parser';
import { Code } from './core/Code';

const input = `2
ADDI	R2 R0 #50
ADD     R3 R0 R2
`

const input2 = `1
LF	F0 (R4)
`
const input3 = `3
LF 	F1 (R2)
LOOP:
ADDF F1 F1 F0
BNE	R2 R5 LOOP
`;



let code: Code = new Code();
code.load(input);
console.log('Lines', code.lines);
console.log('Instructions', code.instructions);
console.log('Basic block', code.numberOfBlocks);
console.log('Basic block', code.basicBlocks);

// code = new Code();
// code.load(input2);
// console.log('Lines', code.lines);
// console.log('Instructions', code.instructions);
// console.log('Basic block', code.numberOfBlocks);
// console.log('Basic block', code.basicBlocks);

// code = new Code();
// code.load(input3);
// console.log('Lines', code.lines);
// console.log('Instructions', code.instructions);
// console.log('Basic block', code.numberOfBlocks);
// console.log('Basic block', code.basicBlocks);

// let parser: Parser = new Parser();

// parser.setInput(input);

// console.log(parser.lex());
// console.log(parser.lex());
// console.log(parser.lex());
/*
`11
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
*/