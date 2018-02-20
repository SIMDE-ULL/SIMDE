---
layout: default
lang: en
id: juego-de-instrucciones
title: Instruction Set
prev: en/estructura-comun.html
next: en/memoria.html
---

The Instruction Set (Operations in VLIW processor) is a common element for both processors. However some instructions operate in a slightly different way depending on the processor selected.

### ADDI
Immediate Integer Addition
ADDI Rd, Ro1, #Imm
Rd = Ro1 + Imm
It uses the Integer Add FU.

### ADD
Integer Addition
ADD Rd, Ro1, Ro2
Rd = Ro1 + Ro2
It uses the Integer Add FU.

### SUB
Integer Subtraction
SUB Rd, Ro1, Ro2
Rd = Ro1 - Ro2
It uses the Integer Add FU.

### AND
Bitwise "and"
AND Rd, Ro1, Ro2
Rd = Ro1 AND Ro2
It uses the Integer Add FU.

### OR
Bitwise "or"
OR Rd, Ro1, Ro2
Rd = Ro1 OR Ro2
It uses the Integer Add FU.

### NOR
Bitwise "Not or"
NOR Rd, Ro1, Ro2
Rd = Ro1 NOR Ro2
It uses the Integer Add FU.

### XOR
Bitwise "Exclusive or"
XOR Rd, Ro1, Ro2
Rd = Ro1 XOR Ro2
It uses the Integer Add FU.

### SLLV
Shift Left Logical Variable
SLLV Rd, Ro1, Ro2
Rd = Ro2 << Ro1[4..0]
The bit shift count is especified by the low-order five bits of Ro1.
It uses the Integer Add FU.

### SRLV
Shift Right Logical Variable
SLLV Rd, Ro1, Ro2
Rd = Ro2 >> Ro1[4..0]
The bit shift count is especified by the low-order five bits of Ro1.
It uses the Integer Add FU.

### MULT
Integer Multiplication
MULT Rd, Ro1, Ro2
Rd = Ro1 * Ro2
It uses the Integer Multiplication FU.

### ADDF
Floating Point (FP) Addition
ADDF Fd, Fo1, Fo2
Fd = Fo1 + Fo2
It uses the FP Add FU.

### SUBF
Floating Point (FP) Subtraction
SUBF Fd, Fo1, Fo2
Fd = Fo1 - Fo2
It uses the FP Add FU.

### MULTF
FP Multiplication
MULTF Fd, Fo1, Fo2
Fd = Fo1 * Fo2
It uses the FP Multiplication FU.

### LW
Integer Load
LW Rd, Imm(Ro)
Rd = MEM[Ro + Imm]
It uses the Memory FU.

### LF
FP Load
LF Fd, Imm(Ro)
Fd = MEM[Ro + Imm]
It uses the Memory FU.

### SW
Integer Store
SW Ro, Imm(Rd)
MEM[Rd + Imm] = Ro
It uses the Memory FU.

### SF
FP Store
SF Fo, Imm(Rd)
MEM[Rd + Imm] = Fo
It uses the Memory FU.

### BNE
Branch if not equal
BNE Ro1, Ro2, Label
If (Ro1 != Ro2)
	Jump to instruction labeled with "Label"
It uses the Branch FU.

### BEQ
Branch if equal
BEQ Ro1, Ro2, Label
If (Ro1 == Ro2)
	Jump to instruction labeled with "Label"
It uses the Branch FU.

### BGT
Branch if greater
BGT Ro1, Ro2, Label
If (Ro1 > Ro2)
	Jump to instruction labeled with "Label"
It uses the Branch FU.
