import { Instruction } from './Instruction';
import { SuperStage } from './SuperescalarEnums';

export class ReorderBufferEntry {

    private _instruction: Instruction;
    private _ready: boolean;
    private _value: number;
    private _destinyRegister: number;
    private _address: number;
    private _superStage: SuperStage;


    public get instruction(): Instruction {
        return this._instruction;
    }

    public set instruction(value: Instruction) {
        this._instruction = value;
    }


    public get ready(): boolean {
        return this._ready;
    }

    public set ready(value: boolean) {
        this._ready = value;
    }


    public get value(): number {
        return this._value;
    }

    public set value(value: number) {
        this._value = value;
    }


    public get destinyRegister(): number {
        return this._destinyRegister;
    }

    public set destinyRegister(value: number) {
        this._destinyRegister = value;
    }


    public get address(): number {
        return this._address;
    }

    public set address(value: number) {
        this._address = value;
    }


    public get superStage(): SuperStage {
        return this._superStage;
    }

    public set superStage(value: SuperStage) {
        this._superStage = value;
    }

}