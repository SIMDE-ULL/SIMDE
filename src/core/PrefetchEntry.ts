import { Instruction } from './Instruction';

export class PrefetchEntry {
   private _instruction: Instruction;

   public get instruction(): Instruction {
      return this._instruction;
   }

   public set instruction(value: Instruction) {
      this._instruction = value;
   }

}