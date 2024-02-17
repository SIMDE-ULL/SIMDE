import { randomNumber } from '../Utils/Random';

export interface Datum {
    datum: number;
    got: boolean;
}

export class Memory {

    private _data: number[];
    private _fail: boolean[];
    public failProbability: number = 0;
    private _memorySize: number;

    public get data(): number[] {
        return this._data;
    }

    constructor(size: number) {
        this._data = new Array(size);
        this._fail = new Array(size);
        this._memorySize = size;
    }

    public clean() {
        this._data.fill(0);
        this._fail.fill(false);
    }

    public getDatum(address: number): Datum {
        if (address < 0) {
            address = 0;
        }
        let valueToReturn = {
            datum: this.data[address],
            got: true
        };
        let failValue = randomNumber(100);

        // There will be a fail only if there wasn't a previous fail on the same position
        if ((failValue < this.failProbability) && !this._fail[address]) {
            this._fail[address] = true;
            valueToReturn.got = false;
            return valueToReturn;
        }
        this._fail[address] = true;
        return valueToReturn;
    }

    public setDatum(address: number, value: number) {
        if (address < 0) {
            address = 0;
        }
        this.data[address] = value;
    }
}
