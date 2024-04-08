export const codeInput = `// SWMDE v0.1
// Autor: Iván Castilla Rodríguez
// Utilidad: Programa de testeo de SWMDE
// Comentarios: El programa presupone q en la posición 50 (R2) de memoria tienes un vector de
// 16 elementos y quieres sumar a cada elemento una cantidad fija (en la posición de memoria
// 40). El resultado se coloca a partir de la posición 70 (R3) de memoria.
// En este caso, al bucle se le ha aplicado una técnica de Software pipelining.
18
	ADDI	R2 R0 #50
	ADDI	R3 R0 #70
	ADDI	R4 R0 #40
	LF	F0 (R4)
	ADDI	R5 R2 #16
// Código de inicialización
	LF	F1 (R2)
	ADDF	F2 F1 F0
	LF	F1 1(R2)
	ADDI	R2 R2 #2
LOOP:
	SF	F2 (R3)
	ADDF	F2 F1 F0
	LF	F1 (R2)
	ADDI	R2 R2 #1
	ADDI	R3 R3 #1
	BNE	R2 R5 LOOP
// Código de finalización
	SF	F2 (R3)
	ADDF	F2 F1 F0
	SF	F2 1(R3)`;

export const vliwCodeInput = `18
2	0 0 0 0	2 0 1 0
4	1 0 0 0	4 0 1 0	3 4 0 0	5 4 1 0
0
0
0
2	6 2 1 0	7 4 0 0
0
0
1	8 0 0 0
3	10 2 1 0	9 4 0 0	11 4 1 0
0
0
2	12 0 0 0	13 0 1 0
3	16 2 1 2	15 4 0 2	14 5 0 0 9 1 2
0
0
0
1	17 4 0 0`;