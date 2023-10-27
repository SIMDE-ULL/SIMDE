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

test('Bucle3.pla is executed properly', t => {
    const inputVLIW = 
    `16
    2	0 0 0 0	2 0 1 0
    3	1 0 0 0	4 0 1 0	3 4 0 0
    2	5 4 0 0	6 4 1 0
    2	7 4 0 0	8 4 1 0
    0
    0
    2	9 2 0 0	10 2 1 0
    2	11 2 0 0	12 2 1 0
    0
    0
    2	13 4 0 0	14 4 1 0
    2	15 4 0 0	16 4 1 0
    0
    1	17 0 0 0
    1	19 5 0 0 2 1 2
    1	18 0 1 0`;

    const inputSuperescalar = `20
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
	BNE	R2 R5 LOOP`;

    superescalarCode.load(inputSuperescalar);
    code.load(inputVLIW, superescalarCode);
    vliw.code = code;
    
    while (vliw.tic() !== VLIWError.ENDEXE) { }

    t.deepEqual(vliw.status.cycle, 60, 'Loop 3 :Bad pc at finish');

    
});