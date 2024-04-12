import { expect, beforeEach, test } from 'vitest'
import { Code } from '../../../core/Common/Code';
import { Superscalar } from '../../../core/Superscalar/Superscalar';
import { SuperscalarStatus } from '../../../core/Superscalar/SuperscalarEnums';
import { FunctionalUnitType } from '../../../core/Common/FunctionalUnit';
import { codeInput, memContent } from "../code/recorrelista";


const context: { code: Code, machine: Superscalar } = { code: null, machine: null };

beforeEach(() => {
    context.code = new Code();
    context.machine = new Superscalar();
    context.machine.init(true);
});

test('recorrelista.pla is executed properly', t => {
    // Load code
    context.code.load(codeInput);
    context.machine.code = context.code;

    // Load memory
    const memContentBaseAddress = 10;
    for (let i = 0; i < memContent.length; i++) {
        context.machine.memory.setDatum(memContentBaseAddress + i, memContent[i]);
    }

    // Execute code
    while (context.machine.tic() !== SuperscalarStatus.SUPER_ENDEXE) {
        if (context.machine.status.cycle === 40) {
            // Check the jump prediction (should be 1 for the 2 branches)
            expect(context.machine.jumpPrediction.getPrediction(12)).toBe(false);// 'Jump prediction of BEQ R4 R0 NOOP should be 1 at cycle 40');
            expect(context.machine.jumpPrediction.getPrediction(1)).toBe(false);// 'Jump prediction of BNE R2 R33 LOOP should be 1 at cycle 40');

            // Check that in fact the prefetch and decoder are empty, as the jump didn't speculatively loop
            expect(context.machine.prefetchUnit.isEmpty()).toBe(true);
            expect(context.machine.decoder.isEmpty()).toBe(true);

            // Check that instructions are being executed in the correct Functional Units
            // 13 -> FLOATINGMULTIPLY, 16 -> MEMORY and 12 -> JUMP
            expect(context.machine.functionalUnit[FunctionalUnitType.FLOATINGMULTIPLY][0].getVisualData().filter(e => e.id === 13).length).toBeGreaterThan(0); // Instruction 13 is not at FLOATINGMULTIPLY Functional unit at cycle 40');
            expect(context.machine.functionalUnit[FunctionalUnitType.MEMORY][0].getVisualData().filter(e => e.id === 16).length).toBeGreaterThan(0); // Instruction 16 is not at MEMORY Functional unit at cycle 40');
            expect(context.machine.functionalUnit[FunctionalUnitType.JUMP][0].getVisualData().filter(e => e.id === 12).length).toBeGreaterThan(0); // Instruction 12 is not at JUMP Functional unit at cycle 40');
        }

        if (context.machine.status.cycle === 60 || context.machine.status.cycle === 70) { // at cycle 70 the jump is still looping
            // Check the jump prediction (should be 3(11) for the 2 branches)
            expect(context.machine.jumpPrediction.getPrediction(12)).toBe(true);// 'Jump prediction of BEQ R4 R0 NOOP should be 3 at cycle 60');
            expect(context.machine.jumpPrediction.getPrediction(1)).toBe(true);//'Jump prediction of BNE R2 R33 LOOP should be 3 at cycle 60');

            // Now the prefetch and decoder should be full, as the jump is speculatively looped
            expect(context.machine.prefetchUnit.isEmpty()).toBe(false);
            expect(context.machine.decoder.isEmpty()).toBe(false);
        }

        if (context.machine.status.cycle === 90) {
            // At this stage, bot branches should have failed once, so the prediction should be 2(10)
            expect(context.machine.jumpPrediction.getPrediction(12)).toBe(true);// Jump prediction of BEQ R4 R0 NOOP should be 2 at cycle 90
            expect(context.machine.jumpPrediction.getPrediction(1)).toBe(true);//  Jump prediction of BNE R2 R33 LOOP should be 2 at cycle 90

            // Check that in fact the prefetch and decoder are empty, as the jump didn't speculatively loop
            expect(context.machine.prefetchUnit.isEmpty()).toBe(true);
            expect(context.machine.decoder.isEmpty()).toBe(true);
        }
    }

    // Check where the program counter is
    expect(context.machine.pc).toBe(19);

    // Check the result
    expect(Array.from(context.machine.memory)[9].value).toBe(12);

})