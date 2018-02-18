---
layout: default
lang: es
id: unidades-funcionales
title: Unidades funcionales
prev: registros-de-punto-flotante.html
next: maquina-superescalar.html
---

Las Unidades Funcionales (UF) son las únidades básicas de ejecución de la máquina.

Son segmentadas, y cada etapa del pipeline dura 1 ciclo exactamente. De esta manera, cada ciclo puede entrar una nueva instrucción a menos que tenga una dependencia verdadera con la instrucción anterior. En ese caso, deberá esperar hasta que la instrucción anterior haya acabado completamente su ejecución. A este tiempo lo denominamos latencia de la UF, y coincide con el número de etapas del pipeline.

### Tipos

* Suma entera: Para efectuar las operaciones ADD y ADDI, y el cálculo de direcciones en la VLIW (en la máquina superescalar esta función se considera integrada en la UF de memoria).

* Multiplicación entera: Efectúa la operación MULT.

* Suma flotante: Efectúa la operación ADDF.

* Multiplicación flotante: Efectúa la operación MULTF.

* Memoria: Se encarga de todas las operaciones referentes a memoria (LW, SW, LF, SF). En la máquina Superescalar se considera que tiene integrada una ALU para el cálculo de direcciones, mientras que en la VLIW sólo representa el tiempo de acceso a la memoria

* Salto: Se encarga de las operaciones de salto, evaluando las condiciones y cambiando el PC (y la tabla de predicción en la máquina Superescalar).