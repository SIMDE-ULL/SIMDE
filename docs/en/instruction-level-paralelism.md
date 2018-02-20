---
layout: default
lang: en
id: instruction-level-paralelism
title: ILP
prev: en/introduccion.html
next: en/menu-archivo.html
---

Instruction Level Parallelism is the potential ability of a set of instruction to be executed in parallel.

There are lots of techniques that try to exploit ILP such as segmentation or Multiple Issue. This simulator illustrates two basic flavours of processors with multiple instruction issue per clock.


## Dynamic Instruction Scheduling

Instructions are reordered by hardware in order to exploit parallelism. It results in an out-of-order execution.  Most of Superscalar processors use this kind of execution . 


## Static Instruction Scheduling

Instructions are reordered by the compiler in order to exploit parallelism. Thus, hardware is significantly reduced. It results in an in-order execution and this is the basic technique that VLIW processors employe.
