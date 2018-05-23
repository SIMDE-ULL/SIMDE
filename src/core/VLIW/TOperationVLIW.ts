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

    TOperacionVLIW(oper : TOperacionVLIW) {
        super(oper);
        this._tipoUF = oper._tipoUF;
        this._numUF = oper._numUF;
        this._pred = oper._pred;
        this._predTrue = oper._predTrue;
        this._predFalse = oper_predFalse;
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
    public get tipoUF(): TTipoUF {
        return _tipoUF;
    }

    public get numUF(): number {
        return _numUF;
    }

    public get pred(): number {
        return _pred;
    }

    public get predTrue(): number {
        return _predTrue;
    }

    public get predFalse(): number {
        return _predFalse;
    }

    // Setters
    public set tipoUF(t: TTipoUF) {
        this._tipoUF = t;
    }

    public set numUF(n: number) {
        this._numUF = n;
    }

    public set pred(p: number) {
        this._pred = p;
    }

    public set predTrue(p: number) {
        this._predTrue = p;
    }

    public set predFalse() {
        this._predFalse = p;
    }

}
