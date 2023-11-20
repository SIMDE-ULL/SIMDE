import anyTest, { TestFn } from 'ava';
import { VLIW } from '../../../core/VLIW/VLIW';
import { VLIWCode } from '../../../core/VLIW/VLIWCode';
import { Code } from '../../../core/Common/Code';
import { VLIWError } from '../../../core/VLIW/VLIWError';
import { codeInput, vliwCodeInput, vecContent, sumContent, resultContent } from "../code/bucle";
import { codeInput as codeInput2, vliwCodeInput as vliwCodeInput2 } from "../code/bucle2";
import { codeInput as codeInput3, vliwCodeInput as vliwCodeInput3 } from "../code/bucle3";
import { codeInput as codeInput4, vliwCodeInput as vliwCodeInput4 } from "../code/bucle4";
import { codeInput as doubleCodeInput, vliwCodeInput as doubleVliwCodeInput } from "../code/bucledoble";
import { codeInput as softCodeInput, vliwCodeInput as softVliwCodeInput } from "../code/buclesoft";
import { codeInput as softCodeInput2, vliwCodeInput as softVliwCodeInput2 } from "../code/buclesoft2";

const test = anyTest as TestFn<{ code: VLIWCode, superescalarCode: Code, machine: VLIW }>;

test.beforeEach('Setup machine', t => {
    t.context.code = new VLIWCode();
    t.context.superescalarCode = new Code();
    t.context.machine = new VLIW();
    t.context.machine.init(true);
});

test('Bucle.pla is executed properly', t => {
    // Load code
    t.context.superescalarCode.load(codeInput);
    t.context.code.load(vliwCodeInput, t.context.superescalarCode);
    t.context.machine.code = t.context.code;

    // Load memory
    t.context.machine.memory.setDatum(40, sumContent);
    for (let i = 50; i < vecContent.length + 50; i++) {
        t.context.machine.memory.setDatum(i, vecContent[i - 50]);
    }

    // Execute code
    while (t.context.machine.tic() !== VLIWError.ENDEXE) { }

    // Check where the program counter is
    t.deepEqual(t.context.machine.pc, 15, 'Bad pc at finish');

    // Check the result
    for (let i = 70; i < resultContent.length + 70; i++) {
        t.deepEqual(t.context.machine.memory.getDatum(i).datum, resultContent[i - 70], `Bad result at position ${i}, expected ${resultContent[i - 70]} but got ${t.context.machine.memory.getDatum(i)}`);
    }

    // Check the cycles
    // 2 (loop init) + 16 * 13 (loop) + 1 (jump final extra step) = 211 + 1
    t.deepEqual(t.context.machine.status.cycle, 212, 'Bad number of cycles');
})

test('Bucle2.pla is executed properly', t => {
    // Load code
    t.context.superescalarCode.load(codeInput2);
    t.context.code.load(vliwCodeInput2, t.context.superescalarCode);
    t.context.machine.code = t.context.code;

    // Load memory
    t.context.machine.memory.setDatum(40, sumContent);
    for (let i = 50; i < vecContent.length + 50; i++) {
        t.context.machine.memory.setDatum(i, vecContent[i - 50]);
    }

    // Execute code
    while (t.context.machine.tic() !== VLIWError.ENDEXE) { }


    // Check where the program counter is
    t.deepEqual(t.context.machine.pc, 15, 'Bad pc at finish');

    // Check the result
    for (let i = 70; i < resultContent.length + 70; i++) {
        t.deepEqual(t.context.machine.memory.getDatum(i).datum, resultContent[i - 70], `Bad result at position ${i}, expected ${resultContent[i - 70]} but got ${t.context.machine.memory.getDatum(i)}`);
    }

    // Check the cycles
    // 2 (loop init) + 16/2 * 13 (2 loops) + 1 (jump final extra step) = 107 + 1
    t.deepEqual(t.context.machine.status.cycle, 108, 'Bad number of cycles');
})

test('Bucle3.pla is executed properly', t => {
    // Load code
    t.context.superescalarCode.load(codeInput3);
    t.context.code.load(vliwCodeInput3, t.context.superescalarCode);
    t.context.machine.code = t.context.code;

    // Load memory
    t.context.machine.memory.setDatum(40, sumContent);
    for (let i = 50; i < vecContent.length + 50; i++) {
        t.context.machine.memory.setDatum(i, vecContent[i - 50]);
    }

    // Execute code
    while (t.context.machine.tic() !== VLIWError.ENDEXE) { }


    // Check where the program counter is
    t.deepEqual(t.context.machine.pc, 16, 'Bad pc at finish');

    // Check the result
    for (let i = 70; i < resultContent.length + 70; i++) {
        t.deepEqual(t.context.machine.memory.getDatum(i).datum, resultContent[i - 70], `Bad result at position ${i}, expected ${resultContent[i - 70]} but got ${t.context.machine.memory.getDatum(i)}`);
    }

    // Check the cycles
    // 2 (loop init) + 16/4 * 14 (4 loops) + 1 (jump final extra step) = 59 + 1
    t.deepEqual(t.context.machine.status.cycle, 60, 'Bad number of cycles');
})

