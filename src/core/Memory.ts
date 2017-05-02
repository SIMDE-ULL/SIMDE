import { randomNumber } from './utils/Random';

export interface Datum {
   datum: number;
   got: boolean;
}

export class Memory {

   private static MEMORY_NUMBER: number = 1024;

   private _data: number[];
   private _fail: boolean[];
   private _failProbability: number;

   constructor() {
      this.data = new Array(Memory.MEMORY_NUMBER);
      this.fail = new Array(Memory.MEMORY_NUMBER);

      this.failProbability = 0;
   }

   getDatum(address: number): Datum {
      if (address < 0) {
         address = 0;
      }
      let valueToReturn = {
         datum: this.data[address],
         got: true
      };
      let failValue = randomNumber(100);

      // There will be a fail only if there wasn't a previous fail on the same position
      if ((failValue < this.failProbability) && !this.fail[address]) {
         this.fail[address] = true;
         valueToReturn.got = false;
         return valueToReturn;
      }
      this.fail[address] = true;
      return valueToReturn;
   }

   setDatum(address: number, value: number) {
      if (address < 0) {
         address = 0;
      }
      this.data[address] = value;
   }

   setMem(datum: number) {
      this.data.fill(datum);
   }

   public get data(): number[] {
      return this._data;
   }

   public set data(value: number[]) {
      this._data = value;
   }

   public get fail(): boolean[] {
      return this._fail;
   }

   public set fail(value: boolean[]) {
      this._fail = value;
   }

   public get failProbability(): number {
      return this._failProbability;
   }

   public set failProbability(value: number) {
      this._failProbability = value;
   }

}
