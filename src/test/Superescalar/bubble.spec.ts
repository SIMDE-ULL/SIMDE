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


test('Code 10 is executed properly', t => {
	const input = `13
    ADDI    R1 R0 #1
    LW      R2 40(R0)
LOOP1:
    ADD    R3 R0 R0
    SUB     R4 R2 R1
LOOP2:
    LW      R5 41(R3)
    LW      R6 42(R3)
    BGT     R6 R4 NOINCR
    SW      R6 41(R3)
    SW      R5 42(R3)
NOINCR:
    ADDI    R3 R3 #1
    BGT     R4 R3 LOOP2
    ADDI    R1 R1 #1
    BGT     R2 R1 LOOP1
    `;
	code.load(input);
	superescalar.code = code;
	while (superescalar.tic() !== SuperescalarStatus.SUPER_ENDEXE) { }
    t.deepEqual(superescalar.status.cycle, 22);
    t.deepEqual(superescalar.gpr.content[1], 2);
    t.deepEqual(superescalar.gpr.content[2], 0);
	t.deepEqual(superescalar.gpr.content[3], 1);
	t.deepEqual(superescalar.gpr.content[4], -1);
	t.deepEqual(superescalar.gpr.content[5], 0);
});
