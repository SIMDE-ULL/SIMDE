import { test } from 'ava';
import { Parser } from './core/Parser';
import { Code } from './core/Code';

const input = `2
ADDI	R2 R0 #50
ADD     R3 R0 R2
`

const input2 = `1
LF F0 (R4)
`
const input3 = `3
LF F1 (R2)
LOOP:
ADDF F1 F1 F0
BNE	R2 R5 LOOP
`;

// =============================
// PARSING ERRORS 
// =============================
test('Lines are being parsed properly', t => {
	let code: Code = new Code();
	code.load(input);
	t.deepEqual(2, code.lines, 'Lines message should have been 2');
	code = new Code();
	code.load(input2)
	t.deepEqual(1, code.lines, 'Lines message should have been 1');
})

test('Parsing operand errors are being thrown', t => {
	const input = `3
        LF F1 (R2)
        LOOP:
        ADDF F1 F1 H0
        BNE	R2 R5 LOOP
        `;
	let code: Code = new Code();
	let error = t.throws(() => code.load(input));
	t.is(error, 'Error at line 4, expected: REGFP got: H0');
})

test('Parsing addresses errors are being throw', t => {
	const input = `3
    LF F1 (R-2)
    LOOP:
    ADDF F1 F1 F0
    BNE	R2 R5 LOOP
    `;

	let code = new Code();
	let error = t.throws(() => code.load(input));
	t.is(error, 'Error at line 2, expected: ADDRESS got: R');
})

test('Parsing opcodes errors are being thrown', t => {
	const input = `3
    LF F1 (R2)
    LOOP:
    ADF F1 F1 F0
    BNE	R2 R5 LOOP
    `;
	let code: Code = new Code();
	let error = t.throws(() => code.load(input));
	t.is(error, 'Error at line 4 unknown opcode ADF');
})

test('Repeated labels errors are being thrown', t => {
	const input = `3
    LF F1 (R2)
    LOOP:
    ADDF F1 F1 F0
    LOOP:
    BNE	R2 R5 LOOP
    `;
	let code: Code = new Code();
	let error = t.throws(() => code.load(input));
	t.is(error, 'Error at line 5, label LOOP: already exists');
})

