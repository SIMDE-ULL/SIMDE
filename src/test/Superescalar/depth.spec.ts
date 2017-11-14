import { test } from 'ava';
import { Superescalar } from '../../core/Superescalar/Superescalar';
import { SuperescalarStatus } from '../../core/Superescalar/SuperescalarEnums';

import { Code } from '../../core/Common/Code';

let superescalar = new Superescalar();
let code;

test.beforeEach('Setup machine', () => {
	superescalar = new Superescalar();
	superescalar.init(true);
	code = new Code();
});

test('Profundidad is executed properly', t => {
	const input = `26
	ADDI	R33 R0 #-1
	ADDI	R34 R0 #400
	ADDI	R1 R0 #-1
	ADDI	R2 R0 #10
// Inicializaci�n de la pila
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
// Se almacenan los valores del padre y n� de hijos en la pila
	SW	R1 (R31)
	SW	R4 1(R31)
	ADDI	R31 R31 #2
// Se sustituye el padre por el actual y se carga la direcci�n del hijo
	ADDI	R1 R2 #0
	ADD	R5 R2 R4
	LW	R2 1(R5)
// se vuelve al principio para visitar el hijo
	BEQ	R0 R0 INI
HOJA:
// Si al llegar aqu� se trata de la ra�z es que hemos terminado de recorrer el �rbol
	BEQ	R1 R33 FIN
// Se sustituye al nodo actual por el padre
	ADDI	R2 R1 #0
// Se saca de la pila el valor del padre y el n� de hijos que quedan por visitar
	LW	R1 -2(R31)
	LW	R4 -1(R31)
	ADDI	R31 R31 #-2
// Se decrementa en 1 el n�mero de hijos
	ADDI	R4 R4 #-1
// Esta l�nea no es necesaria, simplemente vuelve a poner en R3 el ID del nodo
	LW	R3 (R2)
	BEQ	R0 R0 BUC
FIN:
	// Operaci�n nula: Es necesaria porque el simulador exige que todas las etiquetas
	// vayan asociadas a una operaci�n.
	ADDI	R0 R0 #0  
    `;
	code.load(input);
	superescalar.code = code;
	while (superescalar.tic() !== SuperescalarStatus.SUPER_ENDEXE) { }
    t.deepEqual(superescalar.status.cycle, 26);
    t.deepEqual(superescalar.gpr.content[1], -1);    
    t.deepEqual(superescalar.gpr.content[2], 10);
	t.deepEqual(superescalar.gpr.content[3], 0);
	t.deepEqual(superescalar.gpr.content[4], 0);
    t.deepEqual(superescalar.gpr.content[5], 0);
    t.deepEqual(superescalar.gpr.content[6], 0);
    t.deepEqual(superescalar.gpr.content[7], 0);    
});
