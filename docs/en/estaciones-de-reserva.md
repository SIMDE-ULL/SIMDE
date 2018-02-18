---
layout: default
lang: en
id: estaciones-de-reserva
title: Reserve Stations
prev: en/reorder-buffer.html
next: en/calculo-de-direcciones.html
---


This structure holds the instructions while they are waiting for their operands or they are executing in the corresponding FU. 

Let T be a specific type of FU. There is an associated RE[T] for each type of FU. Let N[T] be the number of FU[T] and let P[T] be the number of pipeline stages of this FU. The number of entries of RE[T] is computed by using the following expression: N[T] * P[T] + 1


### Fields

* Inst.: Instruction identifier.
* Qj: The ROB entry that will produce the first source operand. A value of -1 indicates that the source operand is already available in Vj.
* Vj: Value of the first source operand if (Qj = -1).
* Qk: The ROB entry that will produce the first source operand. A value of -1 indicates that the source operand is already available in Vk.
* Vk: Value of the first source operand if (Qk = -1).
* A: Memory address.
* ROB: ROB entry where this instruction is being processed.
