import { BasicBlock } from './Blocks';

export class Label {
    private _name: string;
    private _blocks: BasicBlock;


    public get name(): string {
        return this._name;
    }

    public set name(value: string) {
        this._name = value;
    }


    public get blocks(): BasicBlock {
        return this._blocks;
    }

    public set blocks(value: BasicBlock) {
        this._blocks = value;
    }

}