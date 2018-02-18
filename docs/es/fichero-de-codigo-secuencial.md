---
layout: default
lang: es
id: fichero-de-codigo-secuencial
title: Fichero de código secuencial
prev: ventana-simulacion.html
next: ejemplo-de-codigo-secuencial.html
---

Los Ficheros de Código Secuencial que se emplean como entrada permiten definir de forma sencilla un código secuencial mediante cualquier editor de textos. Todos los ficheros de código deben llevar la extensión .pla


## Características

El fichero debe cumplir las siguientes características:
* La primera línea del fichero (que no sea un comentario) contiene el número de instrucciones del fichero.
* Cada instrucción debe ponerse en una nueva línea.
* Se permiten como separadores de operandos tabuladores o espacios.
* Las etiquetas se ponen al principio de la línea y deben terminar con ":".
* Los comentarios se indican con  "//". De ahí al final de la línea todo es un comentario.


## Instrucciones

Las instrucciones permitidas están inspiradas en el repertorio MIPS IV. Se emplea la siguiente nomenclatura:

* Rn Registro de Propósito General n. 
		Ej.  R1, R0...
* Fm Registro de Punto Flotante m. 
		Ej.  F1, F0...
* #n Valor inmediato n. 
		Ej.  #12, #0...
* n(Rm) Dirección de memoria. 
		Ej.  (R1), 3(R4)...
* LAB: Etiqueta destino de un salto. 
		Ej.  LOOP1:, END:...


Las instrucciones permitidas son:
* ADDI		Rn Rm #i
* ADD		Rn Rm Rp
* MULT		Rn Rm Rp
* ADDF		Fn Fm Fp
* MULTF		Fn Fm Fp
* LW		Rn i(Rm)
* LF		Fn i(Rm)
* SW		Rn i(Rm)
* SF		Fn i(Rm)
* BNE		Rn Rm LAB
* BEQ		Rn Rm LAB
