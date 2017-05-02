export class Register {

   private static REGISTRY_NUMBER: number = 64;

   private _content: number[];
   private _bufferIn: number[];
   private _busy: boolean[];

   constructor() {
      this.busy = new Array(Register.REGISTRY_NUMBER);
      this.content = new Array(Register.REGISTRY_NUMBER);
      this.bufferIn = new Array(Register.REGISTRY_NUMBER);
   }

   public get content(): number[] {
      return this._content;
   }

   public set content(value: number[]) {
      this._content = value;
   }

   public get bufferIn(): number[] {
      return this._bufferIn;
   }

   public set bufferIn(value: number[]) {
      this._bufferIn = value;
   }

   public get busy(): boolean[] {
      return this._busy;
   }

   public set busy(value: boolean[]) {
      this._busy = value;
   }

   public setContent(index: number, value: number, useBuffer: boolean) {
      if (useBuffer) {
         this.bufferIn[index] = value;
         this.busy[index] = true;
      } else {
         this.content[index] = value;
      }
   }

   public getContent(index: number): number {
      return this.content[index];
   }

   public getRegistryNumber() {
      return Register.REGISTRY_NUMBER;
   }

   public setBusy(index: number, value: boolean) {
      this.busy[index] = value;
   }

   public setAllBusy(value: boolean) {
      this.busy.fill(value);
   }

   public setAllContent(value: number) {
      this.content.fill(value);
      this.setAllBusy(false);
   }

   tic() {
      for (let i = 0; i < Register.REGISTRY_NUMBER; i++) {
         if (this.busy[i]) {
            this.busy[i] = false;
            this.content[i] = this.bufferIn[i];
         }
      }
   }
}
