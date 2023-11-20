import anyTest, { TestFn } from 'ava';
import { VLIW } from '../../../core/VLIW/VLIW';
import { VLIWCode } from '../../../core/VLIW/VLIWCode';
import { Code } from '../../../core/Common/Code';
import { VLIWError } from '../../../core/VLIW/VLIWError';

let vliw: VLIW;
let code: VLIWCode;
let superescalarCode: Code;

const test = anyTest as TestFn<{ code: VLIWCode, superescalarCode: Code, machine: VLIW }>;

test.beforeEach('Setup machine', t => {
    t.context.code = new VLIWCode();
    t.context.superescalarCode = new Code();
    t.context.machine = new VLIW();
    t.context.machine.init(true);
});

//TODO: Test every single instruction of a given type, not just one of each type (use a loop inside the test)

test('Interger Sum has a correct latency', t => {
    // Execute code
    t.context.superescalarCode.load("1\n ADDI R1 R0 #0");
    t.context.code.load("1\n 1  0 0 0 0", t.context.superescalarCode);
    t.context.machine.code = t.context.code;
    while (t.context.machine.tic() !== VLIWError.ENDEXE) { }

    // Check where the program counter is
    t.deepEqual(t.context.machine.pc, 1, 'Bad pc at finish');

    // Check the number of cycles are correct
    // 1 cycle execute + 1 cycle write-back + 1 cycle for end
    t.deepEqual(t.context.machine.status.cycle, 3, 'Incorrect latency');
})

test('Interger Multiply has a correct latency', t => {
    // Execute code
    t.context.superescalarCode.load("1\n MULT R1 R0 R0");
    t.context.code.load("1\n 1  0 1 0 0", t.context.superescalarCode);
    t.context.machine.code = t.context.code;
    while (t.context.machine.tic() !== VLIWError.ENDEXE) { }

    // Check where the program counter is
    t.deepEqual(t.context.machine.pc, 1, 'Bad pc at finish');

    // Check the number of cycles are correct
    // 2 cycle execute + 1 cycle write-back + 1 cycle for end
    t.deepEqual(t.context.machine.status.cycle, 4, 'Incorrect latency');
})

test('FLoating Sum has a correct latency', t => {
    // Execute code
    t.context.superescalarCode.load("1\n ADDF F1 F0 F0");
    t.context.code.load("1\n 1  0 2 0 0", t.context.superescalarCode);
    t.context.machine.code = t.context.code;
    while (t.context.machine.tic() !== VLIWError.ENDEXE) { }

    // Check where the program counter is
    t.deepEqual(t.context.machine.pc, 1, 'Bad pc at finish');

    // Check the number of cycles are correct
    // 4 cycle execute + 1 cycle write-back + 1 cycle for end
    t.deepEqual(t.context.machine.status.cycle, 6, 'Incorrect latency');
})

test('FLoating Multiply has a correct latency', t => {
    // Execute code
    t.context.superescalarCode.load("1\n MULTF F1 F0 F0");
    t.context.code.load("1\n 1  0 3 0 0", t.context.superescalarCode);
    t.context.machine.code = t.context.code;
    while (t.context.machine.tic() !== VLIWError.ENDEXE) { }

    // Check where the program counter is
    t.deepEqual(t.context.machine.pc, 1, 'Bad pc at finish');

    // Check the number of cycles are correct
    // 6 cycle execute + 1 cycle write-back + 1 cycle for end
    t.deepEqual(t.context.machine.status.cycle, 8, 'Incorrect latency');
})

test('Memory has a correct latency', t => {
    // Execute code
    t.context.superescalarCode.load("1\n LF F1 0(R0)");
    t.context.code.load("1\n 1  0 4 0 0", t.context.superescalarCode);
    t.context.machine.code = t.context.code;
    while (t.context.machine.tic() !== VLIWError.ENDEXE) { }

    // Check where the program counter is
    t.deepEqual(t.context.machine.pc, 1, 'Bad pc at finish');

    // Check the number of cycles are correct
    // 4 cycle execute + 1 cycle write-back + 1 cycle for end
    t.deepEqual(t.context.machine.status.cycle, 6, 'Incorrect latency');
})

test('Jump has a correct latency', t => {
    // Execute code
    t.context.superescalarCode.load("1\n NOLOOP: BNE R0 R0 NOLOOP");
    t.context.code.load("1\n 1  0 5 0 0 1 1 2", t.context.superescalarCode);
    t.context.machine.code = t.context.code;
    while (t.context.machine.tic() !== VLIWError.ENDEXE) { }

    // Check where the program counter is
    t.deepEqual(t.context.machine.pc, 1, 'Bad pc at finish');

    // Check the number of cycles are correct
    // 2 cycle execute + 1 cycle write-back + 1 cycle for end
    t.deepEqual(t.context.machine.status.cycle, 4, 'Incorrect latency');
})