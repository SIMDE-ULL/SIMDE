import { TokenError } from "typescript-parsec";
import { expect, test } from "vitest";
import { Code } from "../../../../core/Common/Code";

const input = `2
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
test("Lines are being parsed properly", (t) => {
  let code: Code = new Code();
  code.load(input);
  expect(2).toBe(code.lines);
  code = new Code();
  code.load(input2);
  expect(1).toBe(code.lines);
});

test("Lines counter is ignored", (t) => {
  const input = `1
        LF F1 (R2)
        LOOP:
        ADDF F1 F1 F0
        BNE	R2 R5 LOOP
        `;
  const code: Code = new Code();
  code.load(input);
  expect(3).toBe(code.lines);
});

test("Lines counter can be ommited", (t) => {
  const input = `LF F1 (R2)
        LOOP:
        ADDF F1 F1 F0
        BNE	R2 R5 LOOP
        `;
  const code: Code = new Code();
  code.load(input);
  expect(3).toBe(code.lines);
});

test("Code comments on top should not affect the parsing", (t) => {
  // Code input with comments at the beginning of the file
  const input = `// This is a comment
	// And just another comment
	ADDI	R2 R0 #50
	ADD     R3 R0 R2
	`;
  const code = new Code();
  code.load(input);

  expect(2).toBe(code.lines);
});

test("Inline code comments should not affect the parsing", (t) => {
  // Code input with an inline comment
  const input = `ADD R0 R1 R2 // Comment should work here
	`;
  const code = new Code();
  code.load(input);

  expect(1).toBe(code.lines);
});

test("Last line may include a comment", (t) => {
  // Code input with a comment in last line
  const input = `ADDI	R2 R0 #50
	ADD     R3 R0 R2 // Comment should work here as well`;
  const code = new Code();
  code.load(input);

  expect(2).toBe(code.lines);
});

test("Lines may end with CRLF style newlines", (t) => {
  // Code input with CRLF newlines
  const input =
    "ADDI\tR2 R0 #50\r\n\t  ADD     R3 R0 R2 // Comment right before CRLF \r\n";

  const code = new Code();
  code.load(input);

  expect(2).toBe(code.lines);
});

test("Parsing operand errors are being thrown", (t) => {
  const input = `3
        LF F1 (R2)
        LOOP:
        ADDF F1 F1 H0
        BNE	R2 R5 LOOP
        `;
  const code: Code = new Code();
  expect(() => code.load(input)).toThrowError(
    '{"index":43,"rowBegin":4,"columnBegin":9,"rowEnd":4,"columnEnd":13}: Invalid instruction format for ADDF. Expected TwoFloatingRegisters format, got Jump format or similar',
  );
});

test("Parsing addresses errors are being throw", (t) => {
  const input = `3
    LF F1 (R-2)
    LOOP:
    ADDF F1 F1 F0
    BNE	R2 R5 LOOP
    `;

  const code = new Code();
  expect(() => code.load(input)).toThrowError(
    '{"index":6,"rowBegin":2,"columnBegin":5,"rowEnd":2,"columnEnd":7}: Invalid instruction format for LF. Expected FloatingLoadStore format, got Noop format or similar',
  );
});

test("Parsing opcodes errors are being thrown", (t) => {
  const input = `3
    LF F1 (R2)
    LOOP:
    ADF F1 F1 F0
    BNE	R2 R5 LOOP
    `;
  const code: Code = new Code();
  expect(() => code.load(input)).toThrowError(
    '{"index":31,"rowBegin":4,"columnBegin":5,"rowEnd":4,"columnEnd":8}: Unknown opcode "ADF"',
  );
});

test("Repeated labels errors are being thrown", (t) => {
  const input = `3
    LF F1 (R2)
    LOOP:
    ADDF F1 F1 F0
    LOOP:
    BNE	R2 R5 LOOP
    `;
  const code: Code = new Code();
  expect(() => code.load(input)).toThrowError(
    "Error at instruction 2, label LOOP already exists",
  );
});

