import { expect, beforeEach, test } from 'vitest'
import { Code } from '../../../core/Common/Code';
import { Superescalar } from '../../../core/Superescalar/Superescalar';
import { SuperescalarStatus } from '../../../core/Superescalar/SuperescalarEnums';
import { codeInput } from "../code/despl";


const context: { code: Code, machine: Superescalar } = { code: null, machine: null };

beforeEach(() => {
    context.code = new Code();
    context.machine = new Superescalar();
    context.machine.init(true);
});

test('despl.pla is executed properly', t => {
    // Execute code
    context.code.load(codeInput);
    context.machine.code = context.code;
    while (context.machine.tic() !== SuperescalarStatus.SUPER_ENDEXE) { }

    // Check registers
    expect(context.machine.getGpr(1)).toBe( 3);
    expect(context.machine.getGpr(2)).toBe( 2);
    expect(context.machine.getGpr(3)).toBe( 12);
    expect(context.machine.getGpr(4)).toBe( 0);
    expect(context.machine.getGpr(5)).toBe( 11);
    expect(context.machine.getGpr(6)).toBe( 6);
    expect(context.machine.getGpr(7)).toBe( 15);
    expect(context.machine.getGpr(8)).toBe( 2);
    expect(context.machine.getGpr(9)).toBe( -16);
    expect(context.machine.getGpr(10)).toBe( 13);

    // Check where the program counter is
    expect(context.machine.pc).toBe( 10);

    // Check the number of cycles are correct
    expect(context.machine.status.cycle).toBe( 10);
})