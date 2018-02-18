---
layout: default
lang: en
id: tabla-de-prediccion-de-salto
title: Branch prediction
prev: en/rob-registros.html
next: en/reorder-buffer.html
---

The Branch Prediction Table uses a 2-bit scheme to predict if a branch must be taken or not.

The table has 16 entries. The last 4 bits of the memory address of a branch instruction are used to know what entry corresponds to the branch.

The next scheme shows how the 2-bits algorithm works.

![](imgs/bm41.png)

