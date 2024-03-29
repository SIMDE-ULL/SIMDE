import { expect, beforeEach, test } from "vitest";
import { Code } from "../../../core/Common/Code";
import { Superescalar } from "../../../core/Superescalar/Superescalar";
import { SuperescalarStatus } from "../../../core/Superescalar/SuperescalarEnums";

const context: { code: Code; machine: Superescalar } = {
	code: null,
	machine: null,
};

beforeEach(() => {
	context.code = new Code();
	context.machine = new Superescalar();
	context.machine.init(true);
});

test("GPR does not have RaW Hazards", (t) => {
	// Execute code
	context.code.load("3\n ADDI R1 R0 #1 \n MULT R2 R1 R1 \n ADDI R3 R2 #1");
	context.machine.code = context.code;
	while (context.machine.tic() !== SuperescalarStatus.SUPER_ENDEXE) {}

	// Check where the program counter is
	expect(context.machine.pc).toBe(3);

	// Check the result
	expect(context.machine.getGpr(3)).toBe(2);
});

test("FPR does not have RaW Hazards", (t) => {
	// Execute code
	context.machine.setFpr(1, 1);
	context.code.load("2\n MULTF F2 F1 F1 \n ADDF F3 F2 F1");
	context.machine.code = context.code;
	while (context.machine.tic() !== SuperescalarStatus.SUPER_ENDEXE) {}

	// Check where the program counter is
	expect(context.machine.pc).toBe(2);

	// Check the result
	expect(context.machine.getFpr(3)).toBe(2);
});

test("Memory does not have RaW Hazards", (t) => {
	// Execute code
	context.code.load("3\n ADDI R1 R0 #1 \n SW R1 0(R0) \n LW R3 0(R0)");
	context.machine.code = context.code;
	while (context.machine.tic() !== SuperescalarStatus.SUPER_ENDEXE) {}

	// Check where the program counter is
	expect(context.machine.pc).toBe(3);

	// Check the result
	expect(context.machine.getGpr(3)).toBe(1);
});
