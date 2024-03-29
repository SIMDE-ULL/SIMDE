import { FunctionalUnitType } from "./FunctionalUnit";
import { Formats } from "./InstructionFormats";

export enum Opcodes {
  NOP = 0,
  ADD = 1,
  ADDI = 2,
  SUB = 3,
  ADDF = 4,
  SUBF = 5,
  MULT = 6,
  MULTF = 7,
  OR = 8,
  AND = 9,
  XOR = 10,
  NOR = 11,
  SLLV = 12,
  SRLV = 13,
  SW = 14,
  SF = 15,
  LW = 16,
  LF = 17,
  BNE = 18,
  BEQ = 19,
  BGT = 20,
  OPERROR = 21,
}

export const OpcodesNames: string[] = [
  "NOP",
  "ADD",
  "ADDI",
  "SUB",
  "ADDF",
  "SUBF",
  "MULT",
  "MULTF",
  "OR",
  "AND",
  "XOR",
  "NOR",
  "SLLV",
  "SRLV",
  "SW",
  "SF",
  "LW",
  "LF",
  "BNE",
  "BEQ",
  "BGT",
];

export function opcodeToFunctionalUnit(opcode: Opcodes): FunctionalUnitType {
  switch (opcode) {
    case Opcodes.ADD:
    case Opcodes.ADDI:
    case Opcodes.SUB:
    case Opcodes.OR:
    case Opcodes.AND:
    case Opcodes.NOR:
    case Opcodes.XOR:
    case Opcodes.SLLV:
    case Opcodes.SRLV:
      return FunctionalUnitType.INTEGERSUM;
    case Opcodes.ADDF:
    case Opcodes.SUBF:
      return FunctionalUnitType.FLOATINGSUM;
    case Opcodes.MULT:
      return FunctionalUnitType.INTEGERMULTIPLY;
    case Opcodes.MULTF:
      return FunctionalUnitType.FLOATINGMULTIPLY;
    case Opcodes.SW:
    case Opcodes.SF:
    case Opcodes.LW:
    case Opcodes.LF:
      return FunctionalUnitType.MEMORY;
    case Opcodes.BGT:
    case Opcodes.BNE:
    case Opcodes.BEQ:
      return FunctionalUnitType.JUMP;
    default:
      throw new Error(
        `Error at opcodeToFunctionalUnit, unknown opcode : ${OpcodesNames[opcode]}`,
      );
  }
}

export function opcodeToFormat(opcode: Opcodes): Formats {
  switch (opcode) {
    case Opcodes.NOP:
      return Formats.Noop;
    case Opcodes.ADD:
    case Opcodes.SUB:
    case Opcodes.MULT:
    case Opcodes.OR:
    case Opcodes.AND:
    case Opcodes.XOR:
    case Opcodes.NOR:
    case Opcodes.SLLV:
    case Opcodes.SRLV:
      return Formats.TwoGeneralRegisters;
    case Opcodes.ADDF:
    case Opcodes.SUBF:
    case Opcodes.MULTF:
      return Formats.TwoFloatingRegisters;
    case Opcodes.ADDI:
      return Formats.GeneralRegisterAndInmediate;
    case Opcodes.SW:
    case Opcodes.LW:
      return Formats.GeneralLoadStore;
    case Opcodes.SF:
    case Opcodes.LF:
      return Formats.FloatingLoadStore;
    case Opcodes.BNE:
    case Opcodes.BEQ:
    case Opcodes.BGT:
      return Formats.Jump;
    default:
      throw new Error(`Invalid opcode: ${opcode}`);
  }
}
