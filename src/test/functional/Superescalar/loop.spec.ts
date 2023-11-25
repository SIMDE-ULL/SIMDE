import { expect, beforeEach, test } from 'vitest'
import { Code } from '../../../core/Common/Code';
import { Superescalar } from '../../../core/Superescalar/Superescalar';
import { SuperescalarStatus } from '../../../core/Superescalar/SuperescalarEnums';
import { codeInput, vecContent, sumContent, resultContent } from "../code/bucle";
import { codeInput as doubleCodeInput } from "../code/bucledoble";
import { codeInput as softCodeInput } from "../code/buclesoft";


const context: { code: Code, machine: Superescalar } = { code: null, machine: null };

beforeEach(() => {
    context.code = new Code();
    context.machine = new Superescalar();
    context.machine.init(true);
});

test('Bucle.pla is executed properly', t => {
    // Load code
    context.code.load(codeInput);
    context.machine.code = context.code;

    // Load memory
    context.machine.memory.setDatum(40, sumContent);
    for (let i = 50; i < vecContent.length + 50; i++) {
        context.machine.memory.setDatum(i, vecContent[i - 50]);
    }

    // Execute code
    while (context.machine.tic() !== SuperescalarStatus.SUPER_ENDEXE) { }


    // Check where the program counter is
    expect(context.machine.pc).toBe(11);

    // Check the result
    for (let i = 70; i < resultContent.length + 70; i++) {
        expect(context.machine.memory.getDatum(i).datum).toBe(resultContent[i - 70]);
    }

})

test('Buclesoft.pla is executed properly', t => {
    // Load code
    context.code.load(softCodeInput);
    context.machine.code = context.code;

    // Load memory
    context.machine.memory.setDatum(40, sumContent);
    for (let i = 50; i < vecContent.length + 50; i++) {
        context.machine.memory.setDatum(i, vecContent[i - 50]);
    }

    // Execute code
    while (context.machine.tic() !== SuperescalarStatus.SUPER_ENDEXE) { }


    // Check where the program counter is
    expect(context.machine.pc).toBe(18);

    // Check the result
    for (let i = 70; i < resultContent.length + 70; i++) {
        expect(context.machine.memory.getDatum(i).datum).toBe(resultContent[i - 70]);
    }

})

test('Bucledoble.pla is executed properly', t => {
    // Load code
    context.code.load(doubleCodeInput);
    context.machine.code = context.code;

    // Load memory
    context.machine.memory.setDatum(40, sumContent);
    for (let i = 50; i < vecContent.length + 50; i++) {
        context.machine.memory.setDatum(i, vecContent[i - 50]);
    }

    // Execute code
    while (context.machine.tic() !== SuperescalarStatus.SUPER_ENDEXE) { }


    // Check where the program counter is
    expect(context.machine.pc).toBe(18);

    // Check the result
    for (let i = 70; i < 5 + 70; i++) {
        expect(context.machine.memory.getDatum(i).datum).toBe(resultContent[i - 70] * sumContent);
    }

})