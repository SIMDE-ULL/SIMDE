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

test('multiwayvliw.pla is executed properly', t => {
    const inputVLIW = 
    `11
    2	0 0 0 0	1 0 1 0
    3	2 0 0 0	3 4 0 0	4 4 1 0
    0
    0
    1	5 5 0 0 6 1 2
    2	6 2 0 2	8 5 0 1 7 3 4
    2	9 2 0 4	11 2 1 3
    0
    0
    0
    1	12 4 0 0`;

    const inputSuperescalar = `13
        ADDI	R10, R0, #10
        ADDI	R1, R0, #0
        ADDI	R2, R0, #1
        LF			F1, 0(R10)
        LF			F2, 1(R10)
        BNE		R32, R1, A
        ADDF		F3, F1, F0
        BEQ		R0, R0, FIN
    A:
        BNE		R32, R2, B
        ADDF		F3, F2, F0
        BEQ		R0, R0, FIN
    B:
        ADDF		F3, F2, F1
    FIN:
        SF			F3, 2(R10)`;

    superescalarCode.load(inputSuperescalar);
    code.load(inputVLIW, superescalarCode);
    vliw.code = code;
    
    while (vliw.tic() !== VLIWError.ENDEXE) { }

    t.deepEqual(vliw.status.cycle, 16, 'multiwayvliw: Bad pc at finish');

    
});