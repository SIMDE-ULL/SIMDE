import { VLIWOperation } from './VLIWOperation';

export class LargeInstruction {

    private _operations: VLIWOperation[];
    private _breakPoint: boolean;

    constructor() {
        this._operations = [];
        this._breakPoint = false;
    }

    get operations(): VLIWOperation[] {
        return this._operations;
    }

    public getOperation(index: number): VLIWOperation {
        if (index > this._operations.length) {
            throw new Error('Index out of bounds at operations');
        }
        return this._operations[index];
    }

    public getVLIWOperationsNumber(): number {
        return this._operations.length;
    }

    public setBreakPoint(value: boolean) {
        this._breakPoint = value;
    }

    public getBreakPoint(): boolean {
        return this._breakPoint;
    }

    addOperation(operation: VLIWOperation) {
        this._operations.push(operation);
    }
}
