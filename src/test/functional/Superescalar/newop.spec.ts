import anyTest, { TestFn } from 'ava';
import { Code } from '../../../core/Common/Code';
import { Superescalar } from '../../../core/Superescalar/Superescalar';
import { SuperescalarStatus } from '../../../core/Superescalar/SuperescalarEnums';
import { codeInput } from "../code/nuevaOp";


const test = anyTest as TestFn<{ code: Code, machine: Superescalar }>;

test.beforeEach(t => {
    t.context.code = new Code();
    t.context.machine = new Superescalar();
    t.context.machine.init(true);
});

test('nuevaOp.pla is executed properly', t => {
    // Execute code
    t.context.code.load(codeInput);
    t.context.machine.code = t.context.code;
    while (t.context.machine.tic() !== SuperescalarStatus.SUPER_ENDEXE) { }

    // Check registers
    t.deepEqual(t.context.machine.getGpr(2), 3, 'R2 is not 3');
    t.deepEqual(t.context.machine.getGpr(3), 2, 'R3 is not 2');
    t.deepEqual(t.context.machine.getGpr(4),-1, 'R4 is not -1');
    t.deepEqual(t.context.machine.getGpr(5), 0, 'R5 is not 0 (has been modified by the branch)');
    t.deepEqual(t.context.machine.getGpr(6), 1, 'R6 is not 1');

    // Check where the program counter is
    t.deepEqual(t.context.machine.pc, 7, 'Bad pc at finish');

    // Check the number of cycles are correct
    t.deepEqual(t.context.machine.status.cycle, 13, 'Bad number of cycles at finish');

})