import { expect, beforeEach, test } from 'vitest'
import { Code } from '../../../core/Common/Code';
import { Superescalar } from '../../../core/Superescalar/Superescalar';
import { SuperescalarStatus } from '../../../core/Superescalar/SuperescalarEnums';
import { codeInput } from "../code/nuevaOp";


const context: { code: Code, machine: Superescalar } = { code: null, machine: null };

beforeEach(() => {
    context.code = new Code();
    context.machine = new Superescalar();
    context.machine.init(true);
});

test('nuevaOp.pla is executed properly', t => {
    // Execute code
    context.code.load(codeInput);
    context.machine.code = context.code;
    while (context.machine.tic() !== SuperescalarStatus.SUPER_ENDEXE) { }

    // Check registers
    expect(context.machine.getGpr(2)).toBe( 3);
    expect(context.machine.getGpr(3)).toBe( 2);
    expect(context.machine.getGpr(4)).toBe(-1);
    expect(context.machine.getGpr(5)).toBe( 0);
    expect(context.machine.getGpr(6)).toBe( 1);

    // Check where the program counter is
    expect(context.machine.pc).toBe( 7);

    // Check the number of cycles are correct
    expect(context.machine.status.cycle).toBe( 14);

})