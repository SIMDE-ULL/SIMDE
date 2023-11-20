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

//TODO: Test every single instruction of a given type, not just one of each type (use a loop inside the test)

test('Interger Sum has a correct latency', t => {
    // Execute code
    t.context.code.load("1\n ADDI R1 R0 #0");
    t.context.machine.code = t.context.code;
    while (t.context.machine.tic() !== SuperescalarStatus.SUPER_ENDEXE) { }

    // Check where the program counter is
    t.deepEqual(t.context.machine.pc, 1, 'Bad pc at finish');

    // Check the number of cycles are correct
    // 1 cycle for fetch, 1 cycle for decode, 1 cycle for reserve station, 1 cycle for execute, 1 cycle for writeback = 5 cycles + 1 cycle for end
    t.deepEqual(t.context.machine.status.cycle, 6, 'Incorrect latency');
})

test('Interger Multiply has a correct latency', t => {
    // Execute code
    t.context.code.load("1\n MULT R1 R0 R0");
    t.context.machine.code = t.context.code;
    while (t.context.machine.tic() !== SuperescalarStatus.SUPER_ENDEXE) { }

    // Check where the program counter is
    t.deepEqual(t.context.machine.pc, 1, 'Bad pc at finish');

    // Check the number of cycles are correct
    // 1 cycle for fetch, 1 cycle for decode, 1 cycle for reserve station, 2 cycle for execute, 1 cycle for writeback = 6 cycles + 1 cycle for end
    t.deepEqual(t.context.machine.status.cycle, 7, 'Incorrect latency');
})

test('FLoating Sum has a correct latency', t => {
    // Execute code
    t.context.code.load("1\n ADDF F1 F0 F0");
    t.context.machine.code = t.context.code;
    while (t.context.machine.tic() !== SuperescalarStatus.SUPER_ENDEXE) { }

    // Check where the program counter is
    t.deepEqual(t.context.machine.pc, 1, 'Bad pc at finish');

    // Check the number of cycles are correct
    // 1 cycle for fetch, 1 cycle for decode, 1 cycle for reserve station, 4 cycle for execute, 1 cycle for writeback = 7 cycles + 1 cycle for end
    t.deepEqual(t.context.machine.status.cycle, 9, 'Incorrect latency');
})

test('FLoating Multiply has a correct latency', t => {
    // Execute code
    t.context.code.load("1\n MULTF F1 F0 F0");
    t.context.machine.code = t.context.code;
    while (t.context.machine.tic() !== SuperescalarStatus.SUPER_ENDEXE) { }

    // Check where the program counter is
    t.deepEqual(t.context.machine.pc, 1, 'Bad pc at finish');

    // Check the number of cycles are correct
    // 1 cycle for fetch, 1 cycle for decode, 1 cycle for reserve station, 6 cycle for execute, 1 cycle for writeback = 10 cycles + 1 cycle for end
    t.deepEqual(t.context.machine.status.cycle, 11, 'Incorrect latency');
})

test('Memory has a correct latency', t => {
    // Execute code
    t.context.code.load("1\n LF F1 0(R0)");
    t.context.machine.code = t.context.code;
    while (t.context.machine.tic() !== SuperescalarStatus.SUPER_ENDEXE) { }

    // Check where the program counter is
    t.deepEqual(t.context.machine.pc, 1, 'Bad pc at finish');

    // Check the number of cycles are correct
    // 1 cycle for fetch, 1 cycle for decode, 1 cycle for reserve station, 1 cycle for address alu, 1 cycle into the abyss, 4 cycle for execute, 1 cycle for writeback = 10 cycles + 1 cycle for end
    t.deepEqual(t.context.machine.status.cycle, 11, 'Incorrect latency');
})

test('Jump has a correct latency', t => {
    // Execute code
    t.context.code.load("1\n NOLOOP: BNE R0 R0 NOLOOP");
    t.context.machine.code = t.context.code;
    while (t.context.machine.tic() !== SuperescalarStatus.SUPER_ENDEXE) { }

    // Check where the program counter is
    t.deepEqual(t.context.machine.pc, 1, 'Bad pc at finish');

    // Check the number of cycles are correct
    // 1 cycle for fetch, 1 cycle for decode, 1 cycle for reserve station, 2 cycle for execute, 1 cycle for writeback = 6 cycles + 1 cycle for end
    t.deepEqual(t.context.machine.status.cycle, 7, 'Incorrect latency');
})