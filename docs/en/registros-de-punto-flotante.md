---
layout: default
lang: en
id: registros-de-punto-flotante
title: Floating Point Registers
prev: en/registros-de-proposito-general.html
next: en/unidades-funcionales.html
---

File with 64 32-bits single-precision registers.

They are named F0, F1, F2, ..., F63.


### Access

The VLIW processor has an special access mode. "Reads" are carried out in the first half of a clock cycle and "writes" in the second one. Thus, WAR hazards are avoided. The Superscalar processor doesn't need this mechanism because the ROB makes this job.

