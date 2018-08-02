---
layout: default
lang: es
id: maquina-vliw
title: Máquina vliw
prev: en/calculo-de-direcciones.html
next: en/nat-gpr-fpr.html
---

![](imgs/bm42.png)

Characteristics

1. It has an extremely simple hardware.

2. It issues only a single instruction per cycle.

3. The long instruction is composed by as many operations (sequential or "short" instructions) as FU in the system. The type of the operations fits exactly with the FUs type.

4. It uses predicated operations.


### Componentes

* **Nat(GPR)**: Each GPR has an extra bit called NaT (Not a Thing). This bit is set to 1 if a cache miss occurs with a LOAD operation using this register as destination.

* **NaT (FPR)**: Each FPR has an extra bit called NaT (Not a Thing). This bit is set to 1 if a cache miss occurs with a LOAD operation using this register as destination.

* **Reg. Pred.**: Predicate Registers.

* **U.F.**: Functional Units.

When we're talking about the VLIW processor an "operation" is a sequential instruction (ADDI, LF...). A long instruction composed by operations is called only "instruction".