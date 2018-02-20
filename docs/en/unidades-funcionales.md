---
layout: default
lang: en
id: unidades-funcionales
title: Functional Units
prev: en/registros-de-punto-flotante.html
next: en/maquina-superescalar.html
---

The Functional Units (FU) are the basic unit for the processor execution.

They are pipelined, with 1 cycle per pipeline stage. Thus, a new instruction (operation of a VLIW processor) enters in the pipeline each cycle unless it has a true dependence with the previous instruction. If this is the case, the entering instruction must be stalled until the previous instruction has finished. The time the instruction is stalled is called Latency and it fits with the number of pipeline stages.


### Types

* Integer Add: It performs the ADDI and ADD operations, and the address computing for the superscalar processor (the VLIW processor includes this work in the memory FU).

* Integer Multiplication: It performs the MULT operation.

* FP Add: It performs the ADDF operation.

* FP Multiplication: It performs the MULTF operation.

* Memory: It performs all the memory operations (LW, LF, SW, SF). The VLIW processor adds an ALU for address computing into this unit. 

* Branch: It performs all branch operations. It evaluates conditions and change the PC (if it's necessary). Branch Prediction Table in superscalar processor is handled by this unit too).