test('Example code 1 does not throws errors', t => {
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
	BNE	R2 R5 LOOP
    `;
	let code: Code = new Code();
	let error = t.notThrows(() => code.load(input));
})

test('Example code 2 does not throws errors', t => {
	const input = `14
	ADDI	R2 R0 #50
	ADDI	R3 R0 #70
	ADDI	R4 R0 #40
	LF	F0 (R4)
	ADDI	R5 R2 #16
LOOP:
	LF 	F1 (R2)
	LF 	F2 1(R2)
	ADDF	F1 F1 F0
	ADDF	F2 F2 F0
	SF	F1 (R3)
	SF	F2 1(R3)
	ADDI 	R2 R2 #2
	ADDI	R3 R3 #2
	BNE	R2 R5 LOOP
    `;
	let code: Code = new Code();
	t.notThrows(() => code.load(input));
})

test('Example code 3 does not throws errors', t => {
	const input = `20
	ADDI	R2 R0 #50
	ADDI	R3 R0 #70
	ADDI	R4 R0 #40
	LF	F0 (R4)
	ADDI	R5 R2 #16
LOOP:
	LF 	F1 (R2)
	LF 	F2 1(R2)
	LF	F3 2(R2)
	LF	F4 3(R2)
	ADDF	F1 F1 F0
	ADDF	F2 F2 F0
	ADDF	F3 F3 F0
	ADDF	F4 F4 F0
	SF	F1 (R3)
	SF	F2 1(R3)
	SF	F3 2(R3)
	SF	F4 3(R3)
	ADDI 	R2 R2 #4
	ADDI	R3 R3 #4
	BNE	R2 R5 LOOP
    `;
	let code: Code = new Code();
	t.notThrows(() => code.load(input));
})

test('Example code 4 does not throws errors', t => {
	const input = `32
	ADDI	R2 R0 #50
	ADDI	R3 R0 #70
	ADDI	R4 R0 #40
	LF	F0 (R4)
	ADDI	R5 R2 #16
LOOP:
	LF 	F1 (R2)
	LF 	F2 1(R2)
	LF	F3 2(R2)
	LF	F4 3(R2)
	LF 	F5 4(R2)
	LF 	F6 5(R2)
	LF	F7 6(R2)
	LF	F8 7(R2)
	ADDF	F1 F1 F0
	ADDF	F2 F2 F0
	ADDF	F3 F3 F0
	ADDF	F4 F4 F0
	ADDF	F5 F5 F0
	ADDF	F6 F6 F0
	ADDF	F7 F7 F0
	ADDF	F8 F8 F0
	SF	F1 (R3)
	SF	F2 1(R3)
	SF	F3 2(R3)
	SF	F4 3(R3)
	SF	F5 4(R3)
	SF	F6 5(R3)
	SF	F7 6(R3)
	SF	F8 7(R3)
	ADDI 	R2 R2 #8
	ADDI	R3 R3 #8
	BNE	R2 R5 LOOP
    `;
	let code: Code = new Code();
	t.notThrows(() => code.load(input));
})

test('Example code 5 does not throws errors', t => {
	const input = `18
	ADDI	R2 R0 #50
	ADDI	R3 R0 #70
	ADDI	R4 R0 #40
	LF	F0 (R4)
	ADDI	R5 R2 #5
LOOP:
	LF 	F1 (R2)
	ADDF	F1 F1 F0
	SF		F1 (R3)
	ADDI 	R2 R2 #1
	ADDI	R3 R3 #1
	BNE	R2 R5 LOOP
	ADDI	R3 R0 #70
	ADDI	R5 R3 #5
LOOP2:
	LF		F1 (R3)
	MULTF	F1 F1 F0
	SF		F1 (R3)
	ADDI	R3 R3 #1
	BNE	R3 R5 LOOP2
    `;
	let code: Code = new Code();
	t.notThrows(() => code.load(input));
})

test('Example code 6 does not throws errors', t => {
	const input = `8
	ADDI	R1 R0 #1
	ADDI	R2 R0 #2
	ADDI	R3 R0 #0
	ADDI	R4 R0 #5
LOOP:
	MULT	R5 R1 R2
	ADDI	R1 R5 #3
	ADDI	R3 R3 #1
	BNE	R3 R4 LOOP
    `;
	let code: Code = new Code();
	t.notThrows(() => code.load(input));
})

test('Example code 7 does not throws errors', t => {
	const input = `18
	ADDI	R2 R0 #50
	ADDI	R3 R0 #70
	ADDI	R4 R0 #40
	LF	F0 (R4)
	ADDI	R5 R2 #16
// Código de inicialización
	LF	F1 (R2)
	ADDF	F2 F1 F0
	LF	F1 1(R2)
	ADDI	R2 R2 #2
LOOP:
	SF	F2 (R3)
	ADDF	F2 F1 F0
	LF	F1 (R2)
	ADDI	R2 R2 #1
	ADDI	R3 R3 #1
	BNE	R2 R5 LOOP
// Código de finalización
	SF	F2 (R3)
	ADDF	F2 F1 F0
	SF	F2 1(R3)
    `;
	let code: Code = new Code();
	t.notThrows(() => code.load(input));
})

// test('Example code 8 does not throws errors', t => {
//     const input = `27
// 	ADDI	R2 R0 #50
// 	ADDI	R3 R0 #70
// 	ADDI	R4 R0 #40
// 	LF	F0 (R4)
// 	ADDI	R5 R2 #16
// // Código de inicialización
// 	LF	F1 (R2)
// 	LF	F3 1(R2)
// 	ADDF	F2 F1 F0
// 	ADDF	F4 F3 F0
// 	LF	F1 2(R2)
// 	LF	F3 3(R2)
// 	ADDI	R2 R2 #4
// LOOP:
// 	SF	F2 (R3)
// 	SF	F4 1(R3)
// 	ADDF	F2 F1 F0
// 	ADDF	F4 F3 F0
// 	LF	F1 (R2)
// 	LF	F3 1(R2)
// 	ADDI	R2 R2 #2
// 	ADDI	R3 R3 #2
// 	BNE	R2 R5 LOOP
// // Código de finalización
// 	SF	F2 (R3)
// 	SF	F4 1(R3)
// 	ADDF	F2 F1 F0
// 	ADDF	F4 F3 F0
// 	SF	F2 2(R3)
// 	SF	F4 3(R3)
//     `;
//     let code: Code = new Code();
//     t.notThrows(() => code.load(input));
// })

// test('Example code 9 does not throws errors', t => {
//     const input = `13
// // CODIGO:
// 	ADDI	R10, R0, #10
// 	ADDI	R1, R0, #0
// 	ADDI	R2, R0, #1
// A:
// 	LF		F1, 0(R10)
// 	LF		F2, 1(R10)
// B:
// 	BNE		R32, R1, A
// 	ADDF	F3, F1, F0
// FIN:
// 	BEQ		R0, R0, FIN
// 	BNE		R32, R2, B
// 	ADDF	F3, F2, F0
// 	BEQ		R0, R0, FIN
// 	ADDF	F3, F2, F1
// 	SF		F3, 2(R10)
//     `;
//     let code: Code = new Code();
//     // t.notThrows(() => code.load(input));
//     let error = t.throws(() => code.load(input));
//     t.is(error, '');
// })
