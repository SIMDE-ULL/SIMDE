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

//TODO: Test every single instruction

test('GPR does not have RaW Hazards', t => {
    // Execute code
    t.context.code.load("3\n ADDI R1 R0 #1 \n MULT R2 R1 R1 \n ADDI R3 R2 #1");
    t.context.machine.code = t.context.code;
    while (t.context.machine.tic() !== SuperescalarStatus.SUPER_ENDEXE) { }

    // Check where the program counter is
    t.deepEqual(t.context.machine.pc, 3, 'Bad pc at finish');

    // Check the result
    t.deepEqual(t.context.machine.getGpr(3), 2, 'Incorrect result');
})

test('FPR does not have RaW Hazards', t => {
    // Execute code
    t.context.machine.setFpr(1, 1);
    t.context.code.load("2\n MULTF F2 F1 F1 \n ADDF F3 F2 F1");
    t.context.machine.code = t.context.code;
    while (t.context.machine.tic() !== SuperescalarStatus.SUPER_ENDEXE) { }

    // Check where the program counter is
    t.deepEqual(t.context.machine.pc, 2, 'Bad pc at finish');

    // Check the result
    t.deepEqual(t.context.machine.getFpr(3), 2, 'Incorrect result');
})

test('Memory does not have RaW Hazards', t => {
    // Execute code
    t.context.code.load("3\n ADDI R1 R0 #1 \n SW R1 0(R0) \n LW R3 0(R0)");
    t.context.machine.code = t.context.code;
    while (t.context.machine.tic() !== SuperescalarStatus.SUPER_ENDEXE) { }

    // Check where the program counter is
    t.deepEqual(t.context.machine.pc, 3, 'Bad pc at finish');

    // Check the result
    t.deepEqual(t.context.machine.getGpr(3), 1, 'Incorrect result');
})