export const codeInput = `// Simde v1.2
// Recorre y suma
// Este ejemplo recorre una lista de elementos ordenados por prioridad y suma el valor que 
// contienen ponderándolo con la posición en la lista. Cada elemento E de la lista se 
// compone de:
// E[0] contiene el valor del elemento
// E[1] contiene 1 si el valor es ponderado o 0 si el valor no se pondera
// E[2] contiene la dirección del siguiente elemento (-1 para fin de la lista)
//
// Registros empleados:
// - R1 apunta al comienzo de la lista (posición 10 de memoria)
// - R2 es el elemento actual
// - R3 apunta al resultado (posición 9)
// - F0 va a contener el contador de la lista (hay que inicializarlo a 0)
// - F1 contiene un 1 en flotante para incrementar el valor de 0
// - F2 contiene el resultado parcial
19
	ADDI	R33 R0 #-1
	ADDI	R1 R0 #10
	ADDI	R2 R1 #0
	ADDI	R3 R0 #9
	SW	R0 (R3)
	LF	F0 (R3)
	LF	F2 (R3)
// Inicializo a 1 F1. Para ello uso la posició 1 de memoria como "puente"
	ADDI	R10 R0 #1
	SW	R10 1(R0)
	LF	F1 1(R0)
LOOP:
	LF	F4 (R2)
	LW	R4 1(R2)
	BEQ	R4 R0 NOOP
	MULTF	F4 F0 F4
NOOP:
	ADDF	F2 F2 F4
	// Incremento el contador de la lista
	ADDF	F0 F1 F0
	LW	R2 2(R2)	
	BNE	R2 R33 LOOP
	SF	F2 (R3)`;