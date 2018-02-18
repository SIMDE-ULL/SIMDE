---
layout: default
lang: es
id: modos-de-direccionamiento
title: Modos de direccionamiento
prev: memoria.html
next: registros-de-proposito-general.html
---

El repertorio de instrucciones de la máquina sólo permite direccionamiento de memoria indexado de la forma Inm(Rn).

La dirección se calcula sumando al valor del registro indicado (Rn) el valor inmediato (Inm). Los accesos a memoria se hacen siempre a palabras completas, de tal manera que el valor inmediato se interpreta directamente como un valor de palabra (y no como byte, como suele ser más habitual).

## Ejemplo

// En este ejemplo se accede a la palabra de memoria 5 (3 + 2) para guardar el contenido de R1
ADDI	 R4 R0 #2
SW		 R1 3(R4)

