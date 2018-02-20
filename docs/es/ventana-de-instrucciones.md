---
layout: default
lang: es
id: ventana-de-instrucciones
title: Ventana de instrucciones
prev: barra-de-herramientas-de-ejecucion.html
next: configurar-parametros-superescalar.html
---

La Ventana de Instrucciones permite visualizar el código secuencial cargado desde un fichero.

![](imgs/bm16_result.png)
Las instrucciones se muestran en orden secuencial.

En la primera columna aparece el número de orden de la instrucción, que servirá como Identificador. También aparecen en esta columna las etiquetas entre corchetes ([etiqueta:]) a continuación del número de instrucción.

La segunda columna es el código de la operación (opcode).

Las siguientes columnas son los operandos.


### Breakpoints

Haciendo doble clic sobre cualquier campo de la instrucción se establece un Breakpoint válido para la ejecución superescalar (los Breakpoints de la máquina VLIW se indican sobre las instrucciones largas). El breakpoint se indica con el color rojo en la columna del Identificador. Para quitar el Breakpoint basta con volver a hacer doble clic.


### Ocultar el código

Si se hace doble clic en el título con el nombre del fichero, se ocultará está ventana. Para volver a verla hay que ir al menú Ver => Código Secuencial..


### Bloques básicos

Para colorear los Bloques Básicos del código basta con ir al menú Ver => Bloques Básicos.