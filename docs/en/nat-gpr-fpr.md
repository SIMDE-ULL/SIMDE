---
layout: default
lang: es
id: nat-gpr-fpr
title: NaT(GPR y FPR)
prev: en/maquina-vliw.html
next: en/registro-predicado.html
---

Each FPR or GPR has an associated NaT (Not A Thing) bit. If this register is the destination of a LOAD operation, and this operation results in a cache miss this bit is set to 1.

