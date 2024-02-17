import { Opcodes } from "./Opcodes";

export enum Formats {
  TwoGeneralRegisters = 0, // OP R1, R2, R3
  TwoFloatingRegisters, // OP F1, F2, F3
  GeneralRegisterAndInmediate, // OP R1, R2, #X
  GeneralLoadStore, // OP R1, X(R2)
  FloatingLoadStore, // OP F1, X(R2)
  Jump, // OP R1, R2, label
  Noop, // NOP
}

export let FormatsNames: string[] = [
  "TwoGeneralRegisters",
  "TwoFloatingRegisters",
  "GeneralRegisterAndInmediate",
  "GeneralLoadStore",
  "FloatingLoadStore",
  "Jump",
  "Noop",
];
