export const codeInput = `// SWMDE v0.1
// Ejemplo simple para poder hacer uso de los predicados en la máquina VLWW
// En memoria, a partir de la pos. 10 deben encontrarse dos números flotantes
// En R32 se supone que viene un parámetro que indica si coger el primero (0)
// el segundo(1) o la suma (resto) y guarda el resultado
// en la pos. de memoria siguiente (12)
// F0 en teoría vale 0
// NUMERO DE INSTRUCCIONES:
13
// CODIGO:
	ADDI	R10, R0, #10
	ADDI	R1, R0, #0
	ADDI	R2, R0, #1
	LF			F1, 0(R10)
	LF			F2, 1(R10)
	BNE		R32, R1, A
	ADDF		F3, F1, F0
	BEQ		R0, R0, FIN
A:
	BNE		R32, R2, B
	ADDF		F3, F2, F0
	BEQ		R0, R0, FIN
B:
	ADDF		F3, F2, F1
FIN:
	SF			F3, 2(R10)`;

export const vliwCodeInput = `11
2	0 0 0 0	1 0 1 0
3	2 0 0 0	3 4 0 0	4 4 1 0
0
0
1	5 5 0 0 6 1 2
2	6 2 0 2	8 5 0 1 7 3 4
2	9 2 0 4	11 2 1 3
0
0
0
1	12 4 0 0`;
