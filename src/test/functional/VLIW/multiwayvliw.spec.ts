import { beforeEach, expect, test } from "vitest";
import { Code } from "../../../core/Common/Code";
import { VLIW } from "../../../core/VLIW/VLIW";
import { VLIWCode } from "../../../core/VLIW/VLIWCode";
import { VLIWError } from "../../../core/VLIW/VLIWError";
import { codeInput, vliwCodeInput } from "../code/multiwayvliw1";

const context = {} as { code: VLIWCode; superscalarCode: Code; machine: VLIW };

beforeEach(() => {
  context.code = new VLIWCode();
  context.superscalarCode = new Code();
  context.machine = new VLIW();
  context.machine.init(true);
});

test("multiwayvliw.pla is executed properly with first parameter", () => {
  // Load code
  context.superscalarCode.load(codeInput);
  context.code.load(vliwCodeInput, context.superscalarCode);
  context.machine.code = context.code;

  // Load memory
  context.machine.memory.setData(10, 1.1);
  context.machine.memory.setData(11, 2.2);
  context.machine.setGpr(32, 0);

  // Execute code
  while (context.machine.tic() !== VLIWError.ENDEXE) {}

  // Check where the program counter is
  expect(context.machine.pc).toBe(11);

  // Check the result
  expect(Array.from(context.machine.memory)[12]).toBe(1.1);

  // Check the cycles
  // 6 + 5 + 1 + 3 (last inst latency) = 15 + 1
  expect(context.machine.status.cycle).toBe(16);
});

test("multiwayvliw.pla is executed properly with second parameter", () => {
  // Load code
  context.superscalarCode.load(codeInput);
  context.code.load(vliwCodeInput, context.superscalarCode);
  context.machine.code = context.code;

  // Load memory
  context.machine.memory.setData(10, 1.1);
  context.machine.memory.setData(11, 2.2);
  context.machine.setGpr(32, 1);

  // Execute code
  while (context.machine.tic() !== VLIWError.ENDEXE) {}

  // Check where the program counter is
  expect(context.machine.pc).toBe(11);

  // Check the result
  expect(Array.from(context.machine.memory)[12]).toBe(2.2);

  // Check the cycles
  // 6 + 5 + 1 + 3 (last inst latency) = 15 + 1
  expect(context.machine.status.cycle).toBe(16);
});

test("multiwayvliw.pla is executed properly with third parameter", () => {
  // Load code
  context.superscalarCode.load(codeInput);
  context.code.load(vliwCodeInput, context.superscalarCode);
  context.machine.code = context.code;

  // Load memory
  context.machine.memory.setData(10, 1.1);
  context.machine.memory.setData(11, 2.2);
  context.machine.setGpr(32, 2);

  // Execute code
  while (context.machine.tic() !== VLIWError.ENDEXE) {}

  // Check where the program counter is
  expect(context.machine.pc).toBe(11);

  // Check the result
  expect(Array.from(context.machine.memory)[12]).toBeCloseTo(3.3, 5);

  // Check the cycles
  // 6 + 5 + 3 (last inst latency) = 14 + 1
  expect(context.machine.status.cycle).toBe(16);
});
