export enum Opcodes {
    NOP = 0,
    ADD,
    ADDI,
    SUB,
    ADDF,
    SUBF,
    MULT,
    MULTF,
    OR,
    AND,
    XOR,
    NOR,
    SLLV,
    SRLV,
    SW,
    SF,
    LW,
    LF,
    BNE,
    BEQ,
    BGT,
    OPERROR
}

export let OpcodesNames: string[] =
    ['NOP', 'ADD', 'ADDI', 'SUB', 'ADDF', 'SUBF', 'MULT', 'MULTF', 'OR', 'AND', 'XOR', 'NOR', 'SLLV', 'SRLV', 'SW', 'SF', 'LW', 'LF', 'BNE', 'BEQ', 'BGT'];