test('Bucle4.pla is executed properly', t => {
    // Load code
    t.context.superescalarCode.load(codeInput4);
    t.context.code.load(vliwCodeInput4, t.context.superescalarCode);
    t.context.machine.code = t.context.code;

    // Load memory
    t.context.machine.memory.setDatum(40, sumContent);
    for (let i = 50; i < vecContent.length + 50; i++) {
        t.context.machine.memory.setDatum(i, vecContent[i - 50]);
    }

    // Execute code
    while (t.context.machine.tic() !== VLIWError.ENDEXE) { }


    // Check where the program counter is
    t.deepEqual(t.context.machine.pc, 18, 'Bad pc at finish');

    // Check the result
    for (let i = 70; i < resultContent.length + 70; i++) {
        t.deepEqual(t.context.machine.memory.getDatum(i).datum, resultContent[i - 70], `Bad result at position ${i}, expected ${resultContent[i - 70]} but got ${t.context.machine.memory.getDatum(i)}`);
    }

    // Check the cycles
    // 2 (loop init) + 16/8 * 16 (4 loops) + 1 (jump final extra step) = 35 + 1
    t.deepEqual(t.context.machine.status.cycle, 36, 'Bad number of cycles');
})

test('Buclesoft.pla is executed properly', t => {
    // Load code
    t.context.superescalarCode.load(softCodeInput);
    t.context.code.load(softVliwCodeInput, t.context.superescalarCode);
    t.context.machine.code = t.context.code;

    // Load memory
    t.context.machine.memory.setDatum(40, sumContent);
    for (let i = 50; i < vecContent.length + 50; i++) {
        t.context.machine.memory.setDatum(i, vecContent[i - 50]);
    }

    // Execute code
    while (t.context.machine.tic() !== VLIWError.ENDEXE) { }


    // Check where the program counter is
    t.deepEqual(t.context.machine.pc, 18, 'Bad pc at finish');

    // Check the result
    for (let i = 70; i < resultContent.length + 70; i++) {
        t.deepEqual(t.context.machine.memory.getDatum(i).datum, resultContent[i - 70], `Bad result at position ${i}, expected ${resultContent[i - 70]} but got ${t.context.machine.memory.getDatum(i)}`);
    }

    // Check the cycles
    // 9 (loop init + 2 loops) + 14 * 6 (loop) + 3 (final) + 4(last inst latency) = 100 + 1
    t.deepEqual(t.context.machine.status.cycle, 101, 'Bad number of cycles');
})

test('Buclesoft2.pla is executed properly', t => {
    // Load code
    t.context.superescalarCode.load(softCodeInput2);
    t.context.code.load(softVliwCodeInput2, t.context.superescalarCode);
    t.context.machine.code = t.context.code;

    // Load memory
    t.context.machine.memory.setDatum(40, sumContent);
    for (let i = 50; i < vecContent.length + 50; i++) {
        t.context.machine.memory.setDatum(i, vecContent[i - 50]);
    }

    // Execute code
    while (t.context.machine.tic() !== VLIWError.ENDEXE) { }


    // Check where the program counter is
    t.deepEqual(t.context.machine.pc, 20, 'Bad pc at finish');

    // Check the result
    for (let i = 70; i < resultContent.length + 70; i++) {
        t.deepEqual(t.context.machine.memory.getDatum(i).datum, resultContent[i - 70], `Bad result at position ${i}, expected ${resultContent[i - 70]} but got ${t.context.machine.memory.getDatum(i)}`);
    }

    // Check the cycles
    // 10 (loop init + 4 loops) + 12/2 * 7 (2 loops) + 3 (final) + 4(last inst latency) = 59 + 1
    t.deepEqual(t.context.machine.status.cycle, 60, 'Bad number of cycles');
})

//TODO: The double loop VLIW code is incorrect
/*test('Bucledoble.pla is executed properly', t => {
    // Load code
    t.context.superescalarCode.load(doubleCodeInput);
    t.context.code.load(doubleVliwCodeInput, t.context.superescalarCode);
    t.context.machine.code = t.context.code;

    // Load memory
    t.context.machine.memory.setDatum(40, sumContent);
    for (let i = 50; i < vecContent.length + 50; i++) {
        t.context.machine.memory.setDatum(i, vecContent[i - 50]);
    }

    // Execute code
    while (t.context.machine.tic() !== VLIWError.ENDEXE) { }


    // Check where the program counter is
    t.deepEqual(t.context.machine.pc, 10, 'Bad pc at finish');

    // Check the result
    for (let i = 70; i < resultContent.length + 70; i++) {
        t.deepEqual(t.context.machine.memory.getDatum(i).datum, resultContent[i - 70], `Bad result at position ${i}, expected ${resultContent[i - 70]} but got ${t.context.machine.memory.getDatum(i)}`);
    }

    // Check the cycles
    // 2 (loop init) + 16 * 8 (loop) + 4(jump latency) = 100 + 1
    t.deepEqual(t.context.machine.status.cycle, 101, 'Bad number of cycles');
})*/

