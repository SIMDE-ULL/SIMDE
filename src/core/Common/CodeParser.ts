import {
  type Token,
  apply,
  buildLexer,
  rule,
  rep_sc,
  alt,
  expectSingleResult,
  expectEOF,
  type TokenError,
  kleft,
  str,
  tok,
  kright,
  seq,
} from "typescript-parsec";
import type { OpcodeMnemonic, OpcodeType } from "./Opcode";
import type { RegisterKind } from "./Register";

/* Tokens and tokenizer */

enum TokenKind {
  Opcode = 0,
  Register = 1,
  Immediate = 2,
  Label = 3,
  Unsigned = 4,
  OpenParen = 5,
  CloseParen = 6,
  Space = 7,
  Comment = 8,
}

type TokenType = Token<TokenKind>;

const tokenizer = buildLexer([
  [true, /^[A-Z]+g/, TokenKind.Opcode],
  [true, /^[A-Z][0-9]+/g, TokenKind.Register],
  [true, /^#[0-9]+/g, TokenKind.Immediate],
  [true, /^[a-zA-Z_][a-zA-Z0-9_]*/g, TokenKind.Label],
  [true, /^\d+/g, TokenKind.Unsigned],
  [true, /^\(/g, TokenKind.OpenParen],
  [true, /^\)/g, TokenKind.CloseParen],
  [false, /^\s+/g, TokenKind.Space],
  [false, /^[/][/][^\n]*\n/g, TokenKind.Comment],
]);

/* AST definitions */

interface Opcode<T extends OpcodeType> {
  kind: `${Capitalize<Lowercase<T>>}Opcode`;
  mnemonic: T;
}

interface Immediate {
  kind: "Immediate";
  value: number;
}

interface GenericRegister<T extends RegisterKind> {
  kind: `${T}Register`;
  index: number;
}

type GeneralPurposeRegister = GenericRegister<RegisterKind.GeneralPurpose>;
type FloatingPointRegister = GenericRegister<RegisterKind.FloatingPoint>;

type Register = {
  [T in RegisterKind]: GenericRegister<T>;
}[RegisterKind];

interface Label {
  kind: "Label";
  name: string;
}

interface Addressing {
  kind: "Addressing";
  offset: number;
  address: number;
}

type Operand = Immediate | Register | Label | Addressing;

type OperandSet<T extends Operand[]> = {
  [Property in keyof T]: T[Property];
};

interface GenericInstruction<T extends OpcodeType, U extends Operand[] = []> {
  kind: `${Capitalize<Lowercase<T>>}Instruction`;
  opcode: Opcode<T>;
  operands?: OperandSet<U>;
}

type NopInstruction = GenericInstruction<OpcodeMnemonic.NOP>;

type AddInstruction = GenericInstruction<
  OpcodeMnemonic.ADD,
  [GeneralPurposeRegister, GeneralPurposeRegister, GeneralPurposeRegister]
>;

type AddiInstruction = GenericInstruction<
  OpcodeMnemonic.ADDI,
  [GeneralPurposeRegister, GeneralPurposeRegister, Immediate]
>;

type SubInstruction = GenericInstruction<
  OpcodeMnemonic.SUB,
  [GeneralPurposeRegister, GeneralPurposeRegister, GeneralPurposeRegister]
>;

type AddfInstruction = GenericInstruction<
  OpcodeMnemonic.ADDF,
  [FloatingPointRegister, FloatingPointRegister, FloatingPointRegister]
>;

type SubfInstruction = GenericInstruction<
  OpcodeMnemonic.SUBF,
  [FloatingPointRegister, FloatingPointRegister, FloatingPointRegister]
>;

type MultInstruction = GenericInstruction<
  OpcodeMnemonic.MULT,
  [GeneralPurposeRegister, GeneralPurposeRegister, GeneralPurposeRegister]
>;

type MultfInstruction = GenericInstruction<
  OpcodeMnemonic.MULTF,
  [FloatingPointRegister, FloatingPointRegister, FloatingPointRegister]
>;

type OrInstruction = GenericInstruction<
  OpcodeMnemonic.OR,
  [GeneralPurposeRegister, GeneralPurposeRegister, GeneralPurposeRegister]
>;

type AndInstruction = GenericInstruction<
  OpcodeMnemonic.AND,
  [GeneralPurposeRegister, GeneralPurposeRegister, GeneralPurposeRegister]
>;

type XorInstruction = GenericInstruction<
  OpcodeMnemonic.XOR,
  [GeneralPurposeRegister, GeneralPurposeRegister, GeneralPurposeRegister]
>;

type NorInstruction = GenericInstruction<
  OpcodeMnemonic.NOR,
  [GeneralPurposeRegister, GeneralPurposeRegister, GeneralPurposeRegister]
>;

type SllvInstruction = GenericInstruction<
  OpcodeMnemonic.SLLV,
  [GeneralPurposeRegister, GeneralPurposeRegister, GeneralPurposeRegister]
>;

type SrlvInstruction = GenericInstruction<
  OpcodeMnemonic.SRLV,
  [GeneralPurposeRegister, GeneralPurposeRegister, GeneralPurposeRegister]
>;

type LwInstruction = GenericInstruction<
  OpcodeMnemonic.LW,
  [GeneralPurposeRegister, Addressing]
>;

type LfInstruction = GenericInstruction<
  OpcodeMnemonic.LF,
  [FloatingPointRegister, Addressing]
>;

type SwInstruction = GenericInstruction<
  OpcodeMnemonic.SW,
  [GeneralPurposeRegister, Addressing]
>;

type SfInstruction = GenericInstruction<
  OpcodeMnemonic.SF,
  [FloatingPointRegister, Addressing]
>;

type BneInstruction = GenericInstruction<
  OpcodeMnemonic.BNE,
  [GeneralPurposeRegister, GeneralPurposeRegister, Label]
>;

type BeqInstruction = GenericInstruction<
  OpcodeMnemonic.BEQ,
  [GeneralPurposeRegister, GeneralPurposeRegister, Label]
>;

type BgtInstruction = GenericInstruction<
  OpcodeMnemonic.BGT,
  [GeneralPurposeRegister, GeneralPurposeRegister, Label]
>;

type Instruction =
  | NopInstruction
  | AddInstruction
  | AddiInstruction
  | SubInstruction
  | AddfInstruction
  | SubfInstruction
  | MultInstruction
  | MultfInstruction
  | OrInstruction
  | AndInstruction
  | XorInstruction
  | NorInstruction
  | SllvInstruction
  | SrlvInstruction
  | LwInstruction
  | LfInstruction
  | SwInstruction
  | SfInstruction
  | BneInstruction
  | BeqInstruction
  | BgtInstruction;

interface LabelDefinition {
  kind: "LabelDefinition";
  name: string;
  lineNumber: number;
}

type Statement = Instruction | LabelDefinition;

interface Program {
  statements: Statement[];
}

/* Parser implementation */

const applyRegister = ([registerPrefix, index]: [
  Token<TokenKind>,
  Immediate,
]): Register => {
  switch (registerPrefix.text) {
    case "R":
      return { kind: "GeneralPurposeRegister", index: index.value };
    case "F":
      return { kind: "FloatingPointRegister", index: index.value };
  }
};

const applyImmediate = (value: Token<TokenKind.Immediate>): Immediate => {
  return { kind: "Immediate", value: +value.text };
};

const applyLabel = (value: Token<TokenKind.Label>): Label => {
  return { kind: "Label", name: value.text };
};

const applyLabelDefinition = (
  value: Label,
  [token, _]: [Token<TokenKind>, Token<TokenKind>],
): LabelDefinition => {
  return {
    kind: "LabelDefinition",
    name: value.name,
    lineNumber: token.pos.rowBegin, // TODO: test this
  };
};

const applyStatement = (value: Instruction | LabelDefinition): Statement => {
  return value;
};

const applyProgram = (value: Statement[]): Program => {
  return {
    statements: value,
  };
};

export const REGISTER = rule<TokenKind, Register>();
export const IMMEDIATE = rule<TokenKind, Immediate>();
export const LABEL = rule<TokenKind, Label>();
export const INSTR = rule<TokenKind, Instruction>();
export const LABELDEF = rule<TokenKind, LabelDefinition>();
export const STAT = rule<TokenKind, Statement>();
export const PROGRAM = rule<TokenKind, Program>();

REGISTER.setPattern(
  apply(seq(alt(str("R"), str("F")), IMMEDIATE), applyRegister),
);
IMMEDIATE.setPattern(apply(tok(TokenKind.Immediate), applyImmediate));
LABEL.setPattern(apply(tok(TokenKind.Label), applyLabel));
LABELDEF.setPattern(apply(kleft(LABEL, str(":")), applyLabelDefinition));
STAT.setPattern(apply(alt(INSTR, LABELDEF), applyStatement));
PROGRAM.setPattern(apply(rep_sc(STAT), applyProgram));

export const parseProgram = (programString: string): Program | TokenError => {
  try {
    return expectSingleResult(
      expectEOF(PROGRAM.parse(tokenizer.parse(programString))),
    );
  } catch (e) {
    return e;
  }
};
