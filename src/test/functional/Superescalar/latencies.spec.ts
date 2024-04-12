import { expect, beforeEach, test } from 'vitest'
import { Code } from '../../../core/Common/Code';
import { Superscalar } from '../../../core/Superescalar/Superscalar';
import { SuperscalarStatus } from '../../../core/Superescalar/SuperscalarEnums';

const context: { code: Code, machine: Superscalar } = { code: null, machine: null };

beforeEach(() => {
    context.code = new Code();
    context.machine = new Superscalar();
    context.machine.init(true);
});


test('Integer Sum has a correct latency', t => {
    // Execute code
    context.code.load("1\n ADDI R1 R0 #0");
    context.machine.code = context.code;
    while (context.machine.tic() !== SuperscalarStatus.SUPER_ENDEXE) { }

    // Check where the program counter is
    expect(context.machine.pc).toBe(1);

    // Check the number of cycles are correct
    // 1 cycle for fetch, 1 cycle for decode, 1 cycle for reserve station, 1 cycle for execute, 1 cycle for writeback = 5 cycles + 1 cycle for end
    expect(context.machine.status.cycle).toBe(6);
})

test('Integer Multiply has a correct latency', t => {
    // Execute code
    context.code.load("1\n MULT R1 R0 R0");
    context.machine.code = context.code;
    while (context.machine.tic() !== SuperscalarStatus.SUPER_ENDEXE) { }

    // Check where the program counter is
    expect(context.machine.pc).toBe(1);

    // Check the number of cycles are correct
    // 1 cycle for fetch, 1 cycle for decode, 1 cycle for reserve station, 2 cycle for execute, 1 cycle for writeback = 6 cycles + 1 cycle for end
    expect(context.machine.status.cycle).toBe(7);
})

test('Floating Sum has a correct latency', t => {
    // Execute code
    context.code.load("1\n ADDF F1 F0 F0");
    context.machine.code = context.code;
    while (context.machine.tic() !== SuperscalarStatus.SUPER_ENDEXE) { }

    // Check where the program counter is
    expect(context.machine.pc).toBe(1);

    // Check the number of cycles are correct
    // 1 cycle for fetch, 1 cycle for decode, 1 cycle for reserve station, 4 cycle for execute, 1 cycle for writeback = 7 cycles + 1 cycle for end
    expect(context.machine.status.cycle).toBe(9);
})

test('Floating Multiply has a correct latency', t => {
    // Execute code
    context.code.load("1\n MULTF F1 F0 F0");
    context.machine.code = context.code;
    while (context.machine.tic() !== SuperscalarStatus.SUPER_ENDEXE) { }

    // Check where the program counter is
    expect(context.machine.pc).toBe(1);

    // Check the number of cycles are correct
    // 1 cycle for fetch, 1 cycle for decode, 1 cycle for reserve station, 6 cycle for execute, 1 cycle for writeback = 10 cycles + 1 cycle for end
    expect(context.machine.status.cycle).toBe(11);
})

test('Memory has a correct latency', t => {
    // Execute code
    context.code.load("1\n LF F1 0(R0)");
    context.machine.code = context.code;
    while (context.machine.tic() !== SuperscalarStatus.SUPER_ENDEXE) { }

    // Check where the program counter is
    expect(context.machine.pc).toBe(1);

    // Check the number of cycles are correct
    // 1 cycle for fetch, 1 cycle for decode, 1 cycle for reserve station, 1 cycle for address alu, 1 cycle into the abyss, 4 cycle for execute, 1 cycle for writeback = 10 cycles + 1 cycle for end
    expect(context.machine.status.cycle).toBe(11);
})

test('Jump has a correct latency', t => {
    // Execute code
    context.code.load("1\n NOLOOP: BNE R0 R0 NOLOOP");
    context.machine.code = context.code;
    while (context.machine.tic() !== SuperscalarStatus.SUPER_ENDEXE) { }

    // Check where the program counter is
    expect(context.machine.pc).toBe(1);

    // Check the number of cycles are correct
    // 1 cycle for fetch, 1 cycle for decode, 1 cycle for reserve station, 2 cycle for execute, 1 cycle for writeback = 6 cycles + 1 cycle for end
    expect(context.machine.status.cycle).toBe(7);
})