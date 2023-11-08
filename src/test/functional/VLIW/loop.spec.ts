import test from 'ava';
import { VLIW } from '../../../core/VLIW/VLIW';
import { VLIWCode } from '../../../core/VLIW/VLIWCode';
import { Code } from '../../../core/Common/Code';
import { VLIWError } from '../../../core/VLIW/VLIWError';
import { codeInput, vliwCodeInput } from "../code/bucle";

let vliw: VLIW;
let code: VLIWCode;
let superescalarCode: Code;

test.beforeEach('Setup machine', () => {
	vliw = new VLIW();
	vliw.init(true);
    code = new VLIWCode();
    superescalarCode = new Code();
});

test('Bucle.pla is executed properly', t => {
    superescalarCode.load(codeInput);
    code.load(vliwCodeInput, superescalarCode);
    vliw.code = code;
    
    while (vliw.tic() !== VLIWError.ENDEXE) { }

    // Check where the program counter is
    t.deepEqual(vliw.status.cycle, 212, 'Bad pc at finish'); //TODO: this is not the pc

    
});
