---
layout: default
lang: es
id: ventana-simulacion
title: Ventana de simulación
prev: ventana-registros-memoria.html
next: fichero-de-codigo-secuencial.html
---

En esta ventana se observa la estructura básica de la máquina Superescalar. 
![](imgs/bm25_result.png)


## Componentes mostrados

* Prefetch: Unidad de prebúsqueda de instrucciones.

* Decoder: Decodificador de las instrucciones


* ROB<->GPR: Posición del ROB donde se está procesando un registro de propósito general (-1 si el registro no está asociado a ninguna entrada del ROB). Se muestra sólo un subconjunto de los elementos. Se pueden añadir o quitar elementos mediante los botones ![](imgs/bm26_result.png) y ![](imgs/bm21_result.png), indicándolos como una lista de números (o intervalos) separada por comas (ej. 2,12-18,20).

* ROB<->FPR: Posición del ROB donde se está procesando un registro de punto flotante (-1 si el registro no está asociado a ninguna entrada del ROB). Se muestra sólo un subconjunto de los elementos. Se pueden añadir o quitar elementos mediante los botones ![](imgs/bm27_result.png) y ![](imgs/bm21_result.png), indicándolos como una lista de números (o intervalos) separada por comas (ej. 2,12-18,20).

* Predicción Salto: Tabla de predicción de salto. Si vale F es que el salto que coincide con esa dirección no se toma; si vale V el salto se toma. Además de esto se muestra el valor binario de la entrada de la tabla entre paréntesis.

* ROB: Reorder Buffer. 

* E.R.: Estaciones de Reserva. 

* U.F.: Unidades Funcionales. En la parte superior aparece el nombre de la UF. Hay tantas columnas como UF de ese tipo estén declaradas. Cada columna representa una UF. Las filas representan el pipeline de la UF.


## Alto y ancho de los componentes

El alto y ancho de la mayoría de los componentes puede modificarse poniendo el ratón sobre alguno de sus bordes y arrastrando manteniendo presionado el botón izquierdo del ratón. Tanto las ER como las UF pueden ocultarse haciendo doble clic sobre el nombre de la UF o ER correspondiente. Al hacer doble clic otra vez se volverá a mostrar.


## Colorear las instrucciones

Si se hace doble clic con el ratón encima de una entrada del ROB puede seleccionarse un color para asociar con dicha entrada. De esta manera, se coloreará esta entrada y las entradas correspondientes en la ER y la UF (si existen).

