import { expect, beforeEach, test } from 'vitest'
import { VLIW } from '../../../core/VLIW/VLIW';
import { VLIWCode } from '../../../core/VLIW/VLIWCode';
import { Code } from '../../../core/Common/Code';
import { VLIWError } from '../../../core/VLIW/VLIWError';

const context: { code: VLIWCode, superscalarCode: Code, machine: VLIW } = { code: null, superscalarCode: null, machine: null };

beforeEach(() => {
    context.code = new VLIWCode();
    context.superscalarCode = new Code();
    context.machine = new VLIW();
    context.machine.init(true);
});

test('Interger Sum has a correct latency', t => {
    // Execute code
    context.superscalarCode.load("1\n ADDI R1 R0 #0");
    context.code.load("1\n 1  0 0 0 0", context.superscalarCode);
    context.machine.code = context.code;
    while (context.machine.tic() !== VLIWError.ENDEXE) { }

    // Check where the program counter is
    expect(context.machine.pc).toBe(1);

    // Check the number of cycles are correct
    // 1 cycle execute + 1 cycle write-back + 1 cycle for end
    expect(context.machine.status.cycle).toBe(3);
})

test('Interger Multiply has a correct latency', t => {
    // Execute code
    context.superscalarCode.load("1\n MULT R1 R0 R0");
    context.code.load("1\n 1  0 1 0 0", context.superscalarCode);
    context.machine.code = context.code;
    while (context.machine.tic() !== VLIWError.ENDEXE) { }

    // Check where the program counter is
    expect(context.machine.pc).toBe(1);


    // Check the number of cycles are correct
    // 2 cycle execute + 1 cycle write-back + 1 cycle for end
    expect(context.machine.status.cycle).toBe(4);
})

test('FLoating Sum has a correct latency', t => {
    // Execute code
    context.superscalarCode.load("1\n ADDF F1 F0 F0");
    context.code.load("1\n 1  0 2 0 0", context.superscalarCode);
    context.machine.code = context.code;
    while (context.machine.tic() !== VLIWError.ENDEXE) { }

    // Check where the program counter is
    expect(context.machine.pc).toBe(1);

    // Check the number of cycles are correct
    // 4 cycle execute + 1 cycle write-back + 1 cycle for end
    expect(context.machine.status.cycle).toBe(6);
})

test('FLoating Multiply has a correct latency', t => {
    // Execute code
    context.superscalarCode.load("1\n MULTF F1 F0 F0");
    context.code.load("1\n 1  0 3 0 0", context.superscalarCode);
    context.machine.code = context.code;
    while (context.machine.tic() !== VLIWError.ENDEXE) { }

    // Check where the program counter is
    expect(context.machine.pc).toBe(1);

    // Check the number of cycles are correct
    // 6 cycle execute + 1 cycle write-back + 1 cycle for end
    expect(context.machine.status.cycle).toBe(8);
})

test('Memory has a correct latency', t => {
    // Execute code
    context.superscalarCode.load("1\n LF F1 0(R0)");
    context.code.load("1\n 1  0 4 0 0", context.superscalarCode);
    context.machine.code = context.code;
    while (context.machine.tic() !== VLIWError.ENDEXE) { }

    // Check where the program counter is
    expect(context.machine.pc).toBe(1);

    // Check the number of cycles are correct
    // 4 cycle execute + 1 cycle write-back + 1 cycle for end
    expect(context.machine.status.cycle).toBe(6);
})

test('Jump has a correct latency', t => {
    // Execute code
    context.superscalarCode.load("1\n NOLOOP: BNE R0 R0 NOLOOP");
    context.code.load("1\n 1  0 5 0 0 1 1 2", context.superscalarCode);
    context.machine.code = context.code;
    while (context.machine.tic() !== VLIWError.ENDEXE) { }

    // Check where the program counter is
    expect(context.machine.pc).toBe(1);

    // Check the number of cycles are correct
    // 2 cycle execute + 1 cycle write-back + 1 cycle for end
    expect(context.machine.status.cycle).toBe(4);
})