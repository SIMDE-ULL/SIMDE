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
	t.deepEqual(superescalar.gpr.content[2], 66);
	t.deepEqual(superescalar.gpr.content[3], 86);
	t.deepEqual(superescalar.gpr.content[4], 40);
	t.deepEqual(superescalar.gpr.content[5], 66);
});