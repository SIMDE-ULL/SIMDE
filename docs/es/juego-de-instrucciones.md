---
layout: default
lang: es
id: juego-de-instrucciones
title: Juego de instrucciones
prev: estructura-comun.html
next: memoria.html
---

El Juego de Instrucciones (Operaciones en la máquina VLIW) es común a las dos máquinas. Sin embargo hay ligeras diferencias en el comportamiento de algunas de las instrucciones.

	ADDI
Suma Entera con Inmediato sin signo
ADDI Rd, Ro1, #Inm
Rd = Ro1 + Inm
Se opera en la UF de Suma Entera

	ADD
Suma Entera
ADD Rd, Ro1, Ro2
Rd = Ro1 + Ro2
Se opera en la UF de Suma Entera

	MULT
Multiplicación Entera
MULT Rd, Ro1, Ro2
Rd = Ro1 * Ro2
Se opera en la UF de Multiplicación Entera

	ADDF
Suma Punto Flotante
ADDF Fd, Fo1, Fo2
Fd = Fo1 + Fo2
Se opera en la UF de Suma en Punto Flotante

	MULTF
Multiplicación Punto Flotante
MULTF Fd, Fo1, Fo2
Fd = Fo1 * Fo2
Se opera en la UF de Multiplicación en Punto Flotante

	LW
Load Entero
LW Rd, Inm(Ro)
Rd = MEM[Ro + Inm]
Se opera en la UF de Memoria

	LF
Load Flotante
LF Fd, Inm(Ro)
Fd = MEM[Ro + Inm]
Se opera en la UF de Memoria

	SW
Store Entero
SW Ro, Inm(Rd)
MEM[Rd + Inm] = Ro
Se opera en la UF de Memoria

	SF
Store Flotante
SF Fo, Inm(Rd)
MEM[Rd + Inm] = Fo
Se opera en la UF de Memoria

	BNE
Salta si distinto
BNE Ro1, Ro2, Etiqueta
Si (Ro1 != Ro2)
	Saltar a instrucción apuntada por Etiqueta
Se opera en la UF de Salto

	BEQ
Salta si igual
BEQ Ro1, Ro2, Etiqueta
Si (Ro1 == Ro2)
	Saltar a instrucción apuntada por Etiqueta
Se opera en la UF de Salto