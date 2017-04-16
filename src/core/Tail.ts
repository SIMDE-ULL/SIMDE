export class Tail {

    private _size: number;
    private _elements: any;
    private _last: number;
    private _first: number;

    constructor() {
    }


    public get size(): number {
        return this._size;
    }

    public set size(value: number) {
        this._size = value;
    }


    public get elements(): any {
        return this._elements;
    }

    public set elements(value: any) {
        this._elements = value;
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

    public top() {
        return this.elements[this.first];
    }

    public isEmpty(): boolean {
        return this.first === this.last;
    }

    public isFull(): boolean {
        return ((this.last + 1) % this.size == this.first);
    }

    public getCount(): number {
        return (this.last >= this.first) ? (this.last - this.first) : (this.last + this.size - this.first);
    }

    public end() {
        return this.last;
    }

    public init(n: number) {
        this.size = n + 1;
        this.elements = new Array(n + 1).fill(null);
        this.first = 0;
        this.last = 0;
    }

    public add(object: any): number {
        if (this.isFull) {
            return -1;
        }
        let oldLast = this.last;
        this.elements[this.last] = object;
        this.last = (this.last + 1) % this.size;
        return oldLast;

    }

    //Check those return null
    public remove(position?: number): any {
        if (position != null) {
            if (position === this.first) {
                return this.removeFirst();
            }
            if (this.last > this.first) {
                if ((position >= this.last) || (position < this.first)) {
                    return null;
                }
            } else {
                if ((position >= this.last) || (position < this.first)) {
                    return null;
                }
            }
            let element = this.elements[position];
            // TODO: Check if I can do this with some array operations like slice.
            this.last = (this.last > position) ? this.last : this.last + this.size;
            for (let i = position; i < this.last; i++) {
                this.elements[i % this.size] = this.elements[(i + 1) % this.size];
            }
            this.elements[this.first] = null;
            this.last = (this.last - 1) % this.size;
            return element;
        } else {
            return this.removeFirst();
        }
    }

    private removeFirst(): any {
        if (this.isEmpty()) {
            return null;
        }

        let element = this.elements[this.first];
        this.elements[this.first] = null;
        this.first = (this.first + 1) % this.size;
        return element;
    }
}