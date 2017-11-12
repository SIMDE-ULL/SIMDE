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

test('buclesoft2 is executed properly', t => {
	const input = `10
    ADDI R1 R0 #3
    ADDI R2 R0 #2
    SLLV R3 R1 R2
    SRLV R4 R1 R2
    ADDI R5 R0 #11
    ADDI R6 R0 #6
    OR   R7 R5 R6
    AND  R8 R5 R6
    NOR  R9 R5 R6
    XOR  R10 R5 R6    
    `;
	code.load(input);
	superescalar.code = code;
	while (superescalar.tic() !== SuperescalarStatus.SUPER_ENDEXE) { }
    t.deepEqual(superescalar.status.cycle, 10);
    t.deepEqual(superescalar.gpr.content[1], 3);    
    t.deepEqual(superescalar.gpr.content[2], 2);
	t.deepEqual(superescalar.gpr.content[3], 16);
	t.deepEqual(superescalar.gpr.content[4], 0);
    t.deepEqual(superescalar.gpr.content[5], 11);
    t.deepEqual(superescalar.gpr.content[6], 6);
    t.deepEqual(superescalar.gpr.content[7], 16);    
});
