---
layout: default
lang: es
id: introduccion
title: Introducción
prev: index.html
next: instruction-level-paralelism.html
---

## ¿Qué es SIMDE?

SIMDE es un simulador de Arquitecturas **ILP** (Instruction Level Parallelism) que incluye sus dos vertientes más características: 
* Planificación dinámica: Cogiendo como ejemplo una máquina **Superescalar**.
* Planificación estática: Tomando como ejemplo una máquina **VLIW**.

El objetivo del simulador es servir de herramienta para el apoyo docente en la enseñanza de estas arquitecturas. Para ello hace hincapié en los aspectos más destacables de las dos vertientes estudiadas, así como en sus diferencias.

## ¿Qué no es SIMDE?

**SIMDE** no pretende ser un simulador realista de estas arquitecturas. En su diseño contiene un gran número de simplificaciones que intentan clarificar el funcionamiento de la máquina a costa de un mayor rigor técnico. Algunos de los componentes de las máquinas funcionan de manera imposible de implementar en la práctica (o de costes prohibitivos). 

El diseño de la máquina VLIW es extremadamente simple para resaltar aún más sus diferencias con la máquina Superescalar. Este diseño no tiene ninguna utilidad más que como máquina teórica.

**SIMDE** no es un compilador VLIW. Todas las optimizaciones del código y su posterior planificación las realiza el usario.

## Funcionalidades

SIMDE permite:

* Cargar un único programa secuencial cada vez que servirá como base para la ejecución Superescalar o para diseñar un código VLIW.

* Modificar los parámetros de las máquinas Superescalar y VLIW.

* Crear, cargar o modificar un código de instrucciones largas que usar en la simulación VLIW. Además se añaden herramientas para facilitar la creación de este código, como el coloreado de bloques básicos o el chequeo automático del código creado para detectar inconsistencias.

* Modificar el contenido de la memoria y registros.

* Realizar simulaciones continuas o paso a paso de la máquina Superescalar, permitiendo el uso de breakpoints para detener la ejecución en un punto del código determinado.

* Realizar simulaciones continuas o paso a paso de la máquina VLIW, permitiendo el uso de breakpoints para detener la ejecución en un punto del código determinado.