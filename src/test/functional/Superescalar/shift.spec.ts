import { expect, beforeEach, test } from 'vitest'
import { Code } from '../../../core/Common/Code';
import { Superscalar } from '../../../core/Superscalar/Superscalar';
import { SuperscalarStatus } from '../../../core/Superscalar/SuperscalarEnums';
import { codeInput, resultContent } from "../code/despl";


const context: { code: Code, machine: Superscalar } = { code: null, machine: null };

beforeEach(() => {
    context.code = new Code();
    context.machine = new Superscalar();
    context.machine.init(true);
});

test('despl.pla is executed properly', t => {
    // Execute code
    context.code.load(codeInput);
    context.machine.code = context.code;
    while (context.machine.tic() !== SuperscalarStatus.SUPER_ENDEXE) { }

    // Check registers
    const resultBase = 1;
    const result = context.machine.gpr.content.slice(
        resultBase, resultBase + resultContent.length
    );
    expect(result).toStrictEqual(resultContent);

    // Check where the program counter is
    expect(context.machine.pc).toBe(10);

    // Check the number of cycles are correct
    expect(context.machine.status.cycle).toBe(10);
})