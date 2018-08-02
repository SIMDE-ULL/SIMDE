---
layout: default
lang: es
id: registro-predicado
title: Registros de Predicado
prev: nat-gpr-fpr.html
next: predicacion-operaciones.html
---

Los Registros de Predicado son unos registros booleanos que se asocian con todas las operaciones de la máquina VLIW para implementar los mecanismos de Predicación de Operaciones. Si un Registro de Predicado asociado a una operación toma un valor FALSO implica la anulación de la ejecución de la operación.

Se dispone de 64 registros denotados por p0, p1, ..., p63.

El Registro de Predicado p0 siempre tiene como valor VERDADERO. Se emplea asociado con aquellas operaciones que no llevan Predicación explícita.
