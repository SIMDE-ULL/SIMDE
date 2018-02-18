---
layout: default
lang: es
id: codigos-ejemplo
title: Códigos de ejemplo
prev: software-pipelining.html
---

{%ace lang='asm'%}
// SIMDE v0.1
// Autor: Ivan Castilla Rodriguez
// Utilidad: Programa de testeo de SWMDE
// Comentarios: El programa presupone q en la posicion 50 (R2) de memori tienes un vector de
// 16 elementos y quieres sumar a cada elemento una cantidad fija (en la posicion de memoria
// 40). El resultado se coloca a partir de la posicion 70 (R3) de memoria.
11
	ADDI	R2 R0 #50
	ADDI	R3 R0 #70
	ADDI	R4 R0 #40
	LF	F0 (R4)
	ADDI	R5 R2 #16
LOOP:
	LF 	F1 (R2)
	ADDF	F1 F1 F0
	SF	F1 (R3)
	ADDI 	R2 R2 #1
	ADDI	R3 R3 #1
	BNE	R2 R5 LOOP
{%endace%}

{%ace lang='asm'%}
// SWMDE v1.0
// Autor: Iván Castilla Rodríguez
// Utilidad: Programa de testeo de SWMDE
// Comentarios: El programa presupone q en la posición 50 (R2) de memoria tienes
// un vector de de 16 elementos y quieres sumar a cada elemento una cantidad 
// fija (en la posición de memoria 40). El resultado se coloca a partir de la 
// posición 70 (R3) de memoria.
// Este fichero es el mismo bucle de "bucle.pla" pero desenrollado para que en 
// cada iteración se hagan dos pasadas del bucle
//
14
	ADDI	R2 R0 #50
	ADDI	R3 R0 #70
	ADDI	R4 R0 #40
	LF	F0 (R4)
	ADDI	R5 R2 #16
LOOP:
	LF 	F1 (R2)
	LF 	F2 1(R2)
	ADDF	F1 F1 F0
	ADDF	F2 F2 F0
	SF	F1 (R3)
	SF	F2 1(R3)
	ADDI 	R2 R2 #2
	ADDI	R3 R3 #2
	BNE	R2 R5 LOOP
{%endace%}

{%ace lang='asm'%}
// SWMDE v1.0
// Autor: Iván Castilla Rodríguez
// Utilidad: Programa de testeo de SWMDE
// Comentarios: El programa presupone q en la posición 50 (R2) de memoria tienes
// un vector de de 16 elementos y quieres sumar a cada elemento una cantidad 
// fija (en la posición de memoria 40). El resultado se coloca a partir de la 
// posición 70 (R3) de memoria.
// Este fichero es el mismo bucle de "bucle.pla" pero desenrollado para que en 
// cada iteración se hagan cuatro pasadas del bucle
//
20
	ADDI	R2 R0 #50
	ADDI	R3 R0 #70
	ADDI	R4 R0 #40
	LF	F0 (R4)
	ADDI	R5 R2 #16
LOOP:
	LF 	F1 (R2)
	LF 	F2 1(R2)
	LF	F3 2(R2)
	LF	F4 3(R2)
	ADDF	F1 F1 F0
	ADDF	F2 F2 F0
	ADDF	F3 F3 F0
	ADDF	F4 F4 F0
	SF	F1 (R3)
	SF	F2 1(R3)
	SF	F3 2(R3)
	SF	F4 3(R3)
	ADDI 	R2 R2 #4
	ADDI	R3 R3 #4
	BNE	R2 R5 LOOP
{%endace%}

{%ace lang='asm'%}
// SWMDE v1.0
// Autor: Iván Castilla Rodríguez
// Utilidad: Programa de testeo de SWMDE
// Comentarios: El programa presupone q en la posición 50 (R2) de memoria tienes
// un vector de de 16 elementos y quieres sumar a cada elemento una cantidad 
// fija (en la posición de memoria 40). El resultado se coloca a partir de la 
// posición 70 (R3) de memoria.
// Este fichero es el mismo bucle de "bucle.pla" pero desenrollado para que en 
// cada iteración se hagan ocho pasadas del bucle
//
32
	ADDI	R2 R0 #50
	ADDI	R3 R0 #70
	ADDI	R4 R0 #40
	LF	F0 (R4)
	ADDI	R5 R2 #16
