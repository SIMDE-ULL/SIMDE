---
layout: default
lang: en
id: modos-de-direccionamiento
title: Addressing modes
prev: en/memoria.html
next: en/registros-de-proposito-general.html
---

Only the indexed addressing is allowed: Imm(Rn).

The address is computed by adding the immediate value (Inm) to the value read from the register (Rn) . 
Memory accesses are always computed as complete words, i.e. the immediate value is interpreted as a word value (and not as a byte value). 

## Example

{%ace lang='asm'%}
// This example access to memory word 5 (3 + 2) to store R1 contents
ADDI	 R4 R0 #2
SI		 R1 3(R4)
{%endace%}
