import test from 'ava';
import { Lexer } from '../core/Common/Lexer';
import { Code } from '../core/Common/Code';

const input = `2
ADDI	R2 R0 #50
ADD     R3 R0 R2
`;

const inputWithComments = 
`// This is a comment
// And just another comment
2
ADDI	R2 R0 #50
ADD     R3 R0 R2
`;


const input2 = `1
LF F0 (R4)
`;
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
	code.load(input2);
	t.deepEqual(1, code.lines, 'Lines message should have been 1');
});

test('Commentaries on top should not affect the parsing', t => {
	let code: Code = new Code();
	code.load(inputWithComments);
	t.deepEqual(2, code.lines, 'Lines message should have been 2');
});

test('Parsing operand errors are being thrown', t => {
	const input = `3
        LF F1 (R2)
        LOOP:
        ADDF F1 F1 H0
        BNE	R2 R5 LOOP
        `;
	let code: Code = new Code();
	let error = t.throws(() => code.load(input));
	t.is(error.message, 'Error at line 4, expected: REGFP got: H0');
});

test('Parsing addresses errors are being throw', t => {
	const input = `3
    LF F1 (R-2)
    LOOP:
    ADDF F1 F1 F0
    BNE	R2 R5 LOOP
    `;

	let code = new Code();
	let error = t.throws(() => code.load(input));
	t.is(error.message, 'Error at line 2, expected: ADDRESS got: R');
});

test('Parsing opcodes errors are being thrown', t => {
	const input = `3
    LF F1 (R2)
    LOOP:
    ADF F1 F1 F0
    BNE	R2 R5 LOOP
    `;
	let code: Code = new Code();
	let error = t.throws(() => code.load(input));
	t.is(error.message, 'Error at line 4 unknown opcode ADF');
});

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
	t.is(error.message, 'Error at line 5, label LOOP: already exists');
});

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
});

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
});

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
});

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
});

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
});

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
});

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
});

test('Example code 8 does not throws errors', t => {
	const input = `27
	ADDI	R2 R0 #50
	ADDI	R3 R0 #70
	ADDI	R4 R0 #40
	LF	F0 (R4)
	ADDI	R5 R2 #16
// Código de inicialización
	LF	F1 (R2)
	LF	F3 1(R2)
	ADDF	F2 F1 F0
	ADDF	F4 F3 F0
	LF	F1 2(R2)
	LF	F3 3(R2)
	ADDI	R2 R2 #4
LOOP:
	SF	F2 (R3)
	SF	F4 1(R3)
	ADDF	F2 F1 F0
	ADDF	F4 F3 F0
	LF	F1 (R2)
	LF	F3 1(R2)
	ADDI	R2 R2 #2
	ADDI	R3 R3 #2
	BNE	R2 R5 LOOP
// Código de finalización
	SF	F2 (R3)
	SF	F4 1(R3)
	ADDF	F2 F1 F0
	ADDF	F4 F3 F0
	SF	F2 2(R3)
	SF	F4 3(R3)
    `;
	let code: Code = new Code();
	t.notThrows(() => code.load(input));
});

test('Example code 9 does not throws errors', t => {
	const input = `13
// CODIGO:
	ADDI	R10, R0, #10
	ADDI	R1, R0, #0
	ADDI	R2, R0, #1
	LF		F1, 0(R10)
	LF		F2, 1(R10)
	BNE		R32, R1, A
A:
	ADDF	F3, F1, F0
	BEQ		R0, R0, FIN
	BNE		R32, R2, B
B:
	ADDF	F3, F2, F0
	BEQ		R0, R0, FIN
	ADDF	F3, F2, F1
FIN:
	SF		F3, 2(R10)
    `;
	let code: Code = new Code();
	t.notThrows(() => code.load(input));
});

test('Example code 10 does not throws errors', t => {
	const input = `7
ADDI R2 R0 #3
BGT R0 R2 ET1
ADDI R3 R0 #2
ET1:
SUB R4 R3 R2
BGT R2 R3 ET2
SUB R5 R2 R3
ET2:
SUB R6 R2 R3
    `;
	let code: Code = new Code();
	t.notThrows(() => code.load(input));
});

test('Example code 11 does not throws errors', t => {
	const input = `26
	ADDI	R33 R0 #-1
	ADDI	R34 R0 #400
	ADDI	R1 R0 #-1
	ADDI	R2 R0 #10
// Inicialización de la pila
	ADDI	R31 R0 #500
// Bucle principal
INI:
	LW	R3 (R2)
	LW	R4 1(R2)
// Se guarda el nodo visitado
	SW	R3 (R34)
	ADDI	R34 R34 #1
BUC:
// Si no tiene hijos es un nodo hoja y no hay que recorrer nada
	BEQ	R4 R0 HOJA
// Se almacenan los valores del padre y nº de hijos en la pila
	SW	R1 (R31)
	SW	R4 1(R31)
	ADDI	R31 R31 #2
// Se sustituye el padre por el actual y se carga la dirección del hijo
	ADDI	R1 R2 #0
	ADD	R5 R2 R4
	LW	R2 1(R5)
// se vuelve al principio para visitar el hijo
	BEQ	R0 R0 INI
HOJA:
// Si al llegar aquí se trata de la raíz es que hemos terminado de recorrer el árbol
	BEQ	R1 R33 FIN
// Se sustituye al nodo actual por el padre
	ADDI	R2 R1 #0
// Se saca de la pila el valor del padre y el nº de hijos que quedan por visitar
	LW	R1 -2(R31)
	LW	R4 -1(R31)
	ADDI	R31 R31 #-2
// Se decrementa en 1 el número de hijos
	ADDI	R4 R4 #-1
// Esta línea no es necesaria, simplemente vuelve a poner en R3 el ID del nodo
	LW	R3 (R2)
	BEQ	R0 R0 BUC
FIN:
	// Operación nula: Es necesaria porque el simulador exige que todas las etiquetas
	// vayan asociadas a una operación.
	ADDI	R0 R0 #0`;
	let code: Code = new Code();
	t.notThrows(() => code.load(input));
});
