import { Opcodes } from './Opcodes';


export enum Formats {
    TwoGeneralRegisters = 0,        // OP R1, R2, R3
    TwoFloatingRegisters,           // OP F1, F2, F3
    GeneralRegisterAndInmediate,    // OP R1, R2, #X
    GeneralLoadStore,               // OP R1, X(R2)
    FloatingLoadStore,              // OP F1, X(R2)
    Jump,                           // OP R1, R2, label
    NooP                            // NOP
}

export let FormatsNames: string[] = ["TwoGeneralRegisters", "TwoFloatingRegisters", "GeneralRegisterAndInmediate", "GeneralLoadStore", "FloatingLoadStore", "Jump", "NooP"];

export function opcodeToFormat(opcode: Opcodes): Formats {
    switch (opcode) {
        case Opcodes.NOP:
            return Formats.NooP;
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
            throw new Error('Invalid opcode: ' + opcode);
    }
}
