---
layout: default
lang: es
id: registros-de-proposito-general
title: Registros de propósito general
prev: modos-de-direccionamiento.html
next: registros-de-punto-flotante.html
---

Banco de 64 registros de 32 bits.

Se denotan R0, R1, R2, ..., R63.


	R0

El valor de R0 se mantiene siempre a 0.


	Acceso

En la máquina VLIW la lectura se realiza en la primera mitad del ciclo y la escritura en la segunda mitad. De esta manera se evitan los riesgos WAR. En la máquina Superescalar no tiene sentido este añadido, ya que este tipo de dependencias se eliminan con el ROB.

