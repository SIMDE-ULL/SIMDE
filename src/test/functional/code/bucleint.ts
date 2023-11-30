export const codeInput = `// SWMDE v0.1
// Autor: Iván Castilla Rodríguez
// Utilidad: Programa de testeo de SWMDE que crea la sucesión An = (An-1 * 2) + 3 durante
// 5 iteraciones y con A0 = 1
// Comentarios: Este programa usa únicamente operaciones enteras y bucles sin hacer uso de 
// instrucciones de memoria ni de punto flotante
8
	ADDI	R1 R0 #1
	ADDI	R2 R0 #2
	ADDI	R3 R0 #0
	ADDI	R4 R0 #5
LOOP:
	MULT	R5 R1 R2
	ADDI	R1 R5 #3
	ADDI	R3 R3 #1
	BNE	R3 R4 LOOP`;