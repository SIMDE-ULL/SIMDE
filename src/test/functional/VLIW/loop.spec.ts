import { expect, beforeEach, test } from 'vitest'
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

const context: { code: VLIWCode, superescalarCode: Code, machine: VLIW } = { code: null, superescalarCode: null, machine: null };

beforeEach(() => {
    context.code = new VLIWCode();
    context.superescalarCode = new Code();
    context.machine = new VLIW();
    context.machine.init(true);
});

test('Bucle.pla is executed properly', () => {
    // Load code
    context.superescalarCode.load(codeInput);
    context.code.load(vliwCodeInput, context.superescalarCode);
    context.machine.code = context.code;

    // Load memory
    context.machine.memory.setDatum(40, sumContent);
    const vecBaseAddress = 50;
    for (let i = 0; i < vecContent.length; i++) {
        context.machine.memory.setDatum(vecBaseAddress + i, vecContent[i]);
    }

    // Execute code
    while (context.machine.tic() !== VLIWError.ENDEXE) { }

    // Check where the program counter is
    expect(context.machine.pc).toBe(15);

    // Check the result
    const resultBaseAddress = 70;
    const result = Array.from(context.machine.memory).map(d => d.value).slice(
        resultBaseAddress, resultBaseAddress + resultContent.length
    );
    expect(result).toStrictEqual(resultContent);

    // Check the cycles
    // 2 (loop init) + 16 * 13 (loop) + 1 (jump final extra step) = 211 + 1
    expect(context.machine.status.cycle).toBe(212);
})

test('Bucle2.pla is executed properly', t => {
    // Load code
    context.superescalarCode.load(codeInput2);
    context.code.load(vliwCodeInput2, context.superescalarCode);
    context.machine.code = context.code;

    // Load memory
    context.machine.memory.setDatum(40, sumContent);
    const vecBaseAddress = 50;
    for (let i = 0; i < vecContent.length; i++) {
        context.machine.memory.setDatum(vecBaseAddress + i, vecContent[i]);
    }

    // Execute code
    while (context.machine.tic() !== VLIWError.ENDEXE) { }


    // Check where the program counter is
    expect(context.machine.pc).toBe(15);

    // Check the result
    const resultBaseAddress = 70;
    const result = Array.from(context.machine.memory).map(d => d.value).slice(
        resultBaseAddress, resultBaseAddress + resultContent.length
    );
    expect(result).toStrictEqual(resultContent);

    // Check the cycles
    // 2 (loop init) + 16/2 * 13 (2 loops) + 1 (jump final extra step) = 107 + 1
    expect(context.machine.status.cycle).toBe(108);
})

test('Bucle3.pla is executed properly', t => {
    // Load code
    context.superescalarCode.load(codeInput3);
    context.code.load(vliwCodeInput3, context.superescalarCode);
    context.machine.code = context.code;

    // Load memory
    context.machine.memory.setDatum(40, sumContent);
    const vecBaseAddress = 50;
    for (let i = 0; i < vecContent.length; i++) {
        context.machine.memory.setDatum(vecBaseAddress + i, vecContent[i]);
    }

    // Execute code
    while (context.machine.tic() !== VLIWError.ENDEXE) { }


    // Check where the program counter is
    expect(context.machine.pc).toBe(16);

    // Check the result
    const resultBaseAddress = 70;
    const result = Array.from(context.machine.memory).map(d => d.value).slice(
        resultBaseAddress, resultBaseAddress + resultContent.length
    );
    expect(result).toStrictEqual(resultContent);

    // Check the cycles
    // 2 (loop init) + 16/4 * 14 (4 loops) + 1 (jump final extra step) = 59 + 1
    expect(context.machine.status.cycle).toBe(60);
})

