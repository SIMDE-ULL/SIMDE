import anyTest, { TestFn } from 'ava';
import { VLIW } from '../../../core/VLIW/VLIW';
import { VLIWCode } from '../../../core/VLIW/VLIWCode';
import { Code } from '../../../core/Common/Code';
import { VLIWError } from '../../../core/VLIW/VLIWError';
import { codeInput, vliwCodeInput } from "../code/multiwayvliw1";

let vliw: VLIW;
let code: VLIWCode;
let superescalarCode: Code;

const test = anyTest as TestFn<{ code: VLIWCode, superescalarCode: Code, machine: VLIW }>;

test.beforeEach('Setup machine', t => {
    t.context.code = new VLIWCode();
    t.context.superescalarCode = new Code();
    t.context.machine = new VLIW();
    t.context.machine.init(true);
});

test('multiwayvliw.pla is executed properly with first parameter', t => {
    // Load code
    t.context.superescalarCode.load(codeInput);
    t.context.code.load(vliwCodeInput, t.context.superescalarCode);
    t.context.machine.code = t.context.code;

    // Load memory
    t.context.machine.memory.setDatum(10, 1.1);
    t.context.machine.memory.setDatum(11, 2.2);
    t.context.machine.setGpr(32, 0);

    // Execute code
    while (t.context.machine.tic() !== VLIWError.ENDEXE) { }

    // Check where the program counter is
    t.deepEqual(t.context.machine.pc, 11, 'Bad pc at finish');

    // Check the result
    t.deepEqual(t.context.machine.memory.getDatum(12).datum, 1.1, `Bad result at position 12, expected 1.1 but got ${t.context.machine.memory.getDatum(12)}`);

    // Check the cycles
    // 6 + 5 + 1 + 3 (last inst latency) = 15 + 1
    t.deepEqual(t.context.machine.status.cycle, 16, 'Bad number of cycles');
});

test('multiwayvliw.pla is executed properly with second parameter', t => {
    // Load code
    t.context.superescalarCode.load(codeInput);
    t.context.code.load(vliwCodeInput, t.context.superescalarCode);
    t.context.machine.code = t.context.code;

    // Load memory
    t.context.machine.memory.setDatum(10, 1.1);
    t.context.machine.memory.setDatum(11, 2.2);
    t.context.machine.setGpr(32, 1);

    // Execute code
    while (t.context.machine.tic() !== VLIWError.ENDEXE) { }

    // Check where the program counter is
    t.deepEqual(t.context.machine.pc, 11, 'Bad pc at finish');

    // Check the result
    t.deepEqual(t.context.machine.memory.getDatum(12).datum, 2.2, `Bad result at position 12, expected 2.2 but got ${t.context.machine.memory.getDatum(12)}`);

    // Check the cycles
    // 6 + 5 + 1 + 3 (last inst latency) = 15 + 1
    t.deepEqual(t.context.machine.status.cycle, 16, 'Bad number of cycles');
});

test('multiwayvliw.pla is executed properly with third parameter', t => {
    // Load code
    t.context.superescalarCode.load(codeInput);
    t.context.code.load(vliwCodeInput, t.context.superescalarCode);
    t.context.machine.code = t.context.code;

    // Load memory
    t.context.machine.memory.setDatum(10, 1.1);
    t.context.machine.memory.setDatum(11, 2.2);
    t.context.machine.setGpr(32, 2);

    // Execute code
    while (t.context.machine.tic() !== VLIWError.ENDEXE) { }

    // Check where the program counter is
    t.deepEqual(t.context.machine.pc, 11, 'Bad pc at finish');

    // Check the result
    t.deepEqual(Math.round(t.context.machine.memory.getDatum(12).datum * 10) / 10, 3.3, `Bad result at position 12, expected 2.2 but got ${t.context.machine.memory.getDatum(12)}`);

    // Check the cycles
    // 6 + 5 + 3 (last inst latency) = 14 + 1
    t.deepEqual(t.context.machine.status.cycle, 16, 'Bad number of cycles');
});