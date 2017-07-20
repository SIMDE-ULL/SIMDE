import { Instruction } from '../common/Instruction';

export class DecoderEntry {
    private _instruction: Instruction;

    public get instruction(): Instruction {
        return this._instruction;
    }

    public set instruction(value: Instruction) {
        this._instruction = value;
    }

}
