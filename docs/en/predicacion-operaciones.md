---
layout: default
lang: es
id: predicacion-operaciones
title: Predicación de Operaciones
prev: en/registro-predicado.html
next: en/referencias.html
---

The Operation Predication is a mechanism that allows to execute simultaneously operations from the true and the false path of a branch. Thus, we can improve the performance of the processor by using some FUs that otherwise will be wasted.

Each branch has two associated Predicate Registers: one of these will be set to 1 if the branch is taken (True Pred.); the other one will be set to 1 if the branch is not taken (False Pred.).

All operations have an associated Predicate Register. This register is used to determine if instruction will be executed or not. All the operations corresponding to the not-taken path of a branch will be canceled.

