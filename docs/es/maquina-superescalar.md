---
layout: default
lang: es
id: maquina-superescalar
title: Máquina superescalar
prev: unidades-funcionales.html
next: unidad-de-prebusqueda.html
---

![](imgs/bm40.png)

Características

1. Control de la máquina basado en el algoritmo de Tomasulo

2. El parámetro más importante de esta máquina es el Grado de Emisión (nos referiremos a este parámetro simplemente como Emisión a partir de ahora), que es el número máximo de instrucciones que pueden emitirse por ciclo, pero también el número máximo de instrucciones que pueden graduarse (commit) por ciclo.

3. Emplea predicción dinámica de saltos.


### Componentes

* **Prefetch**: Unidad de prebúsqueda de instrucciones.

* **Decoder**: Decodificador de las instrucciones

* **ROB<->GPR**: Posición del ROB donde se está procesando un registro de propósito general

* **ROB<->FPR**: Posición del ROB donde se está procesando un registro de punto flotante

* **Predicción Salto**: Tabla de predicción de salto

* **ROB**: Reorder Buffer

* **E.R.**: Estaciones de Reserva

* **U.F.**: Unidades Funcionales

* **ALU de cálculo de direcciones**: Unidad para calcular las direcciones de las instrucciones de memoria
