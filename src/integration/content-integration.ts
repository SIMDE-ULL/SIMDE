import {
	apply,
	buildLexer,
	expectEOF,
	expectSingleResult,
	rep_sc,
	seq,
	tok,
	opt_sc,
	type Token,
	TokenError,
} from "typescript-parsec";
import { Machine } from "../core/Common/Machine";

enum Tokens {
	Header = 0,
	Pos = 1,
	NumberSign = 2,
	NumberHex = 3,
	Number = 4,
	NumberDecimal = 5,
	Comma = 6,
	Space = 7,
	NewLine = 8,
}

const tokenizer = buildLexer([
	[true, /^#(\w+)/g, Tokens.Header],
	[true, /^\[(\d+)\]/g, Tokens.Pos],
	[true, /^-/g, Tokens.NumberSign], //TODO: \+|- is not working
	[true, /^0x/g, Tokens.NumberHex], //TODO: 0x|x is not working
	[true, /^[\dA-Fa-f]+/g, Tokens.Number],
	[true, /^\.\d+/g, Tokens.NumberDecimal],
	[false, /^,+/g, Tokens.Comma],
	[false, /^\s+/g, Tokens.Space],
	[false, /^\n/g, Tokens.NewLine],
]);

const numberParser = apply(
	seq(
		opt_sc(tok(Tokens.NumberSign)),
		opt_sc(tok(Tokens.NumberHex)),
		tok(Tokens.Number),
		opt_sc(tok(Tokens.NumberDecimal)),
	),
	(
		num: [
			Token<Tokens.NumberSign>,
			Token<Tokens.NumberHex>,
			Token<Tokens.Number>,
			Token<Tokens.NumberDecimal>,
		],
	) => {
		// Check the number base (hex or decimal)
		let base = 10;
		if (num[1]) {
			// Parse hex number
			base = 16;
		}

		// Throw an error if NumberDecimal and NumberHex are present
		if (num[1] && num[3]) {
			throw new TokenError(
				num[3].pos,
				"Hexadecimal number can not be float: " +
					num[1].text +
					num[2].text +
					num[3].text,
			);
		}

		// Throw an error if NumberHex is not present but Number has a A-F characters
		if (!num[1] && /[A-Fa-f]/g.test(num[2].text)) {
			throw new TokenError(
				num[2].pos,
				"Decimal number can not have hexadecimal characters(ABCDEF): " +
					num[2].text,
			);
		}

		// Check if float or int
		if (num[3]) {
			// Parse float number
			return Number.parseFloat(
				(num[0] ? num[0].text : "") + num[2].text + num[3].text,
			);
		} else {
			return Number.parseInt((num[0] ? num[0].text : "") + num[2].text, base);
		}
	},
);

const contentParser = apply(
	rep_sc(seq(tok(Tokens.Pos), rep_sc(numberParser))),
	(content: [Token<Tokens.Pos>, number[]][]) => {
		const result: { [k: number]: number } = {};
		for (let i = 0; i < content.length; i++) {
			var j = 0;
			content[i][1].forEach((num) => {
				result[+content[i][0].text.slice(1, -1) + j] = num;
				j++;
			});
		}
		return result;
	},
);

const fileParser = rep_sc(seq(tok(Tokens.Header), opt_sc(contentParser)));

export class ContentIntegration {
	public FPRContent: { [k: number]: number } = {};
	public GPRContent: { [k: number]: number } = {};
	public MEMContent: { [k: number]: number } = {};

	constructor(private input: string) {
		this.parseContent(input);
	}

	/**
	 * deparse
	 */
	public deparse(): string {
		let result = "";
		// Check if FPRContent is not empty
		if (Object.keys(this.FPRContent).length !== 0) {
			result += this.deparseContent("#FPR", this.FPRContent);
		}

		// Check if GPRContent is not empty
		if (Object.keys(this.GPRContent).length !== 0) {
			result += this.deparseContent("#GPR", this.GPRContent);
		}

		// Check if MEMContent is not empty
		if (Object.keys(this.MEMContent).length !== 0) {
			result += this.deparseContent("#MEM", this.MEMContent);
		}

		return result;
	}

	private deparseContent(
		headerName: string,
		content: { [k: number]: number },
	): string {
		// Add header
		let result = "\n" + headerName;
		// Iterate over Content
		let lastPosition = -1;
		Object.keys(content).forEach((key) => {
			const i = +key;
			console.log("[" + i + "] " + content[i]);

			// Check if is the next position after the last one
			const isContinuos = lastPosition !== -1 && i === lastPosition + 1;
			// Add position
			if (!isContinuos) {
				result += "\n[" + i + "] ";
			}
			// Add value
			result += content[i] + " ";
			// Update last position
			lastPosition = i;
		});

		return result;
	}

	private checkBounds(
		name: string,
		content: { [k: number]: number },
		max: number,
	) {
		const actualMax = Math.max(...Object.keys(content).map((key) => +key));
		if (actualMax >= max) {
			throw new Error(
				`${name} content exceeds bound: ${actualMax} exceeds ${max}`,
			);
		}
	}

	private parseContent(input: string) {
		const result = expectSingleResult(
			expectEOF(fileParser.parse(tokenizer.parse(input))),
		);
		result.forEach((section) => {
			switch (section[0].text) {
				case "#FPR":
					this.FPRContent = section[1];
					this.checkBounds("#FPR", this.FPRContent, Machine.NFP);
					break;
				case "#GPR":
					this.GPRContent = section[1];
					this.checkBounds("#GPR", this.GPRContent, Machine.NGP);
					break;
				case "#MEM":
					this.MEMContent = section[1];
					this.checkBounds("#MEM", this.MEMContent, Machine.MEMORY_SIZE);
					break;
				default:
					throw new Error("Invalid header: " + section[0].text);
					break;
			}
		});
	}
}
