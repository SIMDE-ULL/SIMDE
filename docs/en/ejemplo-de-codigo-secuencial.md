---
layout: default
lang: en
id: ejemplo-de-codigo-secuencial
title: Sequential Code Example
prev: en/fichero-de-codigo-secuencial.html
next: en/estructura-comun.html
---

{%ace lang='asm'%}
// SIMDE v0.1
// Author: Iván Castilla Rodríguez
// Utility: Single loop example
// Observations: User must fill a 16-elements array starting at position 50 (R2) of memory. User must also
// put a constant at position 40. The constant will be added to each element from source array and result
// will be put in a destination array at position 70 (R3).
11
	ADDI	R2 R0 #50
	ADDI	R3 R0 #70
	ADDI	R4 R0 #40
	LF		F0 (R4)
	ADDI	R5 R2 #5
LOOP:
	LF 		F1 (R2)
	ADDF	F1 F1 F0
	SF		F1 (R3)
	ADDI 	R2 R2 #1
	ADDI	R3 R3 #1
	BNE		R2 R5 LOOP
{%endace%}