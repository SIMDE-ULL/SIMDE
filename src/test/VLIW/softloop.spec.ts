import test from 'ava';
import { VLIW } from '../../core/VLIW/VLIW';
import { VLIWCode } from '../../core/VLIW/VLIWCode';
import { Code } from '../../core/Common/Code';
import { VLIWError } from '../../core/VLIW/VLIWError';

let vliw: VLIW;
let code: VLIWCode;
let superescalarCode: Code;

test.beforeEach('Setup machine', () => {
	vliw = new VLIW();
	vliw.init(true);
    code = new VLIWCode();
    superescalarCode = new Code();
});

test('Buclesoft.pla is executed properly', t => {
    const inputVLIW = 
    `18
    2	0 0 0 0	2 0 1 0
    4	1 0 0 0	4 0 1 0	3 4 0 0	5 4 1 0
    0
    0
    0
    2	6 2 1 0	7 4 0 0
    0
    0
    1	8 0 0 0
    3	10 2 1 0	9 4 0 0	11 4 1 0
    0
    0
    2	12 0 0 0	13 0 1 0
    3	16 2 1 2	15 4 0 2	14 5 0 0 9 1 2
    0
    0
    0
    1	17 4 0 0`;

    const inputSuperescalar = `18
	ADDI	R2 R0 #50
	ADDI	R3 R0 #70
	ADDI	R4 R0 #40
	LF	F0 (R4)
	ADDI	R5 R2 #16
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
	SF	F2 (R3)
	ADDF	F2 F1 F0
	SF	F2 1(R3)`;

    superescalarCode.load(inputSuperescalar);
    code.load(inputVLIW, superescalarCode);
    vliw.code = code;
    
    while (vliw.tic() !== VLIWError.ENDEXE) { }

    t.deepEqual(vliw.status.cycle, 101, 'softloop: Bad pc at finish');

    
});