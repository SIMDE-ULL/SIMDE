import { beforeEach, expect, test } from "vitest";
import { Code } from "../../../../core/Common/Code";
import { VLIW } from "../../../../core/VLIW/VLIW";
import { VLIWCode } from "../../../../core/VLIW/VLIWCode";
import { VLIWError } from "../../../../core/VLIW/VLIWError";

const context: { code: VLIWCode; superscalarCode: Code } = {
  code: null,
  superscalarCode: null,
};

beforeEach(() => {
  context.code = new VLIWCode();
  context.superscalarCode = new Code();
});

test("Loop.pla is loaded properly", (t) => {
  const inputVLIW = `15
    2	0 0 0 0	2 0 1 0
    3	1 0 0 0	4 0 1 0	3 4 0 0
    1	5 4 0 0
    0
    0
    0
    1	6 2 0 0
    1	8 0 0 0
    0
    0
    1	7 4 1 0
    0
    0
    1	10 5 0 0 2 1 2
    1	9 0 1 0`;

  const inputSuperscalar = `11
	ADDI	R2 R0 #50
	ADDI	R3 R0 #70
	ADDI	R4 R0 #40
	LF	F0 (R4)
	ADDI	R5 R2 #16
LOOP:
	LF 	F1 (R2)
	ADDF	F1 F1 F0
	SF	F1 (R3)
	ADDI 	R2 R2 #1
	ADDI	R3 R3 #1
	BNE	R2 R5 LOOP`;

  context.superscalarCode.load(inputSuperscalar);
  context.code.load(inputVLIW, context.superscalarCode);

  const error = `Bad instruction number parsed, expected 15, got ${context.code.getLargeInstructionNumber()}`;

  expect(context.code.getLargeInstructionNumber()).toBe(15);
});

test("Loop.pla without lines number is loaded properly", (t) => {
  const inputVLIW = `    2	0 0 0 0	2 0 1 0
    3	1 0 0 0	4 0 1 0	3 4 0 0
    1	5 4 0 0
    0
    0
    0
    1	6 2 0 0
    1	8 0 0 0
    0
    0
    1	7 4 1 0
    0
    0
    1	10 5 0 0 2 1 2
    1	9 0 1 0`;

  const inputSuperscalar = `ADDI	R2 R0 #50
	ADDI	R3 R0 #70
	ADDI	R4 R0 #40
	LF	F0 (R4)
	ADDI	R5 R2 #16
LOOP:
	LF 	F1 (R2)
	ADDF	F1 F1 F0
	SF	F1 (R3)
	ADDI 	R2 R2 #1
	ADDI	R3 R3 #1
	BNE	R2 R5 LOOP`;

  context.superscalarCode.load(inputSuperscalar);
  context.code.load(inputVLIW, context.superscalarCode);

  expect(context.code.getLargeInstructionNumber()).toBe(15);
});

test("Loop.pla with extra \\n at the end does not throws error", (t) => {
  const inputVLIW = `15
    2	0 0 0 0	2 0 1 0
    3	1 0 0 0	4 0 1 0	3 4 0 0
    1	5 4 0 0
    0
    0
    0
    1	6 2 0 0
    1	8 0 0 0
    0
    0
    1	7 4 1 0
    0
    0
    1	10 5 0 0 2 1 2
    1	9 0 1 0
    `;

  const inputSuperscalar = `11
	ADDI	R2 R0 #50
	ADDI	R3 R0 #70
	ADDI	R4 R0 #40
	LF	F0 (R4)
	ADDI	R5 R2 #16
LOOP:
	LF 	F1 (R2)
	ADDF	F1 F1 F0
	SF	F1 (R3)
	ADDI 	R2 R2 #1
	ADDI	R3 R3 #1
	BNE	R2 R5 LOOP`;

  context.superscalarCode.load(inputSuperscalar);

  expect(() =>
    context.code.load(inputVLIW, context.superscalarCode),
  ).not.toThrowError();
});
