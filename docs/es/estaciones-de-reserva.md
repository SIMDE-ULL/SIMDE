---
layout: default
lang: es
id: estaciones-de-reserva
title: Estaciones de reserva
prev: reorder-buffer.html
next: calculo-de-direcciones.html
---


Estructura en la que permanecen las instrucciones mientras esperan por sus operandos o se ejecutan en la U. F. correspondiente.
Tienen tantas entradas como una más que el número de etapas de la U.F. correspondiente multiplicada por el número de U.F. de ese tipo que haya.


### Campos

* Inst.: Identificador de la instrucción
* Qj: Disponibilidad del primer operando. -1 indica que el valor se encuentra en Vj; otro valor indica la posición del ROB donde se está procesando el operando.
* Vj: Valor del primer operando si (Qj = -1).
* Qk: Disponibilidad del segundo operando. -1 indica que el valor se encuentra en Vk; otro valor indica la posición del ROB donde se está procesando el operando.
* Vk: Valor del segundo operando si (Qk = -1).
* A: Dirección de memoria
* ROB: Posición del ROB donde está esta instrucción
