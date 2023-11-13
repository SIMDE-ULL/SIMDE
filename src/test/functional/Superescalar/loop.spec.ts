import anyTest, { TestFn } from 'ava';
import { Code } from '../../../core/Common/Code';
import { Superescalar } from '../../../core/Superescalar/Superescalar';
import { SuperescalarStatus } from '../../../core/Superescalar/SuperescalarEnums';
import { codeInput, vecContent, sumContent, resultContent } from "../code/bucle";
import { codeInput as doubleCodeInput } from "../code/bucledoble";
import { codeInput as softCodeInput } from "../code/buclesoft";


const test = anyTest as TestFn<{ code: Code, machine: Superescalar }>;

test.beforeEach(t => {
    t.context.code = new Code();
    t.context.machine = new Superescalar();
    t.context.machine.init(true);
});

test('Bucle.pla is executed properly', t => {
    // Load code
    t.context.code.load(codeInput);
    t.context.machine.code = t.context.code;

    // Load memory
    t.context.machine.memory.setDatum(40, sumContent);
    for (let i = 50; i < vecContent.length + 50; i++) {
        t.context.machine.memory.setDatum(i, vecContent[i - 50]);
    }

    // Execute code
    while (t.context.machine.tic() !== SuperescalarStatus.SUPER_ENDEXE) { }


    // Check where the program counter is
    t.deepEqual(t.context.machine.pc, 11, 'Bad pc at finish');

    // Check the result
    for (let i = 70; i < resultContent.length + 70; i++) {
        t.deepEqual(t.context.machine.memory.getDatum(i).datum, resultContent[i - 70], `Bad result at position ${i}, expected ${resultContent[i - 70]} but got ${t.context.machine.memory.getDatum(i)}`);
    }

})

test('Buclesoft.pla is executed properly', t => {
    // Load code
    t.context.code.load(softCodeInput);
    t.context.machine.code = t.context.code;

    // Load memory
    t.context.machine.memory.setDatum(40, sumContent);
    for (let i = 50; i < vecContent.length + 50; i++) {
        t.context.machine.memory.setDatum(i, vecContent[i - 50]);
    }

    // Execute code
    while (t.context.machine.tic() !== SuperescalarStatus.SUPER_ENDEXE) { }


    // Check where the program counter is
    t.deepEqual(t.context.machine.pc, 18, 'Bad pc at finish');

    // Check the result
    for (let i = 70; i < resultContent.length + 70; i++) {
        t.deepEqual(t.context.machine.memory.getDatum(i).datum, resultContent[i - 70], `Bad result at position ${i}, expected ${resultContent[i - 70]} but got ${t.context.machine.memory.getDatum(i).datum}`);
    }

})

test('Bucledoble.pla is executed properly', t => {
    // Load code
    t.context.code.load(doubleCodeInput);
    t.context.machine.code = t.context.code;

    // Load memory
    t.context.machine.memory.setDatum(40, sumContent);
    for (let i = 50; i < vecContent.length + 50; i++) {
        t.context.machine.memory.setDatum(i, vecContent[i - 50]);
    }

    // Execute code
    while (t.context.machine.tic() !== SuperescalarStatus.SUPER_ENDEXE) { }


    // Check where the program counter is
    t.deepEqual(t.context.machine.pc, 18, 'Bad pc at finish');

    // Check the result
    for (let i = 70; i < 5 + 70; i++) {
        t.deepEqual(t.context.machine.memory.getDatum(i).datum, resultContent[i - 70]*sumContent, `Bad result at position ${i}, expected ${resultContent[i - 70]} but got ${t.context.machine.memory.getDatum(i).datum}`);
    }

})