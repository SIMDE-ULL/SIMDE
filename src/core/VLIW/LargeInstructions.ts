import { TOperacionVLIW } from './TOperacionVLIW';
import { FunctionalUnit } from '../Common/FunctionalUnit';

export class LargeInstruction {

    private _operations: TOperacionVLIW[];
    private _breakPoint: boolean;

    constructor() {
        this._operations = [];
        this._breakPoint = false;
    }

    public getOperation(index: number): TOperacionVLIW {
        if(index > this._operations.length) {
            throw new Error("Index out of bounds at operations");
        }
        return this._operations[index];
    }

    public getNOper(): number {
        return this._operations.length;
    }

    public setBreakPoint(value: boolean) {
        this._breakPoint = value;
    }

    public getBreakPoint(): boolean {
        return this._breakPoint;
    }

    addOperation(operation: TOperationVLIW) {
        this._operations.push(operation);
    }
}
