import { Instruction } from "../Common/Instruction"

export class PrefetchUnit {
    _entries: Instruction[];
    _size: number;

    public get size() {
        return this._size;
    }

    constructor(size: number) {
        this._size = size;
        this._entries = [];
    }

    public clean() {
        this._entries = [];
    }

    public isFull() {
        return this._entries.length >= this._size;
    }

    public isEmpty() {
        return this._entries.length == 0;
    }

    public hasBreakpoint() {
        return this._entries.some((entry) => entry.breakPoint);
    }

    public add(instruction: Instruction) {
        this._entries.push(instruction);
    }

    public get(): Instruction {
        return this._entries.shift();
    }

    public getId(): number {
        return this._entries[0].id;
    }

    public getInstructionsIds(): number[] {
        return this._entries.map((inst) => inst.id);
    }
}