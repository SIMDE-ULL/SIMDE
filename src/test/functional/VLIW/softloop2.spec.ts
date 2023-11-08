import test from 'ava';
import { VLIW } from '../../../core/VLIW/VLIW';
import { VLIWCode } from '../../../core/VLIW/VLIWCode';
import { Code } from '../../../core/Common/Code';
import { VLIWError } from '../../../core/VLIW/VLIWError';
import { codeInput, vliwCodeInput } from "../code/buclesoft2";

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
    superescalarCode.load(codeInput);
    code.load(vliwCodeInput, superescalarCode);
    vliw.code = code;
    
    while (vliw.tic() !== VLIWError.ENDEXE) { }

    t.deepEqual(vliw.status.cycle, 60, 'sodtloop2: Bad pc at finish'); //TODO: this is not the pc

    
});