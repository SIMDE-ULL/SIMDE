// Program that tests floating-point branch instructions.
// Loads two FP values and uses BGTF to branch based on comparison.
// Memory layout:
//   mem[0] = 5.5 (first value)
//   mem[1] = 3.2 (second value)
//   mem[2] = result: 1.0 if first > second, 0.0 otherwise
//   mem[3] = 1.0 (constant)
export const codeInput = `
// Load two FP values and compare them
LF F1 0(R0)
LF F2 1(R0)
LF F10 3(R0)
// If F1 > F2, jump to GT
BGTF F1 F2 GT
// Not greater: store 0
SF F0 2(R0)
BEQ R0 R0 END
GT:
// Greater: store 1.0
SF F10 2(R0)
END:
ADDI R0 R0 #0
`;

// mem[0]=5.5, mem[1]=3.2, mem[3]=1.0
// Since 5.5 > 3.2, the branch is taken and mem[2] should be 1.0
export const memContent = [5.5, 3.2, 0, 1.0];
export const expectedResult = 1.0;

// Second test case: values where branch is NOT taken
export const codeInputNotTaken = `
LF F1 0(R0)
LF F2 1(R0)
LF F10 3(R0)
BGTF F1 F2 GT
SF F0 2(R0)
BEQ R0 R0 END
GT:
SF F10 2(R0)
END:
ADDI R0 R0 #0
`;

// mem[0]=2.0, mem[1]=8.0 -> 2.0 is NOT > 8.0, branch not taken, mem[2] = 0
export const memContentNotTaken = [2.0, 8.0, 99, 1.0];
export const expectedResultNotTaken = 0;
