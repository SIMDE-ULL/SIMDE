import anyTest, { TestFn } from 'ava';
import { Code } from '../../../core/Common/Code';
import { Superescalar } from '../../../core/Superescalar/Superescalar';
import { SuperescalarStatus } from '../../../core/Superescalar/SuperescalarEnums';
import { codeInput } from "../code/despl";


const test = anyTest as TestFn<{ code: Code, machine: Superescalar }>;

test.beforeEach(t => {
    t.context.code = new Code();
    t.context.machine = new Superescalar();
    t.context.machine.init(true);
});

test('despl.pla is executed properly', t => {
    // Execute code
    t.context.code.load(codeInput);
    t.context.machine.code = t.context.code;
    while (t.context.machine.tic() !== SuperescalarStatus.SUPER_ENDEXE) { }

    // Check registers
    t.deepEqual(t.context.machine.getGpr(1), 3, 'R1 is not 3');
    t.deepEqual(t.context.machine.getGpr(2), 2, 'R2 is not 2');
    t.deepEqual(t.context.machine.getGpr(3), 12, 'R3 is not 12, wrong shift left');
    t.deepEqual(t.context.machine.getGpr(4), 0, 'R4 is not 0, wrong shift right');
    t.deepEqual(t.context.machine.getGpr(5), 11, 'R5 is not 11');
    t.deepEqual(t.context.machine.getGpr(6), 6, 'R6 is not 6');
    t.deepEqual(t.context.machine.getGpr(7), 15, 'R7 is not 15, wrong or');
    t.deepEqual(t.context.machine.getGpr(8), 2, 'R8 is not 2, wrong and');
    t.deepEqual(t.context.machine.getGpr(9), -16, 'R9 is not -12, wrong nor');
    t.deepEqual(t.context.machine.getGpr(10), 13, 'R10 is not 13, wrong xor');

    // Check where the program counter is
    t.deepEqual(t.context.machine.pc, 10, 'Bad pc at finish');

    // Check the number of cycles are correct
    t.deepEqual(t.context.machine.status.cycle, 10, 'Bad number of cycles at finish');
})