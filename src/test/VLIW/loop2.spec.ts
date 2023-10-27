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

test('Bucle2.pla is executed properly', t => {
    const inputVLIW = 
    `15
    2	0 0 0 0	2 0 1 0
    3	1 0 0 0	4 0 1 0	3 4 0 0
    2	5 4 0 0	6 4 1 0
    0
    0
    0
    2	7 2 0 0	8 2 1 0
    0
    0
    0
    2	9 4 0 0	10 4 1 0
    0
    1	11 0 0 0
    1	13 5 0 0 2 1 2
    1	12 0 1 0`;

    const inputSuperescalar = `14
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
	BNE	R2 R5 LOOP`;

    superescalarCode.load(inputSuperescalar);
    code.load(inputVLIW, superescalarCode);
    vliw.code = code;
    
    while (vliw.tic() !== VLIWError.ENDEXE) { }

    t.deepEqual(vliw.status.cycle, 108, 'Loop2 : Bad pc at finish');

    
});