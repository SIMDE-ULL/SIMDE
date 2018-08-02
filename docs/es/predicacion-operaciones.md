---
layout: default
lang: es
id: predicacion-operaciones
title: Predicación de Operaciones
prev: registro-predicado.html
next: referencias.html
---

La Predicación de Operaciones es un mecanismo que permite ejecutar las operaciones de las dos ramas de un Branch simultáneamente para aprovechar los recursos de la máquina. 
La Predicación se realiza asociando con el salto dos Registros de Predicado: un registro que se activará si el salto es tomado (Pred. Verdadero) y un registro que se activará si el salto no es tomado (Pred. Falso).
Todas las operaciones llevan un Registro de Predicado asociado. Este registro se emplea para determinar si la instrucción se ejecuta o no. Cuando el salto es evaluado, se anulan aquellas operaciones que correspondan a la rama no tomada del salto.
