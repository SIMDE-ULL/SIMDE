import { Opcodes } from "./Opcodes";

export enum Formats {
	TwoGeneralRegisters = 0, // OP R1, R2, R3
	TwoFloatingRegisters = 1, // OP F1, F2, F3
	GeneralRegisterAndInmediate = 2, // OP R1, R2, #X
	GeneralLoadStore = 3, // OP R1, X(R2)
	FloatingLoadStore = 4, // OP F1, X(R2)
	Jump = 5, // OP R1, R2, label
	Noop = 6, // NOP
}

export const FormatsNames: string[] = [
	"TwoGeneralRegisters",
	"TwoFloatingRegisters",
	"GeneralRegisterAndInmediate",
	"GeneralLoadStore",
	"FloatingLoadStore",
	"Jump",
	"Noop",
];
