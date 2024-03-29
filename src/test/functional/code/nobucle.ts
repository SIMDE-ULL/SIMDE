export const codeInput = `// SWMDE v1.0
// Autor: Iván Castilla Rodríguez
// Utilidad: Programa de testeo de SWMDE
// Comentarios: El programa presupone q en la posición 50 (R2) de memoria tienes
// un vector de de 16 elementos y quieres sumar a cada elemento una cantidad 
// fija (en la posición de memoria 40). El resultado se coloca a partir de la 
// posición 70 (R3) de memoria.
// Este fichero es el mismo bucle de "bucle.pla" pero desenrollado totalmente 
// (sin bucle)
//
52
	ADDI	R2 R0 #50
	ADDI	R3 R0 #70
	ADDI	R4 R0 #40
	LF	F0 (R4)
	LF 	F1 (R2)
	LF 	F2 1(R2)
	LF	F3 2(R2)
	LF	F4 3(R2)
	LF 	F5 4(R2)
	LF 	F6 5(R2)
	LF	F7 6(R2)
	LF	F8 7(R2)
	LF 	F9 8(R2)
	LF 	F10 9(R2)
	LF	F11 10(R2)
	LF	F12 11(R2)
	LF 	F13 12(R2)
	LF 	F14 13(R2)
	LF	F15 14(R2)
	LF	F16 15(R2)
	ADDF	F1 F1 F0
	ADDF	F2 F2 F0
	ADDF	F3 F3 F0
	ADDF	F4 F4 F0
	ADDF	F5 F5 F0
	ADDF	F6 F6 F0
	ADDF	F7 F7 F0
	ADDF	F8 F8 F0
	ADDF	F9 F9 F0
	ADDF	F10 F10 F0
	ADDF	F11 F11 F0
	ADDF	F12 F12 F0
	ADDF	F13 F13 F0
	ADDF	F14 F14 F0
	ADDF	F15 F15 F0
	ADDF	F16 F16 F0
	SF	F1 (R3)
	SF	F2 1(R3)
	SF	F3 2(R3)
	SF	F4 3(R3)
	SF	F5 4(R3)
	SF	F6 5(R3)
	SF	F7 6(R3)
	SF	F8 7(R3)
	SF 	F9 8(R3)
	SF 	F10 9(R3)
	SF	F11 10(R3)
	SF	F12 11(R3)
	SF 	F13 12(R3)
	SF 	F14 13(R3)
	SF	F15 14(R3)
	SF	F16 15(R3)`;