LOOP:
	LF 	F1 (R2)
	LF 	F2 1(R2)
	LF	F3 2(R2)
	LF	F4 3(R2)
	LF 	F5 4(R2)
	LF 	F6 5(R2)
	LF	F7 6(R2)
	LF	F8 7(R2)
	ADDF	F1 F1 F0
	ADDF	F2 F2 F0
	ADDF	F3 F3 F0
	ADDF	F4 F4 F0
	ADDF	F5 F5 F0
	ADDF	F6 F6 F0
	ADDF	F7 F7 F0
	ADDF	F8 F8 F0
	SF	F1 (R3)
	SF	F2 1(R3)
	SF	F3 2(R3)
	SF	F4 3(R3)
	SF	F5 4(R3)
	SF	F6 5(R3)
	SF	F7 6(R3)
	SF	F8 7(R3)
	ADDI 	R2 R2 #8
	ADDI	R3 R3 #8
	BNE	R2 R5 LOOP
{%endace%}

{%ace lang='asm'%}
// SWMDE v0.1
// Autor: Iván Castilla Rodríguez
// Utilidad: Programa de testeo de SWMDE
// Comentarios: El programa presupone q en la posición 50 (R2) de memoria tienes un vector de
// 5 elementos y quieres sumar a cada elemento una cantidad fija (en la posición de memoria
// 40). El resultado se coloca a partir de la posición 70 (R3) de memoria.
// Adem�s se ha a�adido un segundo bucle para poder testear el Multiway branching de la VLWW.
// Este segundo bucle multiplica los elementos del vector por el mismo valor
18
	ADDI	R2 R0 #50
	ADDI	R3 R0 #70
	ADDI	R4 R0 #40
	LF	F0 (R4)
	ADDI	R5 R2 #5
LOOP:
	LF 	F1 (R2)
	ADDF	F1 F1 F0
	SF		F1 (R3)
	ADDI 	R2 R2 #1
	ADDI	R3 R3 #1
	BNE	R2 R5 LOOP
	ADDI	R3 R0 #70
	ADDI	R5 R3 #5
LOOP2:
	LF		F1 (R3)
	MULTF	F1 F1 F0
	SF		F1 (R3)
	ADDI	R3 R3 #1
	BNE	R3 R5 LOOP2
{%endace%}

{%ace lang='asm'%}
// SWMDE v0.1
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
	BNE	R3 R4 LOOP
{%endace%}

{%ace lang='asm'%}
// SWMDE v0.1
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
	SF	F2 1(R3)
{%endace%}

{%ace lang='asm'%}
// SWMDE v0.1
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
	SF	F4 3(R3)
{%endace%}

{%ace lang='asm'%}
10
ADDI R1 R0 #3
ADDI R2 R0 #2
SLLV R3 R1 R2
SRLV R4 R1 R2
ADDI R5 R0 #11
ADDI R6 R0 #6
OR   R7 R5 R6
AND  R8 R5 R6
NOR  R9 R5 R6
XOR  R10 R5 R6
{%endace%}

{%ace lang='asm'%}
// SWMDE v1.0
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
	SF	F16 15(R3)
{%endace%}

{%ace lang='asm'%}
7
ADDI R2 R0 #3
BGT R0 R2 ET1
ADDI R3 R0 #2
ET1:
SUB R4 R3 R2
BGT R2 R3 ET2
SUB R5 R2 R3
ET2:
SUB R6 R2 R3
{%endace%}

