import type { Memory } from "./Memory";

export interface Datum {
  value: number;
  got: boolean;
}

export class NoCache {
  constructor(public memory: Memory) {}

  public getFaultyDatum(address: number): Datum | Error {
    const data = this.memory.getData(address);
    if (data instanceof Error) return data;

    return { value: data, got: false };
  }

  public setDatum(address: number, value: number): undefined | Error {
    return this.memory.setData(address, value);
  }
}

export class RandomCache extends NoCache {
  constructor(
    memory: Memory,
    public faultChance: number,
  ) {
    super(memory);
  }

  public getFaultyDatum(address: number): Datum | Error {
    const data = this.memory.getData(address);
    const faultOccurred = this.faultChance > Math.random();

    if (data instanceof Error) return data;

    return { value: data, got: faultOccurred };
  }

  public setDatum(address: number, value: number): undefined | Error {
    return this.memory.setData(address, value);
  }
}
