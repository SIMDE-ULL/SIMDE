import { start } from 'repl';
import { apply, buildLexer, expectEOF, expectSingleResult, list_sc, rep_sc, seq, str, tok, opt_sc, Token } from 'typescript-parsec';
import { MEMORY_SIZE, MACHINE_REGISTER_SIZE } from '../core/Constants';

enum Tokens {
    Header,
    Pos,
    NumberSign,
    NumberHex,
    Number,
    NumberDecimal,
    Space,
    NewLine
}

const tokenizer = buildLexer([
    [true, /^#(\w+)/g, Tokens.Header],
    [true, /^\[(\d+)\]/g, Tokens.Pos],
    [true, /^-/g, Tokens.NumberSign], //TODO: \+|- is not working
    [true, /^0x|x/g, Tokens.NumberHex],
    [true, /^\d+/g, Tokens.Number],
    [false, /^\.\d+/g, Tokens.NumberDecimal],
    [false, /^\s+/g, Tokens.Space],
    [false, /^\n/g, Tokens.NewLine]
]);

const numberParser = apply(
    seq(opt_sc(tok(Tokens.NumberSign)), opt_sc(tok(Tokens.NumberHex)), tok(Tokens.Number)),
    (num: [Token<Tokens.NumberSign>, Token<Tokens.NumberHex>, Token<Tokens.Number>]) => {
        // Check te number base (hex or decimal)
        let base = 10;
        if (num[1]) {
            // Parse hex number
            base = 16;
        }

        return parseInt(((num[0]) ? num[0].text : "") + num[2].text, base);
    }
);

const contentParser = apply(
    rep_sc(seq(tok(Tokens.Pos), rep_sc(numberParser))),
    (content: [Token<Tokens.Pos>, number[]][]) => {
        let result: { [k: number]: number } = {};
        for (let i = 0; i < content.length; i++) {
            var j = 0;
            content[i][1].forEach(num => {
                result[+content[i][0].text.slice(1, -1) + j] = num;
                j++;                
            });
        }
        return result;
    });

const fileParser = rep_sc(seq(tok(Tokens.Header), opt_sc(contentParser)));

export class ContentIntegration {

    public FPRContent: { [k: number]: number } = {};
    public GPRContent: { [k: number]: number } = {};
    public MEMContent: { [k: number]: number } = {};


    constructor(private input: string) {
        this.parseContent(input);
    }

    private parseContent(input: string) {
        let result = expectSingleResult(expectEOF(fileParser.parse(tokenizer.parse(input))));
        result.forEach(section => {
            //TODO: Validate bounds
            switch (section[0].text) {
                case '#FPR':
                    this.FPRContent = section[1];
                    break;
                case '#GPR':
                    this.GPRContent = section[1];
                    break;
                case '#MEM':
                    this.MEMContent = section[1];
                    break;
                default:
                    throw new Error('Invalid header: ' + section[0].text);
                    break;
            }
        });
    }
}
