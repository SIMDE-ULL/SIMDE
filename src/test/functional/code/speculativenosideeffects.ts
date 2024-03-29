export const codeInput = `1
// Ensure we delay the branch enough so that the speculative instruction are executed
    LW R1 0(R0)
    LW R2 0(R1)
    LW R3 0(R2)
    BEQ R3 R0 NOSPEC
    ADDI R5 R5 #1 // Change GPR
    SW R5 5(R0)  // Change memory
    LF F1 5(R0)  // Change FPR
    BEQ R0 R0 NOSPEC // Change jump prediction table
NOSPEC:
    ADDI R6 R5 #1`;
