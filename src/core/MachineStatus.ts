export class MachineStatus {
   private _cycle: number;
   private _executing: boolean;
   private _breakPoint: boolean;


   constructor() {
   }


   public get cycle(): number {
      return this._cycle;
   }

   public set cycle(value: number) {
      this._cycle = value;
   }


   public get executing(): boolean {
      return this._executing;
   }

   public set executing(value: boolean) {
      this._executing = value;
   }


   public get breakPoint(): boolean {
      return this._breakPoint;
   }

   public set breakPoint(value: boolean) {
      this._breakPoint = value;
   }

}