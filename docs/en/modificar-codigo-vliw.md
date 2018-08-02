---
layout: default
lang: es
id: modificarr-codigo-vliw
title: Modificar código VLIW
prev: en/cargar-codigo-vliw.html
next: en/ventana-registro-memoria.html
---

The design window for VLIW codes contains a Design Grid where every row is an instruction and every column represents different FUs. The first column is the long instruction identifier. 


### Buttons

* **Add**: Click this button to add more instructions (rows) to the Design Grid.
* **Delete**: Click this button to delete the selected instruction (row) from the Design Grid.

* **Clean**: Use this button to reset the Design Grid.

* **Accept**: Click this button to save changes. This button starts a code checking. Any error will show a message: "Error at operation # from long instruction #", so you can easily locate the error.

* **Cancel**: Cancel changes.

* **Save**: Save code to a file.


### "Building" the code

Creating a new VLIW code is easy. You only have to drag single operations from the sequential code window to the VLIW code window. The program allows only to drop operations over valid Functional Units.
Branch operations need to be configured when you drag them, indicating:

* **Destination Instruction**: Long instruction destination of the branch.

* **True Predicate Register**: If branch is taken this predicate register will change its value to TRUE.

* **False Predicate Register**: If branch is NOT taken this predicate register will change its value to TRUE.

* **Predicate Register**: Predicate Register associated to this operation.


### Operation Parameters

Double-click on any operation to modify its parameters. If the operation is a branch operation you will see the parameters listed above. Otherwise, you will see only its associated Predicate Register.


### Delete an operation

To delete an operation select it and press DEL.


### Breakpoints

Double-click on an instruction identifier to add a Breakpoint.


### Influence Area

CTRL + Click on an operation to colour its influence area. So many subsequent instructions as operation latency cycles will be coloured. True-dependent operations shouldn't be scheduled on this area. The influence area also marks instructions where the predicate registers associated to a branch operation can be used.


