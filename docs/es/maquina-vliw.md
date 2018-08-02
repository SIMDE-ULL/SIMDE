---
layout: default
lang: es
id: maquina-vliw
title: Máquina vliw
prev: calculo-de-direcciones.html
next: nat-gpr-fpr.html
---

![](imgs/bm42.png)

Características

1. Hardware extremadamente simple.

2. Emisión de una instrucción larga por ciclo

3. La instrucción tiene tantas operaciones y de igual tipo que el número de UF que haya.

4. Emplea operaciones predicadas.


### Componentes

* **Nat(GPR)**: Bits de NaT (Not a Thing). Se ponen a TRUE cuando el registro de propósito general asociado es destino de una operación de LOAD que tuvo un fallo de caché.

* **NaT (FPR)**: Bits de NaT (Not a Thing). Se ponen a TRUE cuando el registro de punto flotante asociado es destino de una operación de LOAD que tuvo un fallo de caché.

* **Reg. Pred.**: Registros de Predicado.

* **U.F.**: Unidades Funcionales

En la máquina VLIW se denomina "operación" a las instrucciones del código secuencial (ADDI, LF...). En general, se entenderá por "instrucción" la instrucción larga compuesta de operaciones. 