test("Parsing strange inmediates throws errors", (t) => {
  const input = `1
	ADDI R0 R0 #0x0`;
  const inpu2 = `1
	ADDI R0 R0 #0.0`;
  const inpu3 = `1
	ADDI R0 R0 #(0)`;
  const inpu4 = `1
	ADDI R0 R0 #R0`;
  const code: Code = new Code();

  expect(() => code.load(input)).toThrowError(
    '{"index":16,"rowBegin":2,"columnBegin":15,"rowEnd":2,"columnEnd":17}: Unknown opcode "x0"',
  );
  expect(() => code.load(inpu2)).toThrowError(
    '{"index":16,"rowBegin":2,"columnBegin":15,"rowEnd":2,"columnEnd":15}: Unable to tokenize the rest of the input: .0',
  );
  expect(() => code.load(inpu3)).toThrowError(
    '{"index":14,"rowBegin":2,"columnBegin":13,"rowEnd":2,"columnEnd":13}: Unable to tokenize the rest of the input: #(0)',
  );
  expect(() => code.load(inpu4)).toThrowError(
    '{"index":14,"rowBegin":2,"columnBegin":13,"rowEnd":2,"columnEnd":13}: Unable to tokenize the rest of the input: #R0',
  );
});

test("Parsing strange registers throws errors", (t) => {
  const input = `1
	ADDI R0.0 R0 #0`;
  const inpu2 = `1
	ADDI R0x0 R0 #0`;
  const inpu3 = `1
	ADDI R(0) R0 #0`;
  const code: Code = new Code();

  expect(() => code.load(input)).toThrowError(
    '{"index":10,"rowBegin":2,"columnBegin":9,"rowEnd":2,"columnEnd":9}: Unable to tokenize the rest of the input: .0 R0 #0',
  );
  expect(() => code.load(inpu2)).toThrowError(
    '{"index":3,"rowBegin":2,"columnBegin":2,"rowEnd":2,"columnEnd":6}: Invalid instruction format for ADDI. Expected GeneralRegisterAndInmediate format, got Noop format or similar',
  );
  expect(() => code.load(inpu3)).toThrowError(
    '{"index":3,"rowBegin":2,"columnBegin":2,"rowEnd":2,"columnEnd":6}: Invalid instruction format for ADDI. Expected GeneralRegisterAndInmediate format, got Noop format or similar',
  );
});

test("Parser check bounds", (t) => {
  const input = `1
	ADDI R64 R0 #0`;
  const inpu2 = `1
	ADDF F64 F0 F0`;
  const inpu3 = `1
	SF R0 1024(F0)`;
  const code: Code = new Code();

  expect(() => code.load(input)).toThrowError(
    '{"index":8,"rowBegin":2,"columnBegin":7,"rowEnd":2,"columnEnd":10}: Destination register number out of bounds',
  );
  expect(() => code.load(inpu2)).toThrowError(
    '{"index":8,"rowBegin":2,"columnBegin":7,"rowEnd":2,"columnEnd":10}: Destination register number out of bounds',
  );
  expect(() => code.load(inpu3)).toThrowError(
    '{"index":14,"rowBegin":2,"columnBegin":13,"rowEnd":2,"columnEnd":15}: Address register cannot be FP register',
  );
});

test("Example code 1 does not throws errors", (t) => {
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
  const code: Code = new Code();
  expect(() => code.load(input)).not.toThrowError();
});

test("Example code 2 does not throws errors", (t) => {
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
  const code: Code = new Code();
  expect(() => code.load(input)).not.toThrowError();
});

test("Example code 3 does not throws errors", (t) => {
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
  const code: Code = new Code();
  expect(() => code.load(input)).not.toThrowError();
});

test("Example code 4 does not throws errors", (t) => {
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
  const code: Code = new Code();
  expect(() => code.load(input)).not.toThrowError();
});

test("Example code 5 does not throws errors", (t) => {
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
  const code: Code = new Code();
  expect(() => code.load(input)).not.toThrowError();
});

test("Example code 6 does not throws errors", (t) => {
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
  const code: Code = new Code();
  expect(() => code.load(input)).not.toThrowError();
});

test("Example code 7 does not throws errors", (t) => {
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
  const code: Code = new Code();
  expect(() => code.load(input)).not.toThrowError();
});

test("Example code 8 does not throws errors", (t) => {
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
  const code: Code = new Code();
  expect(() => code.load(input)).not.toThrowError();
});

test("Example code 9 does not throws errors", (t) => {
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
  const code: Code = new Code();
  expect(() => code.load(input)).not.toThrowError();
});

test("Example code 10 does not throws errors", (t) => {
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
  const code: Code = new Code();
  expect(() => code.load(input)).not.toThrowError();
});

test("Example code 11 does not throws errors", (t) => {
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
  const code: Code = new Code();
  expect(() => code.load(input)).not.toThrowError();
});

test("should not error on CRLF newlines", () => {
  const input = "LW R1, 10(R0)\r\nMULT R2, R1, R1\n";
  const code = new Code();
  expect(() => code.load(input)).not.toThrowError(TokenError);
});
