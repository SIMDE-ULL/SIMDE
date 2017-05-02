export class BasicBlock {
   private _lineNumber: number;
   private _id: number;
   private _next: BasicBlock;
   private _successor: SuccessorBlock;

   public get lineNumber(): number {
      return this._lineNumber;
   }

   public set lineNumber(value: number) {
      this._lineNumber = value;
   }

   public get id(): number {
      return this._id;
   }

   public set id(value: number) {
      this._id = value;
   }

   public get next(): BasicBlock {
      return this._next;
   }

   public set next(value: BasicBlock) {
      this._next = value;
   }

   public get successor(): SuccessorBlock {
      return this._successor;
   }

   public set successor(value: SuccessorBlock) {
      this._successor = value;
   }
}

export class SuccessorBlock {
   private _block: BasicBlock;
   private _next: SuccessorBlock;

   public get block(): BasicBlock {
      return this._block;
   }

   public set block(value: BasicBlock) {
      this._block = value;
   }

   public get next(): SuccessorBlock {
      return this._next;
   }

   public set next(value: SuccessorBlock) {
      this._next = value;
   }

}
