import { LargeInstruction } from '../LargeInstruction';
import { FunctionalUnit } from '../Common/FunctionalUnit';

export class TCodigoVLIW {
    private _instrucciones: LargeInstruction;
    private _nInst: number;

    TCodigoVLIW() {
        this._instrucciones = NULL;
        this._nInst = 0;
    }

    TCodigoVLIW(n: number) {
        this._instrucciones =  new LargeInstruction[n];
        this._nInst = 0;
    }

    //Getters
    public get inst(): number {
        return _nInst;
    }

    public get predTrue(ind: number): LargeInstruction {
        if((ind < 0) || (ins >= this._nInst)) {
            return NULL;
        }
        return this._instrucciones[ind];
    }

    public get breakPoint(n: number): boolean {
        return _instrucciones[ind].breakPoint();
    }

    //Setters
    public set nInst(n: number) {
        this._instrucciones = new LargeInstruction[n];
        this._nInst = n;
    }

    public set breakPoint(ind: number, b: boolean) {
        this._instrucciones[ind].breakPoint(b);
    }

    addOperacion(ind: number, oper: TOperacionVLIW) {
        this._instrucciones[ind].addOperacion(oper);
    }

    limpiar() {
        this._instrucciones = NULL;
        this._nInst = 0;
    }
}
