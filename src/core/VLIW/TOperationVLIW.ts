import { Instruction } from '../Common/Instruction';

export class TOperacionVLIW extends Instruction {

    private _tipoUF: TTipoUF;
    private _numUF: number;
    private _pred: number;
    private _predTrue: number;
    private _predFalse: number;

    constructor() {
        super();
        this._pred = 0;
        this._predTrue = 0;
        this._predFalse = 0;
    }

    TOperacionVLIW(operation : TOperacionVLIW) {
        super(operation);
        this._tipoUF = operation._tipoUF;
        this._numUF = operation._numUF;
        this._pred = operation._pred;
        this._predTrue = operation._predTrue;
        this._predFalse = operation._predFalse;
    }

    TOperacionVLIW(inst : TInstruction , t: TTipoUF, number n) {
        super(inst);
        this._tipoUF = t;
        this._numUF = n;
        this._pred = 0;
        this._predTrue = 0;
        this._predFalse = 0;
    }

    //Getters
    public getTipoUF(): TTipoUF {
        return _tipoUF;
    }

    public getNumUF(): number {
        return _numUF;
    }

    public getPred(): number {
        return _pred;
    }

    public getPredTrue(): number {
        return _predTrue;
    }

    public getPredFalse(): number {
        return _predFalse;
    }

    // Setters
    public setTipoUF(t: TTipoUF) {
        this._tipoUF = t;
    }

    public setNumUF(n: number) {
        this._numUF = n;
    }

    public setPred(p: number) {
        this._pred = p;
    }

    public setPredTrue(p: number) {
        this._predTrue = p;
    }

    public setPredFalse() {
        this._predFalse = p;
    }

}
