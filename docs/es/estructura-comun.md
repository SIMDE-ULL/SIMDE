---
layout: default
lang: es
id: estructura-comun
title: Estructura común
prev: ejemplo-de-codigo-secuencial.html
next: juego-de-instrucciones.html
---

Tanto la máquina Superescalar como la VLIW diseñadas para este simulador mantienen una estructura básica común.


## Características Comunes

1. Ambas máquinas están diseñadas para trabajar con palabras de 32 bits, tanto para los tipos de datos entero y flotante.

2. El juego de instrucciones, basado en MIPS IV.

3. Las dos máquinas son monoprograma. El código (tanto el secuencial en la máquina superescalar como el de instrucciones largas en la VLIW) siempre se coloca empezando en la dirección 0, por lo que los saltos son siempre a direcciones absolutas.


## Elementos Comunes

* Memoria.

* Registros de Propósito General (GPR).

* Registros de Punto Flotante (FPR).
