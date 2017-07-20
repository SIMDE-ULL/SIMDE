import { test } from 'ava';
import { Superescalar } from '../core/superescalar/Superescalar';
import { SuperescalarStatus } from '../core/superescalar/SuperescalarEnums';

import { Code } from '../core/common/Code';

let superescalar = new Superescalar();
let code;

test.beforeEach('Setup machine', () => {
   superescalar = new Superescalar();
   superescalar.init(true);
   code = new Code();
});

test('Code 1 is executed properly', t => {
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
   code.load(input);
   superescalar.code = code;
   while (superescalar.tic() !== SuperescalarStatus.SUPER_ENDEXE) { }
   t.deepEqual(superescalar.status.cycle, 72);
});

test('Code 2 is executed properly', t => {
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
   code.load(input);
   superescalar.code = code;
   while (superescalar.tic() !== SuperescalarStatus.SUPER_ENDEXE) { }
   t.deepEqual(superescalar.status.cycle, 68);
});

test('Code 3 is executed properly', t => {
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
   code.load(input);
   superescalar.code = code;
   while (superescalar.tic() !== SuperescalarStatus.SUPER_ENDEXE) { }
   t.deepEqual(superescalar.status.cycle, 61);
});

test('Code 4 is executed properly', t => {
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
   code.load(input);
   superescalar.code = code;
   while (superescalar.tic() !== SuperescalarStatus.SUPER_ENDEXE) { }
   t.deepEqual(superescalar.status.cycle, 43);
});

test('Code 5 is executed properly', t => {
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
   code.load(input);
   superescalar.code = code;
   while (superescalar.tic() !== SuperescalarStatus.SUPER_ENDEXE) { }
   t.deepEqual(superescalar.status.cycle, 107);
});

test('Code 6 is executed properly', t => {
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
   code.load(input);
   superescalar.code = code;
   while (superescalar.tic() !== SuperescalarStatus.SUPER_ENDEXE) { }
   t.deepEqual(superescalar.status.cycle, 31);
});

test('Code 7 is executed properly', t => {
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
   code.load(input);
   superescalar.code = code;
   while (superescalar.tic() !== SuperescalarStatus.SUPER_ENDEXE) { }
   t.deepEqual(superescalar.status.cycle, 69);
});

test('Code 8 is executed properly', t => {
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
   code.load(input);
   superescalar.code = code;
   while (superescalar.tic() !== SuperescalarStatus.SUPER_ENDEXE) { }
   t.deepEqual(superescalar.status.cycle, 62);
});

test('Code 10 is executed properly', t => {
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
   code.load(input);
   superescalar.code = code;
   while (superescalar.tic() !== SuperescalarStatus.SUPER_ENDEXE) { }
   t.deepEqual(superescalar.status.cycle, 14);
});
