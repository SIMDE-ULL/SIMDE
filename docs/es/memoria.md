---
layout: default
lang: es
id: memoria
title: Memoria
prev: juego-de-instrucciones.html
next: modos-de-direccionamiento.html
---

La memoria emplea un esquema ficticio con cachés separadas para datos e instrucciones.


### Memoria Principal

La memoria principal contiene 1024 palabras de 32 bits.


### Caché de Instrucciones

La caché de instrucciones está diseñada para contener completamente el programa secuencial (y el programa VLIW si se está empleando), de tal manera que nunca se producen fallos de caché al intentar leer una instrucción.


### Caché da Datos

La caché de datos genera fallos de lectura de manera aleatoria. El porcentaje de fallos es un parámetro definido por el usuario.
