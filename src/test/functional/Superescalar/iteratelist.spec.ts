import anyTest, { TestFn } from 'ava';
import { Code } from '../../../core/Common/Code';
import { Superescalar } from '../../../core/Superescalar/Superescalar';
import { SuperescalarStatus } from '../../../core/Superescalar/SuperescalarEnums';
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
    while (t.context.machine.tic() !== SuperescalarStatus.SUPER_ENDEXE) { }

    // Check where the program counter is
    //TODO
    //t.deepEqual(t.context.machine.status.cycle, 212, 'Bad pc at finish');

    // Check the cycles
    //TODO

    // Check the result
    t.deepEqual(t.context.machine.memory.getDatum(9).datum, 12, 'Bad result');

})