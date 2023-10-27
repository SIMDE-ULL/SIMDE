import test from 'ava';
import { VLIWCode } from '../../../core/VLIW/VLIWCode';
import { Code } from '../../../core/Common/Code';
import { VLIWError } from '../../../core/VLIW/VLIWError';
import { FunctionalUnitType } from '../../../core/Common/FunctionalUnit';

let code: VLIWCode;
let superescalarCode: Code;

test.beforeEach('Setup machine', () => {
    code = new VLIWCode();
    superescalarCode = new Code();
});

test('Doubleloop.pla is executed properly', t => {
    const inputVLIW = 
    `10
    2	0 0 0 0	2 0 1 0
    3	1 0 0 0	4 0 1 0	3 4 0 0
    1	5 4 0 0
    0
    1	8 0 0 0
    1	6 2 0 0
    0
    0
    0
    3	9 0 0 0	7 4 0 0	10 5 0 0 2 1 2`;

    const inputSuperescalar = `18
	ADDI	R2 R0 #50
	ADDI	R3 R0 #70
	ADDI	R4 R0 #40
	LF	F0 (R4)
	ADDI	R5 R2 #5
LOOP:
	LF 	F1 (R2)
	ADDF	F1 F1 F0
	SF		F1 (R3)
	ADDI 	R2 R2 #1
	ADDI	R3 R3 #1
	BNE	R2 R5 LOOP
	ADDI	R3 R0 #70
	ADDI	R5 R3 #5
LOOP2:
	LF		F1 (R3)
	MULTF	F1 F1 F0
	SF		F1 (R3)
	ADDI	R3 R3 #1
	BNE	R3 R5 LOOP2`;

    superescalarCode.load(inputSuperescalar);
    code.load(inputVLIW, superescalarCode);
    
    // First Largue Instruction
    t.deepEqual(code.getLargeInstructionNumber(), 10, 'Instruction number was not parsed properly');
    t.deepEqual(code.getLargeInstruction(0).getOperation(0).getOperand(2),50);
    t.deepEqual(code.getLargeInstruction(0).getOperation(0).getFunctionalUnitType(), FunctionalUnitType.INTEGERSUM, 'Functional unit type bad parsed');
    t.deepEqual(code.getLargeInstruction(0).getOperation(0).getFunctionalUnitIndex(), 0, 'Functional unit type bad parsed');
    t.deepEqual(code.getLargeInstruction(0).getOperation(0).getPred(),0, 'Predicate not parsed properly');

    t.deepEqual(code.getLargeInstruction(0).getOperation(1).getOperand(2),40);
    t.deepEqual(code.getLargeInstruction(0).getOperation(1).getFunctionalUnitType(), FunctionalUnitType.INTEGERSUM, 'Functional unit type bad parsed');
    t.deepEqual(code.getLargeInstruction(0).getOperation(1).getFunctionalUnitIndex(), 1, 'Functional unit type bad parsed');
    t.deepEqual(code.getLargeInstruction(0).getOperation(1).getPred(),0, 'Predicate not parsed properly');

    // Second Largue Instruction
    
    t.deepEqual(code.getLargeInstruction(1).getOperation(0).getOperand(2),70);
    t.deepEqual(code.getLargeInstruction(1).getOperation(0).getFunctionalUnitType(), FunctionalUnitType.INTEGERSUM, 'Functional unit type bad parsed');
    t.deepEqual(code.getLargeInstruction(1).getOperation(0).getFunctionalUnitIndex(), 0, 'Functional unit type bad parsed');
    t.deepEqual(code.getLargeInstruction(1).getOperation(0).getPred(),0, 'Predicate not parsed properly');

    t.deepEqual(code.getLargeInstruction(1).getOperation(1).getOperand(2),5);
    t.deepEqual(code.getLargeInstruction(1).getOperation(1).getFunctionalUnitType(), FunctionalUnitType.INTEGERSUM, 'Functional unit type bad parsed');
    t.deepEqual(code.getLargeInstruction(1).getOperation(1).getFunctionalUnitIndex(), 1, 'Functional unit type bad parsed');
    t.deepEqual(code.getLargeInstruction(1).getOperation(1).getPred(),0, 'Predicate not parsed properly');

    t.deepEqual(code.getLargeInstruction(9).getOperation(2).getPred(),0);
    t.deepEqual(code.getLargeInstruction(9).getOperation(2).getOperand(2),2);
    t.deepEqual(code.getLargeInstruction(9).getOperation(2).getPredTrue(),1);
    t.deepEqual(code.getLargeInstruction(9).getOperation(2).getPredFalse(),2);
});