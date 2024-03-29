import { expect, beforeEach, test } from "vitest";
import { ContentIntegration } from "../../../integration/content-integration";

const input = `
#FPR
[40] 1 1
`;

const input2 = `
[40] 1 1
`;

const input3 = `
#GPR
[1] 5 1 2 -3 4 5 
#MEM
[33] 5 6 7 8 9 10 
`;

const input4 = `
#MEM
[1023] 2 6 7
`;

const input5 = `
#FPR
[0] 2.2 6.1 7.7
`;

const input6 = `
#GPR
[0] 0xA
`;

// const input5= `
// #MEM
// 1023 2 6 7
// `

test("Current content is selected properly", (t) => {
	const contentIntegration = new ContentIntegration(input);
	expect(contentIntegration.FPRContent[40]).toBe(1);
	expect(contentIntegration.FPRContent[41]).toBe(1);
});

test("Throws error if no content is selected", (t) => {
	expect(() => new ContentIntegration(input2)).toThrowError(
		'{"index":1,"rowBegin":2,"columnBegin":1,"rowEnd":2,"columnEnd":5}: Unable to consume token: [40]',
	);
});

test("Fills proper data", (t) => {
	const contentIntegration = new ContentIntegration(input3);
	expect(contentIntegration.GPRContent[1]).toBe(5);
	expect(contentIntegration.GPRContent[2]).toBe(1);
	expect(contentIntegration.GPRContent[3]).toBe(2);
	expect(contentIntegration.GPRContent[4]).toBe(-3);
	expect(contentIntegration.GPRContent[5]).toBe(4);
	expect(contentIntegration.GPRContent[6]).toBe(5);

	expect(contentIntegration.MEMContent[33]).toBe(5);
	expect(contentIntegration.MEMContent[34]).toBe(6);
	expect(contentIntegration.MEMContent[35]).toBe(7);
	expect(contentIntegration.MEMContent[36]).toBe(8);
	expect(contentIntegration.MEMContent[37]).toBe(9);
	expect(contentIntegration.MEMContent[38]).toBe(10);
});

test("Throws error when exceeding bounds", (t) => {
	expect(() => new ContentIntegration(input4)).toThrowError(
		"#MEM content exceeds bound: 1025 exceeds 1024",
	);
});

test("Can parse float numbers", (t) => {
	const contentIntegration = new ContentIntegration(input5);
	expect(contentIntegration.FPRContent[0]).toBe(2.2);
	expect(contentIntegration.FPRContent[1]).toBe(6.1);
	expect(contentIntegration.FPRContent[2]).toBe(7.7);
});

test("Can parse hexadecimal numbers", (t) => {
	const contentIntegration = new ContentIntegration(input6);
	expect(contentIntegration.GPRContent[0]).toBe(10);
});

// test ('Throws error when memory address line isnt wrapped in brackets', t => {
//     let error = t.throws(() => new ContentIntegration(input5));
//     t.is(error.message, 'Unexpected line format at line 1');
// });
