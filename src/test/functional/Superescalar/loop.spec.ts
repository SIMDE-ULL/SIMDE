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
    const vecBaseAddress = 50;
    context.machine.memory.data.splice(vecBaseAddress, vecContent.length, ...vecContent);

    // Execute code
    while (context.machine.tic() !== SuperescalarStatus.SUPER_ENDEXE) { }


    // Check where the program counter is
    expect(context.machine.pc).toBe(11);

    // Check the result
    const resultBaseAddress = 70;
    const result = context.machine.memory.data.slice(
        resultBaseAddress, resultBaseAddress + resultContent.length
    );
    expect(result).toStrictEqual(resultContent);

})

test('Buclesoft.pla is executed properly', t => {
    // Load code
    context.code.load(softCodeInput);
    context.machine.code = context.code;

    // Load memory
    context.machine.memory.setDatum(40, sumContent);
    const vecBaseAddress = 50;
    context.machine.memory.data.splice(vecBaseAddress, vecContent.length, ...vecContent);

    // Execute code
    while (context.machine.tic() !== SuperescalarStatus.SUPER_ENDEXE) { }


    // Check where the program counter is
    expect(context.machine.pc).toBe(18);

    // Check the result
    const resultBaseAddress = 70;
    const result = context.machine.memory.data.slice(
        resultBaseAddress, resultBaseAddress + resultContent.length
    );
    expect(result).toStrictEqual(resultContent);

})

test('Bucledoble.pla is executed properly', t => {
    // Load code
    context.code.load(doubleCodeInput);
    context.machine.code = context.code;

    // Load memory
    context.machine.memory.setDatum(40, sumContent);
    const vecBaseAddress = 50;
    context.machine.memory.data.splice(vecBaseAddress, vecContent.length, ...vecContent);

    // Execute code
    while (context.machine.tic() !== SuperescalarStatus.SUPER_ENDEXE) { }


    // Check where the program counter is
    expect(context.machine.pc).toBe(18);

    // Check the result
    const resultBaseAddress = 70;
    const result = context.machine.memory.data.slice(
        resultBaseAddress, resultBaseAddress + 5
    );
    expect(result).toStrictEqual(resultContent.map(x => x * sumContent).slice(0, 5));

})