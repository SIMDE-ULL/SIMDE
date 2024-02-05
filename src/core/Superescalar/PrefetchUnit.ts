import { Instruction } from "../Common/Instruction";

export interface PrefetchUnitVisualEntry {
  id: number;
  value: string;
  uuid: number;
}

export class PrefetchUnit {
  private _entries: Instruction[] = [];

  public get size() {
    return this._size;
  }

  public get ocupation() {
    return this._entries.length / this._size;
  }

  constructor(private _size: number) {}

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

  public getVisualData(): PrefetchUnitVisualEntry[] {
    return this._entries.map((inst) => {
      return { id: inst.id, value: inst.toString(), uuid: inst.uuid };
    });
  }
}
