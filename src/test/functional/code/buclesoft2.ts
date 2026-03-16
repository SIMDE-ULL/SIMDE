export const codeInput = `// SWMDE v0.1
// Autor: Iván Castilla Rodríguez
// Utilidad: Programa de testeo de SWMDE
// Comentarios: El programa presupone q en la posición 50 (R2) de memoria tienes un vector de
// 16 elementos y quieres sumar a cada elemento una cantidad fija (en la posición de memoria
// 40). El resultado se coloca a partir de la posición 70 (R3) de memoria.
// En este caso, al bucle se le ha aplicado una técnica de Software pipelining., y después se
// ha desenrollado para hacer dos iteraciones en cada pasada
27
	ADDI	R2 R0 #50
	ADDI	R3 R0 #70
	ADDI	R4 R0 #40
	LF	F0 (R4)
	ADDI	R5 R2 #16
// Código de inicialización
	LF	F1 (R2)
	LF	F3 1(R2)
	ADDF	F2 F1 F0
	ADDF	F4 F3 F0
	LF	F1 2(R2)
	LF	F3 3(R2)
	ADDI	R2 R2 #4
LOOP:
	SF	F2 (R3)
	SF	F4 1(R3)
	ADDF	F2 F1 F0
	ADDF	F4 F3 F0
	LF	F1 (R2)
	LF	F3 1(R2)
	ADDI	R2 R2 #2
	ADDI	R3 R3 #2
	BNE	R2 R5 LOOP
// Código de finalización
	SF	F2 (R3)
	SF	F4 1(R3)
	ADDF	F2 F1 F0
	ADDF	F4 F3 F0
	SF	F2 2(R3)
	SF	F4 3(R3)`;

export const vliwCodeInput = `20
2	0 0 0 0	2 0 1 0
4	1 0 0 0	4 0 1 0	3 4 0 0	5 4 1 0
1	6 4 0 0
0
0
2	7 2 0 0	9 4 0 0
2	8 2 0 0	10 4 0 0
0
0
1	11 0 0 0
4	14 2 0 0	15 2 1 0	12 4 0 0	13 4 1 0
2	16 4 0 0	17 4 1 0
0
1	19 0 0 0
1	18 0 1 0
5	23 2 0 2	24 2 1 2	21 4 0 2	22 4 1 2	20 5 0 0 10 1 2
0
0
0
2	25 4 0 0	26 4 1 0`;
