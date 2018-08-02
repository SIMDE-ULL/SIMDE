---
layout: default
lang: es
id: modificarr-codigo-vliw
title: Modificar código VLIW
prev: cargar-codigo-vliw.html
next: ventana-registro-memoria.html
---

La ventana de diseño de Código VLIW se compone de una Rejilla de Diseñoen la que cada fila es una instrucción y cada columna, una U.F. de la máquina. La primera columna es el identificador de la instrucción larga. 


### Botones

Se dispone de una serie de botones para facilitar la creación del código:

* Añadir: Permite añadir más instrucciones (filas) a la Rejilla de Diseño.

* Eliminar: Permite eliminar la instrucción seleccionada de la Rejilla de Diseño.

* Limpiar: Deja la ventana de diseño en blanco. 

* Aceptar: Guarda los cambios realizados en el código. Al pulsar Aceptar se realizan una serie de comprobaciones sobre el código. Los mensajes de error se devuelven de la forma: "Error en la operación # de la instrucción larga #", con lo que resulta sencillo localizar el fallo.

* Cancelar: Cancela los cambios realizados.

* Guardar: Guarda el código en un fichero.


### "Construcción" del código

La creación del código VLIW es muy sencilla. Basta con arrastrar las operaciones desde la ventana de código secuencial hasta la ventana de código VLIW. El programa sólo permite arrastrar las operaciones a una U.F. donde puedan ser ejecutadas.

Las operaciones de salto deben ser configuradas en el momento de arrastrarlas. Debe indicarse:

* Instrucción destino: La instrucción larga destino del salto.

* Registro Predicado Verdadero: El Registro de Predicado que cambiará su valor a VERDADERO si el salto es tomado.

* Registro Predicado Falso: El Registro de Predicado que cambiará su valor a VERDADERO si el salto NO es tomado.

* Registro Predicado: Registro de Predicado asociado a esta operación.


### Parámetros de la operación

Los parámetros de una operación pueden ser modificados en cualquier momento haciendo doble clic sobre la operación en concreto. Si se trata de una operación de salto aparecerán los parámetros que se nombraron antes; en otro caso simplemente se solicita el Registro de Predicado asociado a la operación.


### Eliminación de una operación

Una operación puede eliminarse seleccionándola y pulsando la tecla SUPR.


### Breakpoints

Puede añadirse un Breakpoint haciendo doble clic sobre el identificador de la instrucción.


### Colorear zona de influencia

También puede observarse la zona de influencia de una operación haciendo CTRL + clic con el botón izquierdo del ratón sobre la misma. De esta forma se colorean las instrucciones durante las cuales no pueden planificarse operaciones que tengan operandos dependientes de la operación marcada o, en el caso de los saltos, las instrucciones en las que pueden usarse los registros de predicado asociados a ese salto.


