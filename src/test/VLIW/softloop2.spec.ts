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
    `20
    2	0 0 0 0	2 0 1 0
    4	1 0 0 0	4 0 1 0	3 4 0 0	5 4 1 0
    1	6 4 0 0
    0
    0
    2	7 2 0 0	9 4 0 0
    2	8 2 0 0	10 4 0 0
    0
    0
    1	11 0 0 0
    4	14 2 0 0	15 2 1 0	12 4 0 0	13 4 1 0
    2	16 4 0 0	17 4 1 0
    0
    1	19 0 0 0
    1	18 0 1 0
    5	23 2 0 2	24 2 1 2	21 4 0 2	22 4 1 2	20 5 0 0 10 1 2
    0
    0
    0
    2	25 4 0 0	26 4 1 0`;

    const inputSuperescalar = `27
	ADDI	R2 R0 #50
	ADDI	R3 R0 #70
	ADDI	R4 R0 #40
	LF	F0 (R4)
	ADDI	R5 R2 #16
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
	SF	F2 (R3)
	SF	F4 1(R3)
	ADDF	F2 F1 F0
	ADDF	F4 F3 F0
	SF	F2 2(R3)
	SF	F4 3(R3)`;

    superescalarCode.load(inputSuperescalar);
    code.load(inputVLIW, superescalarCode);
    vliw.code = code;
    
    while (vliw.tic() !== VLIWError.ENDEXE) { }

    t.deepEqual(vliw.status.cycle, 60, 'sodtloop2: Bad pc at finish');

    
});