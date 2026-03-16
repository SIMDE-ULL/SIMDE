import type { Instruction } from "../Common/Instruction";

export interface PrefetchUnitVisualEntry {
  id: number;
  value: string;
  uid: number;
}

export class PrefetchUnit {
  private _entries: Instruction[] = [];

  public get size() {
    return this._size;
  }

  public get usage() {
    return this._entries.length / this._size;
  }

  constructor(private _size: number) {}

  public isFull() {
    return this._entries.length >= this._size;
  }

  public isEmpty() {
    return this._entries.length === 0;
  }

  public hasBreakpoint() {
    return this._entries.some((entry) => entry.breakPoint);
  }

  public add(instruction: Instruction) {
    this._entries.push(instruction);
  }

  public get(): Instruction {
    const entry = this._entries.shift();
    if (entry === undefined) {
      throw new Error("PrefetchUnit is empty, cannot get instruction");
    }
    return entry;
  }

  public getId(): number {
    return this._entries[0].id;
  }

  public getVisualData(): PrefetchUnitVisualEntry[] {
    return this._entries.map((inst) => {
      return { id: inst.id, value: inst.toString(), uid: inst.uid };
    });
  }
}
