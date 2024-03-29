import type { Instruction } from "./Instruction";

import { CodeParser } from "./CodeParser";
import { Machine } from "./Machine";

export class Code {
  private _lines: number;
  private readonly _instructions: Instruction[] = new Array();
  private _numberOfBlocks = 0;

  public get instructions(): Instruction[] {
    return this._instructions;
  }

  public get lines(): number {
    return this._lines;
  }

  public get numberOfBlocks(): number {
    return this._numberOfBlocks;
  }

  public toggleBreakpoint(index: number) {
    this.instructions[index].toggleBreakPoint();
  }

  public load(input: string) {
    const codeParsed = new CodeParser(input, Machine.NGP, Machine.MEMORY_SIZE);

    // First we need the number of code lines
    this._lines = codeParsed.lines;
    this.instructions.length = codeParsed.instructions.length;

    // Iterate over all parsed instructions
    for (let i = 0; i < codeParsed.instructions.length; i++) {
      // add the instruction to the array and set its id
      this.instructions[i] = codeParsed.instructions[i];
      this.instructions[i].id = i;

      // Assign the label to the instruction, if is the first instruction of a block
      for (const key in codeParsed.labels) {
        if (codeParsed.labels[key] === i) {
          this.instructions[i].label = key;
          this._numberOfBlocks++;
        } else {
          this.instructions[i].label = "";
        }
      }

      // Resolve labels on the operands of jump instructions
      if (this.instructions[i].isJumpInstruction()) {
        if (this.instructions[i].operandsString[2] in codeParsed.labels) {
          this.instructions[i].setOperand(
            2,
            codeParsed.labels[this.instructions[i].operandsString[2]],
            this.instructions[i].operandsString[2]
          );
        } else {
          throw new Error(
            `Can not find Jump destination(labeled ${this.instructions[i].operandsString[2]}) on instruction ${this.instructions[i].id} at line ${i}`
          );
        }
      }

      // Set the basic block of the instruction
      this.instructions[i].basicBlock = this._numberOfBlocks;
    }
  }

  /**
   * save
   */
  public save(): string {
    let result = this.lines + "\n";

    for (let i = 0; i < this.instructions.length; i++) {
      // Check if there is a label at line i
      if (this.instructions[i].label !== "") {
        result += this.instructions[i].label + ":\n";
      }

      result += "\t" + this.instructions[i].toString() + "\n";
    }

    return result;
  }

  public getFunctionalUnitType(index: number) {
    return this.instructions[index].getFunctionalUnitType();
  }
}