{%ace lang='asm'%}
// Simde v1.2
// Búsqueda en profundidad en un árbol.
// Cada nodo se define a partir de una pos. de memoria A:
// A[0] contiene el ID del nodo
// A[1] contiene el nºmero de hijos N del nodo
// A[2]-A[N+1] contienen las direcciones de memoria de los hijos
// Puesto que no puede usarse recursividad se emplea una pila para almacenar los
// valores. 
// La salida del programa es la lista de los ids de los nodos visitados. 
// 
// SIGNIFICADO DE LOS REGISTROS:
// R1: Dirección del nodo padre del actual (-1 si el actual es la raíz)
// R2: Dirección del nodo actual (la raíz está en 10)
// R34: Dirección donde se coloca el resultado (400)
// R33: Se usa como constante para almacenar un -1
// R31: Puntero a la pila (500)
// R3: Se usa para almacenar el ID del nodo actual
// R4: Se usa para almacenar el nº de hijos del nodo actual
//
26
	ADDI	R33 R0 #-1
	ADDI	R34 R0 #400
	ADDI	R1 R0 #-1
	ADDI	R2 R0 #10
// Inicialización de la pila
	ADDI	R31 R0 #500
// Bucle principal
INI:
	LW	R3 (R2)
	LW	R4 1(R2)
// Se guarda el nodo visitado
	SW	R3 (R34)
	ADDI	R34 R34 #1
BUC:
// Si no tiene hijos es un nodo hoja y no hay que recorrer nada
	BEQ	R4 R0 HOJA
// Se almacenan los valores del padre y nº de hijos en la pila
	SW	R1 (R31)
	SW	R4 1(R31)
	ADDI	R31 R31 #2
// Se sustituye el padre por el actual y se carga la dirección del hijo
	ADDI	R1 R2 #0
	ADD	R5 R2 R4
	LW	R2 1(R5)
// se vuelve al principio para visitar el hijo
	BEQ	R0 R0 INI
HOJA:
// Si al llegar aquí se trata de la raíz es que hemos terminado de recorrer el árbol
	BEQ	R1 R33 FIN
// Se sustituye al nodo actual por el padre
	ADDI	R2 R1 #0
// Se saca de la pila el valor del padre y el nº de hijos que quedan por visitar
	LW	R1 -2(R31)
	LW	R4 -1(R31)
	ADDI	R31 R31 #-2
// Se decrementa en 1 el nºmero de hijos
	ADDI	R4 R4 #-1
// Esta línea no es necesaria, simplemente vuelve a poner en R3 el ID del nodo
	LW	R3 (R2)
	BEQ	R0 R0 BUC
FIN:
	// Operación nula: Es necesaria porque el simulador exige que todas las etiquetas
	// vayan asociadas a una operación.
	ADDI	R0 R0 #0
{%endace%}

{%ace lang='asm'%}
// Simde v1.2
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
// Inicializo a 1 F1. Para ello uso la posicion 1 de memoria como "puente"
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
	SF	F2 (R3)
{%endace%}

{%ace lang='asm'%}
// SWMDE v1.0
// Autor: Iván Castilla Rodríguez
// Utilidad: Programa de testeo de SWMDE
// Comentarios: El programa presupone q en la posición 50 (R2) de memoria tienes
// un vector de de 16 elementos y quieres sumar a cada elemento una cantidad 
// fija (en la posición de memoria 40). El resultado se coloca a partir de la 
// posición 70 (R3) de memoria.
// Este fichero es el mismo bucle de "bucle.pla" pero desenrollado para que en 
// cada iteración se hagan dos pasadas del bucle
//
14
	ADDI	R2 R0 #50
	ADDI	R3 R0 #70
	ADDI	R4 R0 #40
	LF	F0 (R4)
	ADDI	R5 R2 #16
LOOP:
	LF 	F1 (R2)
	LF 	F2 1(R2)
	ADFF	F1 F1 F0
	ADDF	F2 F2 F0
	SF	F1 (R3)
	SF	F2 1(R3)
	ADDI 	R2 R2 2
	ADDI	R3 R3 #2
	BNE	R2 R5 LOOP
{%endace%}