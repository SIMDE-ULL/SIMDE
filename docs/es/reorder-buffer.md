---
layout: default
lang: es
id: reorder-buffer
title: Reorder Buffer
prev: tabla-de-prediccion-de-salto.html
next: estaciones-de-reserva.html
---

Estructura que permite la ejecución fuera de orden (out of order) conservando el orden de graduación (commit) de las instrucciones.
El ROB tiene tantas entradas como la suma de las entradas de todas las ER.


### Campos

* Nº: Número de entrada en el ROB
* Inst.: Identificador de la instrucción
* Destino: Número de registro destino de la instrucción
* Valor: Resultado de la instrucción
* Direc.: Dirección con la que opera la instrucción (si corresponde)
* Etapa: Etapa actual de la instrucción (ISSUE, EXECUTE, WRITERESULT, COMMIT)