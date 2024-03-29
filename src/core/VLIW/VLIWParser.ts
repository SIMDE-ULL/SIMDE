import {
	apply,
	buildLexer,
	expectEOF,
	expectSingleResult,
	rep_sc,
	rep_n,
	seq,
	tok,
	combine,
	opt_sc,
	type Token,
	TokenError,
	list_sc,
} from "typescript-parsec";
import { LargeInstruction } from "./LargeInstructions";
import type { Code } from "../Common/Code";
import { VLIWOperation } from "./VLIWOperation";
import {
	type FunctionalUnitType,
	FunctionalUnitTypeNames,
	FUNCTIONALUNITTYPESQUANTITY,
} from "../Common/FunctionalUnit";

enum Tokens {
	Number = 0,
	Comma = 1,
	Space = 2,
	NewLine = 3,
	Comment = 4,
}

const tokenizer = buildLexer([
	[true, /^[0-9]+/g, Tokens.Number],
	[true, /^\n+/g, Tokens.NewLine],
	[false, /^\,/g, Tokens.Comma],
	[false, /^[ \t\v\f]+/g, Tokens.Space],
	[false, /^\/\/.*\n/g, Tokens.Comment],
]);

const functionalUnitTypeParser = apply(
	tok(Tokens.Number),
	(num: Token<Tokens.Number>): FunctionalUnitType => {
		const type = +num.text;
		if (type > FUNCTIONALUNITTYPESQUANTITY - 1) {
			throw new TokenError(num.pos, `Invalid functional unit type ${type}`);
		}
		return type;
	},
);

interface IndexParsed {
	index: number;
	isJump: boolean;
	functionalUnitType: FunctionalUnitType;
}

export function Parse(input: string, code: Code): LargeInstruction[] {
	// This parses depends on the code, so we moved it here
	const indexParser = apply(
		tok(Tokens.Number),
		(num: Token<Tokens.Number>): IndexParsed => {
			const index = +num.text;
			// Check if index is not out of bounds
			if (index >= code.instructions.length) {
				throw new TokenError(num.pos, `Invalid index ${index}`);
			}
			return {
				index: index,
				isJump: code.instructions[index].isJumpInstruction(),
				functionalUnitType: code.instructions[index].getFunctionalUnitType(),
			};
		},
	);

	// This other parsers depends on the previous one, so we need to declare it here also

	let currentIndex: IndexParsed = null; // This is a ugly hack, but unfortunately combine consumes the index that we need in operationParser
	const operationCombiner = combine(indexParser, (indexParsed: IndexParsed) => {
		currentIndex = indexParsed;
		const numOfElements = indexParsed.isJump ? 5 : 2;
		return seq(
			functionalUnitTypeParser,
			rep_n(tok(Tokens.Number), numOfElements),
		);
	});

	const operationParser = apply(
		operationCombiner,
		(componets: [FunctionalUnitType, Token<Tokens>[]]) => {
			// Check if we received the right amount of operands
			if (componets[1].length < 2) {
				throw new TokenError(
					componets[1][0].pos,
					`Expected at least 2 operands, received ${componets[1].length}`,
				);
			}

			const index = +currentIndex.index;
			const functionalUnitType = componets[0];
			const functionalUnitIndex = +componets[1][0].text; //TODO: Check if this is out of bounds
			const predicate = +componets[1][1].text; //TODO: Check if this is out of bounds

			// Check if the recived functional unit type is the same as the one in the code
			if (functionalUnitType !== currentIndex.functionalUnitType) {
				throw new TokenError(
					componets[1][0].pos,
					`Invalid functional unit type ${
						FunctionalUnitTypeNames[functionalUnitType]
					} for instruction ${index}(expected ${
						FunctionalUnitTypeNames[currentIndex.functionalUnitType]
					})`,
				);
			}

			const operation = new VLIWOperation(
				null,
				code.instructions[index],
				functionalUnitType,
				functionalUnitIndex,
			);
			operation.setPred(predicate);

			if (currentIndex.isJump) {
				// Check if we received the right amount of operands
				if (componets[1].length !== 5) {
					throw new TokenError(
						componets[1][componets[1].length - 1].pos,
						`Expected 5 operands(Jump operation), received ${componets[1].length}`,
					);
				}
				const destiny = +componets[1][2].text;
				const predTrue = +componets[1][3].text;
				const predFalse = +componets[1][4].text;

				operation.setOperand(2, destiny, "");
				operation.setPredTrue(predTrue);
				operation.setPredFalse(predFalse);
			}
			return operation;
		},
	);

	const lineParser = seq(tok(Tokens.Number), rep_sc(operationParser));
	const programParser = seq(
		tok(Tokens.Number),
		tok(Tokens.NewLine),
		list_sc(lineParser, tok(Tokens.NewLine)),
		opt_sc(tok(Tokens.NewLine)),
	);

	// Lets parse the input
	const result = expectSingleResult(
		expectEOF(programParser.parse(tokenizer.parse(input))),
	);

	const linesNumber = +result[0].text; // Let's extract the amount of lines, this is a retrocompatibility thing, we don't really use it
	const instructions: LargeInstruction[] = new Array<LargeInstruction>(
		result[2].length,
	);
	const instructionsLines: [Token<Tokens>, VLIWOperation[]][] = result[2];

	for (let i = 0; i < instructionsLines.length; i++) {
		instructions[i] = new LargeInstruction();

		const operationsAmount = +instructionsLines[i][0].text; // This is also a retrocompatibility thing, we don't really use it

		// Iterate over the operations
		for (const operation of instructionsLines[i][1]) {
			instructions[i].addOperation(operation);
		}
	}

	return instructions;
}

export function ExportAsString(
	_instructionNumber: number,
	_instructions: LargeInstruction[],
): string {
	let outputString: string;
	outputString += _instructionNumber;

	for (let i = 0; i < _instructionNumber; i++) {
		const operationAmount = _instructions[i].getVLIWOperationsNumber();
		outputString += operationAmount;

		for (let j = 0; j < operationAmount; j++) {
			const operation = _instructions[i].getOperation(j);
			outputString += "\t";
			outputString += operation.id;
			outputString += " ";
			outputString += operation.getFunctionalUnitType();
			outputString += " ";
			outputString += operation.getFunctionalUnitType();
			outputString += " ";
			outputString += operation.getPred();

			if (operation.isJumpInstruction()) {
				outputString += " ";
				outputString += operation.getOperand(2);
				outputString += " ";
				outputString += operation.getPredTrue();
				outputString += " ";
				outputString += operation.getPredFalse();
			}
		}
		outputString += "\n";
	}
	return outputString;
}
