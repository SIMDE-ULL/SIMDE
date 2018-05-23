import { TOperacionVLIW } from './TOperacionVLIW';
import { FunctionalUnit } from '../Common/FunctionalUnit';

export class LargeInstruction {

    private _operations: TOperacionVLIW[];
    private _breakPoint: boolean;

    constructor() {
        this._breakPoint = false;
    }

    public get operation(index: number): TOperacionVLIW {
        return this._operations[index];
    }

    public get nOper(): number {
        return this._operations.length();
    }

    public set breakPoint(value: boolean) {
        this._breakPoint = value;
    }

    public get breakPoint(): boolean {
        return this._breakPoint;
    }

    addOperation(operation: TOperationVLIW) {
        this._operations.push(operation);
    }
}
