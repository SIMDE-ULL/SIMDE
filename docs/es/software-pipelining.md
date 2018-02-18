---
layout: default
lang: es
id: software-pipelining
title: Software Pipelining
prev: desenrollado-de-bucles.html
next: codigos-ejemplo.html
---

Técnica de reorganización de bucles, de tal manera que en cada iteración se construye con operaciones elegidas de distintas iteraciones del bucle original.

### Bucle original

{%ace lang='asm'%}
LOOP:
	LF 		F1 (R2)
	ADDF	F2 F1 F0
	SF		F2 (R2)
	ADDI 	R2 R2 #1
	BNE		R2 R5 LOOP
{%endace%}

### Nuevo bucle (faltan los códigos inicial y final)

{%ace lang='asm'%}
LOOP:
	// SF pertenece a dos iteraciones antes
	SF 		F2 (R2)
	// ADDF pertenece a una iteración anterior 
	ADDF	F2 F1 F0
	// LF es de esta iteración 
	LF 		F1 2(R2)
	ADDI 	R2 R2 #1
	BNE		R2 R5 LOOP
{%endace%}