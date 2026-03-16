import { beforeEach, expect, test } from "vitest";
import { Code } from "../../../core/Common/Code";
import { VLIW } from "../../../core/VLIW/VLIW";
import { VLIWCode } from "../../../core/VLIW/VLIWCode";
import { VLIWError } from "../../../core/VLIW/VLIWError";
import { codeInput, resultContent, vliwCodeInput } from "../code/despl";

const context = {} as { code: VLIWCode; superscalarCode: Code; machine: VLIW };

beforeEach(() => {
  context.code = new VLIWCode();
  context.superscalarCode = new Code();
  context.machine = new VLIW();
  context.machine.init(true);
});

test("Despl.pla is executed properly", () => {
  // Load code
  context.superscalarCode.load(codeInput);
  context.code.load(vliwCodeInput, context.superscalarCode);
  context.machine.code = context.code;

  // Execute code
  while (context.machine.tic() !== VLIWError.ENDEXE) {}

  // Check where the program counter is
  expect(context.machine.pc).toBe(8);

  // Check the result
  const resultBaseAddress = 1;
  const result = context.machine.gpr.content.slice(
    resultBaseAddress,
    resultBaseAddress + resultContent.length,
  );
  expect(result).toStrictEqual(resultContent);

  // Check the cycles
  expect(context.machine.status.cycle).toBe(10);
});