test('Bucle4.pla is executed properly', t => {
    // Load code
    context.superescalarCode.load(codeInput4);
    context.code.load(vliwCodeInput4, context.superescalarCode);
    context.machine.code = context.code;

    // Load memory
    context.machine.memory.setDatum(40, sumContent);
    const vecBaseAddress = 50;
    for (let i = 0; i < vecContent.length; i++) {
        context.machine.memory.setDatum(vecBaseAddress + i, vecContent[i]);
    }

    // Execute code
    while (context.machine.tic() !== VLIWError.ENDEXE) { }


    // Check where the program counter is
    expect(context.machine.pc).toBe(18);

    // Check the result
    const resultBaseAddress = 70;
    const result = Array.from(context.machine.memory).map(d => d.value).slice(
        resultBaseAddress, resultBaseAddress + resultContent.length
    );
    expect(result).toStrictEqual(resultContent);

    // Check the cycles
    // 2 (loop init) + 16/8 * 16 (4 loops) + 1 (jump final extra step) = 35 + 1
    expect(context.machine.status.cycle).toBe(36);
})

test('Buclesoft.pla is executed properly', t => {
    // Load code
    context.superescalarCode.load(softCodeInput);
    context.code.load(softVliwCodeInput, context.superescalarCode);
    context.machine.code = context.code;

    // Load memory
    context.machine.memory.setDatum(40, sumContent);
    const vecBaseAddress = 50;
    for (let i = 0; i < vecContent.length; i++) {
        context.machine.memory.setDatum(vecBaseAddress + i, vecContent[i]);
    }

    // Execute code
    while (context.machine.tic() !== VLIWError.ENDEXE) { }


    // Check where the program counter is
    expect(context.machine.pc).toBe(18);

    // Check the result
    const resultBaseAddress = 70;
    const result = Array.from(context.machine.memory).map(d => d.value).slice(
        resultBaseAddress, resultBaseAddress + resultContent.length
    );
    expect(result).toStrictEqual(resultContent);

    // Check the cycles
    // 9 (loop init + 2 loops) + 14 * 6 (loop) + 3 (final) + 4(last inst latency) = 100 + 1
    expect(context.machine.status.cycle).toBe(101);
})

test('Buclesoft2.pla is executed properly', t => {
    // Load code
    context.superescalarCode.load(softCodeInput2);
    context.code.load(softVliwCodeInput2, context.superescalarCode);
    context.machine.code = context.code;

    // Load memory
    context.machine.memory.setDatum(40, sumContent);
    const vecBaseAddress = 50;
    for (let i = 0; i < vecContent.length; i++) {
        context.machine.memory.setDatum(vecBaseAddress + i, vecContent[i]);
    }

    // Execute code
    while (context.machine.tic() !== VLIWError.ENDEXE) { }


    // Check where the program counter is
    expect(context.machine.pc).toBe(20);

    // Check the result
    const resultBaseAddress = 70;
    const result = Array.from(context.machine.memory).map(d => d.value).slice(
        resultBaseAddress, resultBaseAddress + resultContent.length
    );
    expect(result).toStrictEqual(resultContent);
    // Check the cycles
    // 10 (loop init + 4 loops) + 12/2 * 7 (2 loops) + 3 (final) + 4(last inst latency) = 59 + 1
    expect(context.machine.status.cycle).toBe(60);
})

// The double loop VLIW code is incorrect
/*test('Bucledoble.pla is executed properly', t => {
    // Load code
    context.superescalarCode.load(doubleCodeInput);
    context.code.load(doubleVliwCodeInput, context.superescalarCode);
    context.machine.code = context.code;

    // Load memory
    context.machine.memory.setDatum(40, sumContent);
    for (let i = 50; i < vecContent.length + 50; i++) {
        context.machine.memory.setDatum(i, vecContent[i - 50]);
    }

    // Execute code
    while (context.machine.tic() !== VLIWError.ENDEXE) { }


    // Check where the program counter is
    t.deepEqual(context.machine.pc, 10, 'Bad pc at finish');

    // Check the result
    for (let i = 70; i < resultContent.length + 70; i++) {
        t.deepEqual(context.machine.memory.getDatum(i).datum, resultContent[i - 70], `Bad result at position ${i}, expected ${resultContent[i - 70]} but got ${context.machine.memory.getDatum(i)}`);
    }

    // Check the cycles
    // 2 (loop init) + 16 * 8 (loop) + 4(jump latency) = 100 + 1
    t.deepEqual(context.machine.status.cycle, 101, 'Bad number of cycles');
})*/

