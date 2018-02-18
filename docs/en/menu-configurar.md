---
layout: default
lang: en
id: menu-configurar
title: Config menu
prev: en/menu-ver.html
next: en/menu-ejecutar.html
---

This menu contains utilities to configure processor parameters.


## Superscalar Configuration

Use this menu item to show the Superscalar Configuration window, that allows to modify the main parameters of the superscalar processor.


## VLIW Configuration

Use this menu item to show the VLIW Configuration window, that allows to modify the main parameters of the VLIW processor.


## Memory-Registers data

This menu item allows to load/save the contents of memory and registers from/to a file:

* Save Mem/Reg to File: Allows the user to save the contents of the memory and registers of the superscalar or the VLIW processor to a file.
* Load Mem/Reg from File: Allows the user to load the contents of the memory and the registers from a file. The user is asked in order to fill only the superscalar processor, only the VLIW one or both.


## VLIW Instructions

This menu contains some useful options in order to design a VLIW code:

* Create New VLIW Code: Use this menu item to create a blank VLIW code.
* Load VLIW Code...: Use this menu item to load a VLIW code from a file.


## Options

This menu contains some general options:

* Reset Processor at start: If this option is marked the registers and memory are reset every time you start a new simulation. Otherwise, the values are perserved.
* Check VLIW Code: If this option is marked every new VLIW code is checked looking for errors.
* % Data Cache Miss: Use this option to set the data cache miss rate when you use a LOAD instruction. Use 0 for no misses and 100 for direct main memory access.