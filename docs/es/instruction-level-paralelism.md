---
layout: default
lang: es
id: instruction-level-paralelism
title: ILP
prev: introduccion.html
next: menu-archivo.html
---

El Paralelismo a Nivel de Instrucción es la capacidad de un conjunto de instrucciones de poder ser ejecutadas en paralelo.

Existen numerosas técnicas que intentan explotar esta capacidad, desde la segmentación hasta la emisión de múltiples instrucciones por ciclo. Es precisamente con este último grupo de máquinas con las que trabaja este simulador.

Existen dos claras vertientes para manejar la emisión múltiple (Multiple Issue), que se ven en los dos puntos siguientes.


## Planificación Dinámica de Instrucciones

El hardware se encarga de reordenar las instrucciones para aprovechar el paralelismo, con lo que se emplea una ejecución fuera de orden (out_of_order). Las máquinas Superescalares suelen emplear esta técnica. 


## Planificación Estática de Instrucciones

El compilador se encarga de reordenar las instrucciones para aprovechar el paralelismo, con lo que se consigue una gran simplificación del hardware. Emplea ejecución en orden (in_order). Esta es la técnica básica en las máquinas VLIW.

