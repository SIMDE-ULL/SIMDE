---
layout: default
lang: es
id: ejemplo-de-codigo-secuencial
title: Ejemplo de código secuencial
prev: fichero-de-codigo-secuencial.html
next: estructura-comun.html
---

{%ace lang='asm'%}
// SIMDE v0.1
// Autor: Iván Castilla Rodríguez
// Utilidad: Programa de testeo de SIMDE
// Comentarios: El programa presupone q 
// en la posición 50 (R2) de memoria tienes un vector de
// 5 elementos y quieres sumar a cada elemento 
// una cantidad fija (en la posición de memoria
// 40). El resultado se coloca a partir 
// de la posición 70 (R3) de memoria.
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