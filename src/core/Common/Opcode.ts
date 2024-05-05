export enum OpcodeMnemonic {
  NOP = "NOP",
  ADD = "ADD",
  ADDI = "ADDI",
  SUB = "SUB",
  ADDF = "ADDF",
  SUBF = "SUBF",
  MULT = "MULT",
  MULTF = "MULTF",
  OR = "OR",
  AND = "AND",
  XOR = "XOR",
  NOR = "NOR",
  SLLV = "SLLV",
  SRLV = "SRLV",
  LW = "LW",
  LF = "LF",
  SW = "SW",
  SF = "SF",
  BNE = "BNE",
  BEQ = "BEQ",
  BGT = "BGT",
}

export type OpcodeType = `${OpcodeMnemonic}`;

export interface Opcode {
  mnemonic: OpcodeMnemonic;
}
