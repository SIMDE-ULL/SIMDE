import { expect, beforeEach, test } from 'vitest'
import { Code } from '../../../core/Common/Code';
import { Superescalar } from '../../../core/Superescalar/Superescalar';
import { SuperescalarStatus } from '../../../core/Superescalar/SuperescalarEnums';
import { codeInput, resultContent } from "../code/nuevaOp";


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
    let result = Array.from(Array(resultContent.length).keys()).map(x => context.machine.getGpr(x + 2));
    expect(result).toStrictEqual(resultContent);

    // Check where the program counter is
    expect(context.machine.pc).toBe(7);

    // Check the number of cycles are correct
    expect(context.machine.status.cycle).toBe(14);

})