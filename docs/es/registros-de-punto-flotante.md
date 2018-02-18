---
layout: default
lang: es
id: registros-de-punto-flotante
title: Registros de punto flotante
prev: registros-de-proposito-general.html
next: unidades-funcionales.html
---
Banco de 64 registros de 32 bits. Emplea simple precisión.

Se denotan F0, F1, F2, ..., F63.


### Acceso

En la máquina VLIW la lectura se realiza en la primera mitad del ciclo y la escritura en la segunda mitad. De esta manera se evitan los riesgos WAR. En la máquina Superescalar no tiene sentido este añadido, ya que este tipo de dependencias se eliminan con el ROB.
