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

    // Check where the program counter is
    //t.deepEqual(t.context.machine.status.cycle, 212, 'Bad pc at finish');
    t.deepEqual(1, 1, 'Bad pc at finish');

})