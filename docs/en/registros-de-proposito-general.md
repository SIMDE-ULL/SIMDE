---
layout: default
lang: en
id: registros-de-proposito-general
title: General Purpose Registers
prev: en/modos-de-direccionamiento.html
next: en/registros-de-punto-flotante.html
---

File with 64 32-bits registers.

They are named R0, R1, R2, ..., R63.


### R0

The value of R0 is always 0.


### Access

The VLIW processor has a special access mode. "Reads" are carried out in the first half of a clock cycle and "writes" in the second one. Thus, WAR hazards are avoided. The Superscalar processor doesn't need this mechanism because the ROB makes this job.


