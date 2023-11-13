import anyTest, { TestFn } from 'ava';
import { Code } from '../../../core/Common/Code';
import { Superescalar } from '../../../core/Superescalar/Superescalar';
import { SuperescalarStatus } from '../../../core/Superescalar/SuperescalarEnums';
import { codeInput } from '../code/speculativenosideeffects';


const test = anyTest as TestFn<{ code: Code, machine: Superescalar }>;

test.beforeEach(t => {
    t.context.code = new Code();
    t.context.machine = new Superescalar();
    t.context.machine.init(true);
});

test('Speculative execution has no side effects', t => {
    // Execute code
    t.context.code.load(codeInput);
    t.context.machine.code = t.context.code;
    while (t.context.machine.tic() !== SuperescalarStatus.SUPER_ENDEXE) { }

    // Check R5 value
    t.deepEqual(t.context.machine.getGpr(5), 0, 'R5 should be 0');

    // Check memory pos 5 value
    t.deepEqual(t.context.machine.memory.getDatum(5).datum, 0, 'Memory pos 5 should be 0');

    // Check F1 value
    t.deepEqual(t.context.machine.getFpr(1), 0, 'F1 should be 0');

    // Check jump prediction table
    t.deepEqual(t.context.machine.jumpPrediction[7], 0, 'Jump prediction of BEQ R3 R0 NOSPEC should be 0 at finish');

    // Check where the program counter is
    t.deepEqual(t.context.machine.pc, 9, 'Bad pc at finish');

    // Check the number of cycles are correct
    t.deepEqual(t.context.machine.status.cycle, 30, 'Bad number of cycles at finish');
})