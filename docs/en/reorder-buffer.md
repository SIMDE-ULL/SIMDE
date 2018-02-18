---
layout: default
lang: en
id: reorder-buffer
title: Reorder Buffer
prev: en/tabla-de-prediccion-de-salto.html
next: en/estaciones-de-reserva.html
---

This structure allows the instructions to execute out of order but to commit in order. ROB holds the results of instructions that have finished execution but have not commited, preventing any irrevocable action.
The ROB has as many entries as the amount of entries from all the REs.


### Fields

* # The identifier of this entry of the ROB
* Inst.: Instruction identifier
* Destin.: The destination register for the instruction
* Value: Result of the instruction
* Addr.: Memory Address used by the instruction (if it's the case)
* Stage: Current stage of the instruction (ISSUE, EXECUTE, WRITERESULT, COMMIT)