import { expect, beforeEach, test } from 'vitest'
import { Code } from '../../../core/Common/Code';
import { Superescalar } from '../../../core/Superescalar/Superescalar';
import { SuperescalarStatus } from '../../../core/Superescalar/SuperescalarEnums';
import { code } from '../code/r0inmutable';


const context: { code: Code, machine: Superescalar } = { code: null, machine: null };

beforeEach(() => {
    context.code = new Code();
    context.machine = new Superescalar();
    context.machine.init(true);
});

test('Resgister R0 is inmutable', t => {
    // Execute code
    context.code.load(code);
    context.machine.code = context.code;
    while (context.machine.tic() !== SuperescalarStatus.SUPER_ENDEXE) { }

    // Check R1 value
    expect(context.machine.getGpr(1)).toBe( 0);

    // Check where the program counter is
    expect(context.machine.pc).toBe( 2);

    // Check the number of cycles are correct
    expect(context.machine.status.cycle).toBe( 6);
})