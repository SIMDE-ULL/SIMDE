import { OpcodesNames } from './Opcodes';

export class Instruction {
   private _id: number;
   private _basicBlock: number;
   private _opcode: number;
   private _operands: number[];
   private _operandsString: string[];
   private _label: string;
   private _breakPoint: boolean;
   private _color: string;

   constructor() {
      this._breakPoint = false;
      this._color = 'white';
      this._operands = new Array(3);
      this._operandsString = new Array(3);
   }

   copy(other: Instruction) {
      this._id = other.id;
      this._basicBlock = other.basicBlock;
      this._opcode = other.opcode;
      this._operands = other.operands.slice();
      this._operandsString = other.operandsString.slice();
      this._breakPoint = other.breakPoint;
      this._color = other.color;
   }

   toString(): string {
      let aux: string = '';
      if (this._operandsString[1]) {
         aux = ' ' + this._operandsString[1];
      }

      if (this._operandsString[2]) {
         aux = ' ' + this._operandsString[2];
      }
      debugger;
      return '' + OpcodesNames[this._opcode] + ' ' + this._operandsString[0] + aux;
   }

   setOperand(index: number, value: number, valueString: string) {
      this._operands[index] = value;
      this.operandsString[index] = valueString;
   }

   getOperand(index: number): number {
      return this._operands[index];
   }

   public get id(): number {
      return this._id;
   }

   public set id(value: number) {
      this._id = value;
   }

   public get basicBlock(): number {
      return this._basicBlock;
   }

   public set basicBlock(value: number) {
      this._basicBlock = value;
   }

   public set opcode(value: number) {
      this._opcode = value;
   }

   public set breakPoint(value: boolean) {
      this._breakPoint = value;
   }

   public set color(value: string) {
      this._color = value;
   }

   public get opcode(): number {
      return this._opcode;
   }

   public get breakPoint(): boolean {
      return this._breakPoint;
   }

   public get color(): string {
      return this._color;
   }

   public get operands(): number[] {
      return this._operands;
   }

   public set operands(value: number[]) {
      this._operands = value;
   }

   public get label(): string {
      return this._label;
   }

   public set label(value: string) {
      this._label = value;
   }

   public get operandsString(): string[] {
      return this._operandsString;
   }

   public set operandsString(value: string[]) {
      this._operandsString = value;
   }

}
