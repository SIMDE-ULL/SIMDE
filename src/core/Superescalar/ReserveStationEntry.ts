import { Instruction } from '../Common/Instruction';

export class ReserveStationEntry {
    private _instruction: Instruction;
    private _Qj: number;
    private _Qk: number;
    private _Vj: number;
    private _Vk: number;
    private _A: number;
    private _ROB: number;
    private _FUNum: number;
    private _FUPos: number;
    private _FUIsAddALU: boolean;

    public get instruction(): Instruction {
        return this._instruction;
    }

    public set instruction(value: Instruction) {
        this._instruction = value;
    }

    public get Qj(): number {
        return this._Qj;
    }

    public set Qj(value: number) {
        this._Qj = value;
    }

    public get Qk(): number {
        return this._Qk;
    }

    public set Qk(value: number) {
        this._Qk = value;
    }

    public get Vj(): number {
        return this._Vj;
    }

    public set Vj(value: number) {
        this._Vj = value;
    }

    public get Vk(): number {
        return this._Vk;
    }

    public set Vk(value: number) {
        this._Vk = value;
    }

    public get A(): number {
        return this._A;
    }

    public set A(value: number) {
        this._A = value;
    }

    public get ROB(): number {
        return this._ROB;
    }

    public set ROB(value: number) {
        this._ROB = value;
    }

    public get FUNum(): number {
        return this._FUNum;
    }

    public set FUNum(value: number) {
        this._FUNum = value;
    }

    public get FUPos(): number {
        return this._FUPos;
    }

    public set FUPos(value: number) {
        this._FUPos = value;
    }

    public get FUIsAddALU(): boolean {
        return this._FUIsAddALU;
    }

    public set FUIsAddALU(value: boolean) {
        this._FUIsAddALU = value;
    }

}
