import anyTest, { TestFn } from 'ava';
import { Code } from '../../../core/Common/Code';
import { Superescalar } from '../../../core/Superescalar/Superescalar';
import { SuperescalarStatus } from '../../../core/Superescalar/SuperescalarEnums';


const test = anyTest as TestFn<{ code: Code, machine: Superescalar }>;

test.beforeEach(t => {
    t.context.code = new Code();
    t.context.machine = new Superescalar();
    t.context.machine.init(true);
});

test('Resgister R0 is inmutable', t => {
    const code = `1
    // Set R0 to 42
    ADDI R0 R0 #42 
    // Copy value R0 -> R1
    ADD R1 R1 R0`;

    // Execute code
    t.context.code.load(code);
    t.context.machine.code = t.context.code;
    while (t.context.machine.tic() !== SuperescalarStatus.SUPER_ENDEXE) { }

    // Check R1 value
    t.deepEqual(t.context.machine.getGpr(1), 0, 'R1 should be 0');

})