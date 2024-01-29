import { expect, beforeEach, test } from 'vitest'
import { Instruction } from '../../../../core/Common/Instruction';

let originalInstruction;

beforeEach(() => {
    originalInstruction = new Instruction();
    originalInstruction.id = 100;
});

test('Copied instructions should not keep the same reference', t => {
    let newInstruction = new Instruction();
    newInstruction.copy(originalInstruction);
    originalInstruction.id = 1;
    expect(newInstruction.operands).not.toBe(100);
});