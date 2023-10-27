import test from 'ava';
import { FunctionalUnit, FunctionalUnitType } from '../core/Common/FunctionalUnit';
import { Instruction } from '../core/Common/Instruction';

let functionalUnit: FunctionalUnit;
let instructions: Instruction[];

test.before('Create instructions', () => {
    instructions = new Array(3);
    instructions.fill(new Instruction());
});

test.beforeEach('Setup FunctionalUnit', () => {
    functionalUnit = new FunctionalUnit();
    functionalUnit.type = FunctionalUnitType.INTEGERSUM;
    functionalUnit.latency = 4;
    instructions.map(instruction => functionalUnit.fillFlow(instruction));
});

test('It should decrease the stall counter after a tic while stalling', t => {
    functionalUnit.status.stall = 2;
    functionalUnit.tic();
    t.deepEqual(functionalUnit.status.stall, 1);
});

test('Last instruction should not change if stalling', t => {
    let instructionBefore = functionalUnit.status.lastInstruction;
    functionalUnit.status.stall = 2;
    functionalUnit.tic();
    t.deepEqual(functionalUnit.status.lastInstruction, instructionBefore);
});

test('Should set appropiate values when filling', t => {
    functionalUnit.latency = 4;
    // 0, 1 , 2 <--- 3
    t.deepEqual(functionalUnit.fillFlow(new Instruction()), 0);
    t.deepEqual(functionalUnit.status.lastInstruction, 3);
});
