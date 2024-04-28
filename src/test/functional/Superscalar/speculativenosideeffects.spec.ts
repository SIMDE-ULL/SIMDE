import { expect, beforeEach, test } from 'vitest'
import { Code } from '../../../core/Common/Code';
import { Superscalar } from '../../../core/Superscalar/Superscalar';
import { SuperscalarStatus } from '../../../core/Superscalar/SuperscalarEnums';
import { codeInput } from '../code/speculativenosideeffects';


const context: { code: Code, machine: Superscalar } = { code: null, machine: null };

beforeEach(() => {
    context.code = new Code();
    context.machine = new Superscalar();
    context.machine.init(true);
});

test('Speculative execution has no side effects', t => {
    // Execute code
    context.code.load(codeInput);
    context.machine.code = context.code;
    while (context.machine.tic() !== SuperscalarStatus.SUPER_ENDEXE) { }

    // Check R5 value
    expect(context.machine.getGpr(5)).toBe(0);

    // Check memory pos 5 value
    expect(Array.from(context.machine.memory)[5]).toBe(0);

    // Check F1 value
    expect(context.machine.getFpr(1)).toBe(0);

    // Check jump prediction table
    expect(context.machine.jumpPrediction.getPrediction(7)).toBe(false);

    // Check where the program counter is
    expect(context.machine.pc).toBe(9);

    // Check the number of cycles are correct
    expect(context.machine.status.cycle).toBe(30);
})