import anyTest, { TestFn } from 'ava';
import { Code } from '../../../core/Common/Code';
import { Superescalar } from '../../../core/Superescalar/Superescalar';
import { SuperescalarStatus } from '../../../core/Superescalar/SuperescalarEnums';
import { FunctionalUnitType } from '../../../core/Common/FunctionalUnit';
import { codeInput, memContent } from "../code/recorrelista";


const test = anyTest as TestFn<{ code: Code, machine: Superescalar }>;

test.beforeEach(t => {
    t.context.code = new Code();
    t.context.machine = new Superescalar();
    t.context.machine.init(true);
});

test('recorrelista.pla is executed properly', t => {
    // Load code
    t.context.code.load(codeInput);
    t.context.machine.code = t.context.code;

    // Load memory
    for (let i = 10; i < memContent.length + 10; i++) {
        t.context.machine.memory.setDatum(i, memContent[i - 10]);
    }

    // Execute code
    while (t.context.machine.tic() !== SuperescalarStatus.SUPER_ENDEXE) {
        if (t.context.machine.status.cycle === 40) {
            // Check the jump prediction (should be 1 for the 2 branches)
            t.deepEqual(t.context.machine.jumpPrediction[12], 1, 'Jump prediction of BEQ R4 R0 NOOP should be 1 at cycle 40');
            t.deepEqual(t.context.machine.jumpPrediction[1], 1, 'Jump prediction of BNE R2 R33 LOOP should be 1 at cycle 40');

            // Check that in fact the prefetch and decoder are empty, as the jump didn't speculatively loop
            t.deepEqual(t.context.machine.prefetchUnit.isEmpty(), true, 'Prefetch unit should be empty at cycle 40');
            t.deepEqual(t.context.machine.decoder.isEmpty(), true, 'Decoder unit should be empty at cycle 40');

            // Check that instructions are being executed in the correct Functional Units
            // 13 -> FLOATINGMULTIPLY, 16 -> MEMORY and 12 -> JUMP
            t.true(t.context.machine.functionalUnit[FunctionalUnitType.FLOATINGMULTIPLY][0].flow.filter(inst => inst !== null && inst.id === 13).length > 0, 'Instruction 13 is not at FLOATINGMULTIPLY Functional unit at cycle 40');
            t.true(t.context.machine.functionalUnit[FunctionalUnitType.MEMORY][0].flow.filter(inst => inst !== null && inst.id === 16).length > 0, 'Instruction 16 is not at MEMORY Functional unit at cycle 40');
            t.true(t.context.machine.functionalUnit[FunctionalUnitType.JUMP][0].flow.filter(inst => inst !== null && inst.id === 12).length > 0, 'Instruction 12 is not at JUMP Functional unit at cycle 40');
        }

        if (t.context.machine.status.cycle === 60 || t.context.machine.status.cycle === 70) { // at cycle 70 the jump is still looping
            // Check the jump prediction (should be 3(11) for the 2 branches)
            t.deepEqual(t.context.machine.jumpPrediction[12], 3, 'Jump prediction of BEQ R4 R0 NOOP should be 3 at cycle 60');
            t.deepEqual(t.context.machine.jumpPrediction[1], 3, 'Jump prediction of BNE R2 R33 LOOP should be 3 at cycle 60');

            // Now the prefetch and decoder should be full, as the jump is speculatively looped
            t.deepEqual(t.context.machine.prefetchUnit.isEmpty(), false, 'Prefetch unit should not be empty at cycle 60');
            t.deepEqual(t.context.machine.decoder.isEmpty(), false, 'Decoder unit should not be empty at cycle 60');
        }

        if (t.context.machine.status.cycle === 90) {
            // At this stage, bot branches should have failed once, so the prediction should be 2(10)
            t.deepEqual(t.context.machine.jumpPrediction[12], 2, 'Jump prediction of BEQ R4 R0 NOOP should be 2 at cycle 90');
            t.deepEqual(t.context.machine.jumpPrediction[1], 2, 'Jump prediction of BNE R2 R33 LOOP should be 2 at cycle 90');

            // Check that in fact the prefetch and decoder are empty, as the jump didn't speculatively loop
            t.deepEqual(t.context.machine.prefetchUnit.isEmpty(), true, 'Prefetch unit should be empty at cycle 40');
            t.deepEqual(t.context.machine.decoder.isEmpty(), true, 'Decoder unit should be empty at cycle 40');
        }
    }

    // Check where the program counter is
    t.deepEqual(t.context.machine.pc, 19, 'Bad pc at finish');

    // Check the result
    t.deepEqual(t.context.machine.memory.getDatum(9).datum, 12, 'Bad result');

})