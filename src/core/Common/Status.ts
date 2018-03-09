export class Status {
    private _instructionNumber: number;
    private _lastInstruction: number;
    private _stall: number;

    public get instructionNumber(): number {
        return this._instructionNumber;
    }

    public set instructionNumber(value: number) {
        this._instructionNumber = value;
    }

    public get lastInstruction(): number {
        return this._lastInstruction;
    }

    public set lastInstruction(value: number) {
        this._lastInstruction = value;
    }

    public get stall(): number {
        return this._stall;
    }

    public set stall(value: number) {
        this._stall = value;
    }

}
