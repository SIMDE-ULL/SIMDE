---
layout: default
lang: en
id: fichero-de-codigo-secuencial
title: Sequential Code File
prev: en/ventana-simulacion.html
next: en/ejemplo-de-codigo-secuencial.html
---

The input sequential code files allows the user to easily define a sequential code with any text editor. The .pla extension is required for all code files.


### Characteristics

File must be created with the following characteristics:
* The first line (not a commentary) must contain the number of instructions of code.
* Each instruction must be placed in a new line.
* Operands are separated with blanks or tabs.
* Labels must be placed at the start of the line and always finishes with a ":".
* Commentaries start with "//". From here to the end of the line will be considered as a commentary.


### Instructions

The instructions are inspired in the MIPS IV repertory. We use the next nomenclature:

* Rn General Purpose Register n. 
		f. i.  R1, R0...
* Fm Floating Point Register m. 
		f. i.  F1, F0...
* #n Inmediate value n. 
		f. i.  #12, #0...
* n(Rm) Memory address. 
		f. i.  (R1), 3(R4)...
* LAB: Branch destiny label. 
		f. i.  LOOP1:, END:...


The allowed instructions are:
* ADDI		Rn Rm #i
* ADD		Rn Rm Rp
* SUB		Rn Rm Rp
* AND		Rn Rm Rp
* OR		Rn Rm Rp
* NOR		Rn Rm Rp
* XOR		Rn Rm Rp
* SLLV		Rn Rm Rp
* SRLV		Rn Rm Rp
* MULT		Rn Rm Rp
* ADDF		Fn Fm Fp
* SUBF		Fn Fm Fp
* MULTF		Fn Fm Fp
* LW		Rn i(Rm)
* LF			Fn i(Rm)
* SW		Rn i(Rm)
* SF			Fn i(Rm)
* BNE		Rn Rm LAB
* BEQ		Rn Rm LAB
* BGT		Rn Rm LAB