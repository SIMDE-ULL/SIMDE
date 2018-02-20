---
layout: default
lang: en
id: memoria
title: Memory
prev: en/juego-de-instrucciones.html
next: en/modos-de-direccionamiento.html
---

The memory employes a ficticious scheme with two separated caches: instruction and data.

### Main Memory

Main memory contains 1024 32-bit words.

### Instruction Cache

The instruction cache is designed to completely contain the sequential code (and the VLIW code if it's been using too). Thus, instruction cache misses never occur.

### Data Cache

The data cache generates random cache misses for loads. The miss rate is a user-defined parameter.
