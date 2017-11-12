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

test('bucleint is executed properly', t => {
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
	t.deepEqual(superescalar.gpr.content[1], 125);	
	t.deepEqual(superescalar.gpr.content[2], 2);
	t.deepEqual(superescalar.gpr.content[3], 5);
	t.deepEqual(superescalar.gpr.content[4], 5);
	t.deepEqual(superescalar.gpr.content[5], 122);
});