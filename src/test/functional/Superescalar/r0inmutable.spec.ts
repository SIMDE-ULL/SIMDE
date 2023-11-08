import anyTest, { TestFn } from 'ava';
import { Code } from '../../../core/Common/Code';
import { Superescalar } from '../../../core/Superescalar/Superescalar';
import { SuperescalarStatus } from '../../../core/Superescalar/SuperescalarEnums';
import { code } from '../code/r0inmutable';


const test = anyTest as TestFn<{ code: Code, machine: Superescalar }>;

test.beforeEach(t => {
    t.context.code = new Code();
    t.context.machine = new Superescalar();
    t.context.machine.init(true);
});

test('Resgister R0 is inmutable', t => {
    // Execute code
    t.context.code.load(code);
    t.context.machine.code = t.context.code;
    while (t.context.machine.tic() !== SuperescalarStatus.SUPER_ENDEXE) { }

    // Check R1 value
    t.deepEqual(t.context.machine.getGpr(1), 0, 'R1 should be 0');

})