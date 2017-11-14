import { test } from 'ava';
import { Superescalar } from '../../core/Superescalar/Superescalar';
import { SuperescalarStatus } from '../../core/Superescalar/SuperescalarEnums';

import { Code } from '../../core/Common/Code';

let superescalar = new Superescalar();
let code;

test.beforeEach('Setup machine', () => {
	superescalar = new Superescalar();
	superescalar.init(true);
	code = new Code();
});


// TODO INFINITE LOOP?
// test('Despl is executed properly', t => {
// 	const input = `19
// 	ADDI	R33 R0 #-1
// 	ADDI	R1 R0 #10
// 	ADDI	R2 R1 #0
// 	ADDI	R3 R0 #9
// 	SW	R0 (R3)
// 	LF	F0 (R3)
// 	LF	F2 (R3)
// // Inicializo a 1 F1. Para ello uso la posici� 1 de memoria como "puente"
// 	ADDI	R10 R0 #1
// 	SW	R10 1(R0)
// 	LF	F1 1(R0)
// LOOP:
// 	LF	F4 (R2)
// 	LW	R4 1(R2)
// 	BEQ	R4 R0 NOOP
// 	MULTF	F4 F0 F4
// NOOP:
// 	ADDF	F2 F2 F4
// 	// Incremento el contador de la lista
// 	ADDF	F0 F1 F0
// 	LW	R2 2(R2)	
// 	BNE	R2 R33 LOOP
// 	SF	F2 (R3)
   
//     `;
// 	code.load(input);
// 	superescalar.code = code;
// 	while (superescalar.tic() !== SuperescalarStatus.SUPER_ENDEXE) { }
//     t.deepEqual(superescalar.status.cycle, 14);
//     t.deepEqual(superescalar.gpr.content[1], 0);    
//     t.deepEqual(superescalar.gpr.content[2], 3);
// 	t.deepEqual(superescalar.gpr.content[3], -1);
// 	t.deepEqual(superescalar.gpr.content[4], 0);
//     t.deepEqual(superescalar.gpr.content[5], 0);
//     t.deepEqual(superescalar.gpr.content[6], 1);
//     t.deepEqual(superescalar.gpr.content[7], 0);    
// });
