import type { Code } from "@/core/Common/Code";
import { LargeInstruction } from "./LargeInstructions";
import type { VLIWOperation } from "./VLIWOperation";
import { ExportAsString, Parse } from "./VLIWParser";

export class VLIWCode {
  public instructions: LargeInstruction[];

  private _largeInstructionNumber: number;
  private _superescalarCode: Code;

  constructor(n?: number) {
    if (n) {
      this.instructions = new Array(n);
      this.instructions.fill(new LargeInstruction());
    } else {
      this.instructions = [];
    }
    this._largeInstructionNumber = 0;
  }

  // Getters
  public getLargeInstructionNumber(): number {
    return this._largeInstructionNumber;
  }

  public getLargeInstruction(index: number): LargeInstruction {
    if (index < 0 || index >= this._largeInstructionNumber) {
      return null;
    }
    return this.instructions[index];
  }

  public getBreakPoint(index: number): boolean {
    return this.instructions[index].getBreakPoint();
  }

  // Setters
  public setInstructionNumber(index: number) {
    this.instructions = new Array<LargeInstruction>(index);
    this._largeInstructionNumber = index;
  }

  public setBreakPoint(index: number, b: boolean) {
    this.instructions[index].setBreakPoint(b);
  }

  public addOperacion(index: number, oper: VLIWOperation) {
    this.instructions[index].addOperation(oper);
  }

  public get superescalarCode(): Code {
    return this._superescalarCode;
  }

  public set superescalarCode(code: Code) {
    this._superescalarCode = code;
  }

  public clear() {
    this.instructions = null;
    this._largeInstructionNumber = 0;
  }

  public save(): string {
    return ExportAsString(this._largeInstructionNumber, this.instructions);
  }

  public load(input: string, code: Code): void {
    this.instructions = Parse(input, code);
    this._largeInstructionNumber = this.instructions.length;
    this._superescalarCode = code;
  }
}
