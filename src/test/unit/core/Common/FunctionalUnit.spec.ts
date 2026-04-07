import { expect, test, beforeEach } from "vitest";
import { FunctionalUnit, FunctionalUnitType } from "../../../../core/Common/FunctionalUnit";
import { Instruction } from "../../../../core/Common/Instruction";
import { Opcodes } from "../../../../core/Common/Opcodes";

function makeInstruction(opcode: Opcodes): Instruction {
  const inst = new Instruction(undefined, 0);
  inst.opcode = opcode;
  inst.id = 0;
  return inst;
}

function execute(opcode: Opcodes, firstValue: number, secondValue: number): number {
  const fu = new FunctionalUnit(FunctionalUnitType.JUMP, 1);
  const inst = makeInstruction(opcode);
  fu.addInstruction(inst);
  const result = fu.executeReadyInstruction(firstValue, secondValue);
  return result.result;
}

test("BEQF returns 1 when FP values are equal", () => {
  expect(execute(Opcodes.BEQF, 3.14, 3.14)).toBe(1);
});

test("BEQF returns 0 when FP values differ", () => {
  expect(execute(Opcodes.BEQF, 3.14, 2.71)).toBe(0);
});

test("BNEF returns 1 when FP values differ", () => {
  expect(execute(Opcodes.BNEF, 1.5, 2.5)).toBe(1);
});

test("BNEF returns 0 when FP values are equal", () => {
  expect(execute(Opcodes.BNEF, 1.5, 1.5)).toBe(0);
});

test("BGTF returns 1 when first FP value is greater", () => {
  expect(execute(Opcodes.BGTF, 9.9, 1.1)).toBe(1);
});

test("BGTF returns 0 when first FP value is less", () => {
  expect(execute(Opcodes.BGTF, 1.1, 9.9)).toBe(0);
});

test("BGTF returns 0 when FP values are equal", () => {
  expect(execute(Opcodes.BGTF, 5.0, 5.0)).toBe(0);
});

test("BGTF handles fractional comparison correctly", () => {
  expect(execute(Opcodes.BGTF, 1.0001, 1.0)).toBe(1);
  expect(execute(Opcodes.BGTF, 1.0, 1.0001)).toBe(0);
});

test("BEQF treats zero values as equal", () => {
  expect(execute(Opcodes.BEQF, 0.0, 0.0)).toBe(1);
});
