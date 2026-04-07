import { expect, beforeEach, test } from "vitest";
import { Code } from "../../../core/Common/Code";
import { Superscalar } from "../../../core/Superscalar/Superscalar";
import { SuperscalarStatus } from "../../../core/Superscalar/SuperscalarEnums";
import {
  codeInput,
  memContent,
  expectedResult,
  codeInputNotTaken,
  memContentNotTaken,
  expectedResultNotTaken,
} from "../code/fpbranch";

const context: { code: Code; machine: Superscalar } = {
  code: null,
  machine: null,
};

beforeEach(() => {
  context.code = new Code();
  context.machine = new Superscalar();
  context.machine.init(true);
});

test("BGTF branch taken: F1 > F2 stores 1.0", () => {
  context.code.load(codeInput);
  context.machine.code = context.code;

  for (let i = 0; i < memContent.length; i++) {
    context.machine.memory.setData(i, memContent[i]);
  }

  while (context.machine.tic() !== SuperscalarStatus.SUPER_ENDEXE) {
    // run to completion
  }

  // mem[2] should be 1.0 (branch was taken, GT label reached)
  expect(Array.from(context.machine.memory)[2]).toBe(expectedResult);
});

test("BGTF branch not taken: F1 < F2 stores 0", () => {
  context.code.load(codeInputNotTaken);
  context.machine.code = context.code;

  for (let i = 0; i < memContentNotTaken.length; i++) {
    context.machine.memory.setData(i, memContentNotTaken[i]);
  }

  while (context.machine.tic() !== SuperscalarStatus.SUPER_ENDEXE) {
    // run to completion
  }

  // mem[2] should be 0 (branch was not taken, fall-through)
  expect(Array.from(context.machine.memory)[2]).toBe(expectedResultNotTaken);
});
