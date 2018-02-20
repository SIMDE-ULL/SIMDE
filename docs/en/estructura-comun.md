---
layout: default
lang: en
id: estructura-comun
title: Shared structure
prev: en/ejemplo-de-codigo-secuencial.html
next: en/juego-de-instrucciones.html
---

Both processors, Superscalar and VLIW, have been designed by using a shared basic structure.

### Common characteristics

1. The processors are intended to work with 32-bit words for both integer and floating point data types.

2. The instruction set repertoire, based on MIPS IV.

3. Both processors are monoprogrammed. Codes (both, sequential code in superscalar processor and long instruction one in VLIW) starts always at memory address 0. Destination of branches are treated always as absolute addresses.

### Common Elements

* Memory.

* General Purpose Registers (GPR).

* Floating Point Registers (FPR).
