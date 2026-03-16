export const codeInput = `// Simde v1.2
// Búsqueda en profundidad en un árbol.
// Cada nodo se define a partir de una pos. de memoria A:
// A[0] contiene el ID del nodo
// A[1] contiene el número de hijos N del nodo
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
// Se decrementa en 1 el número de hijos
	ADDI	R4 R4 #-1
// Esta línea no es necesaria, simplemente vuelve a poner en R3 el ID del nodo
	LW	R3 (R2)
	BEQ	R0 R0 BUC
FIN:
	// Operación nula: Es necesaria porque el simulador exige que todas las etiquetas
	// vayan asociadas a una operación.
	ADDI	R0 R0 #0`;
