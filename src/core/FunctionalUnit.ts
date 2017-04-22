import { Instruction } from './Instruction';
import { Status } from './Status';

export enum FunctionalUnitType {
   INTEGERSUM = 0,
   INTEGERMULTIPLY,
   FLOATINGSUM,
   FLOATINGMULTIPLY,
   MEMORY,
   JUMP
}

export const FUNCTIONALUNITTYPESQUANTITY = FunctionalUnitType.JUMP - FunctionalUnitType.INTEGERSUM + 1;

export class FunctionalUnit {

   private _status: Status;

   private _type: FunctionalUnitType;
   private _latency: number;
   private _flow: Instruction[];


   constructor() {
      this._flow = null;
      this._status = new Status();
      this._status.lastInstruction = 0;
      this._status.stall = 0;
      this._status.instructionNumber = 0;
   }


   public get status(): Status {
      return this._status;
   }

   public set status(value: Status) {
      this._status = value;
   }

   public get type(): FunctionalUnitType {
      return this._type;
   }

   public set type(value: FunctionalUnitType) {
      this._type = value;
   }


   public get latency(): number {
      return this._latency;
   }

   public set latency(value: number) {
      this._latency = value;
      this._status.lastInstruction = value - 1;
      this._status.instructionNumber = 0;
      this._flow = new Array(value).fill(null);
   }


   public get flow(): Instruction[] {
      return this._flow;
   }

   public set flow(value: Instruction[]) {
      this._flow = value;
   }

   tic() {
      if (this._status.stall === 0) {
         if (this._flow[this._status.lastInstruction] != null) {
            this._flow[this._status.lastInstruction] = null;
            this._status.instructionNumber--;
         }
         // WTF is this line?
         this._status.lastInstruction = (this._latency + this._status.lastInstruction - 1) % this._latency;
      } else {
         this._status.stall--;
      }

   }

   fillFlow(instruction: Instruction): number {
      this._flow[(this._status.lastInstruction + 1) % this._latency] = instruction;
      if (instruction != null) {
         this._status.instructionNumber++;
      }

      return (this._status.lastInstruction + 1) % this._latency;
   }

   clean() {
      this._flow = new Array(this._latency).fill(null);
      this._status.lastInstruction = this._latency - 1;
      this._status.stall = 0;
      this._status.instructionNumber = 0;
   }

   isFree(): boolean {
      return (this.flow[(this.status.lastInstruction + 1) % this.latency] == null);
   }

   getTopInstruction(): Instruction {
      return this._flow[this._status.lastInstruction];
   }

   getInstructionByIndex(index: number): Instruction {
      return this._flow[(this._status.lastInstruction + index + 1) % this._latency];
   }

   getLast(): number {
      return this.status.lastInstruction;
   }
}