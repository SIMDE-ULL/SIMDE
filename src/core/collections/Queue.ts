export class Queue<T> {

   private _size: number;
   private _elements: T[];
   private _last: number;
   private _first: number;

   constructor(size?: number) {
      if (size) {
         this.size = size + 1;
         this.elements = new Array(size + 1);
         this.elements.fill(null);
      } else {
         this.size = 0;
         this.elements = null;
      }
      this.last = 0;
      this.first = 0;
   }

   public get size(): number {
      return this._size;
   }

   public set size(value: number) {
      this._size = value;
   }

   public get last(): number {
      return this._last;
   }

   public set last(value: number) {
      this._last = value;
   }

   public get first(): number {
      return this._first;
   }

   public set first(value: number) {
      this._first = value;
   }

   public top(): T {
      return this._elements[this.first];
   }

   public isEmpty(): boolean {
      console.log('Empty?', this.first, this.last);
      return this.first === this.last;
   }

   public isFull(): boolean {
      return ((this.last + 1) % this.size === this.first);
   }

   public getCount(): number {
      return (this.last >= this.first) ? (this.last - this.first) : (this.last + this.size - this.first);
   }

   public end(): number {
      return this.last;
   }

   public init(n: number) {
      this.size = n + 1;
      this._elements = new Array(n + 1).fill(null);
      this.first = 0;
      this.last = 0;
   }

   public add(value: T): number {
      if (this.isFull()) {
         return -1;
      }
      let oldLast = this.last;
      this._elements[this.last] = value;
      this.last = (this.last + 1) % this.size;
      return oldLast;

   }

   // Check those return null
   public remove(position?: number): T {
      console.log('remuevo el first', position, this.first, this.last);
      if (position != null) {
         if (position === this.first) {
            return this.removeFirst();
         }
         if ((position >= this.last) || (position < this.first)) {
            return null;
         }
         let element = this._elements[position];
         // TODO: Check if I can do this with some array operations like slice.
         this.last = (this.last > position) ? this.last : this.last + this.size;
         for (let i = position; i < this.last; i++) {
            this._elements[i % this.size] = this._elements[(i + 1) % this.size];
         }
         this._elements[this.first] = null;
         this.last = (this.last - 1) % this.size;
         return element;
      } else {
         return this.removeFirst();
      }
   }

   private removeFirst(): T {
      if (this.isEmpty()) {
         return null;
      }

      let element = this._elements[this.first];
      this._elements[this.first] = null;
      this.first = (this.first + 1) % this.size;
      return element;
   }

   public get elements(): T[] {
      return this._elements;
   }
   public set elements(elements: T[]) {
      this._elements = elements;
   }
}
