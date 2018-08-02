---
layout: default
lang: es
id: registro-predicado
title: Registros de Predicado
prev: en/nat-gpr-fpr.html
next: en/predicacion-operaciones.html
---

All operations in the VLIW processor have an associated Predicate Register. These registers hold a boolean value useful for the implementation of Operation Predication. An operation with an associated FALSE predicate register causes the operation to be canceled.

The VLIW processor has 64 registers named p0, p1, ..., p63.

The value of p0 is always TRUE. This register is used for operations with non-explicit predication.

 

