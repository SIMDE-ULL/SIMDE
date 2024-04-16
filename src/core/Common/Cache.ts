import type { Memory } from "./Memory";

export enum CacheType {
  NO_CACHE = "NO_CACHE",
  RANDOM_CACHE = "RANDOM_CACHE",
  DIRECT_CACHE = "DIRECT_CACHE",
}

export interface Datum {
  value: number;
  got: boolean;
}

export class NoCache {
  constructor(public memory: Memory) {}

  public getFaultyDatum(address: number): Datum | Error {
    const data = this.memory.getData(address);
    if (data instanceof Error) return data;

    return { value: data, got: true };
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

export class DirectCache extends NoCache {
  private readonly blocks_tags: number[];
  private block_size: number;

  constructor(
    memory: Memory,
    private _blocks: number, // number of blocks
    private _size: number
  ) {
    super(memory);

    // Calculate the block size
    this.block_size = Math.floor(_size / _blocks);

    // Initializa the blocks tags to -1
    this.blocks_tags = Array(_blocks).fill(-1);
  }

  public getFaultyDatum(address: number): Datum | Error {
    const data = this.memory.getData(address);

    // get the tag of the address
    const tag = Math.floor(address / this.block_size);

    // check if the tag is in the cache
    const faultOccurred = this.blocks_tags[tag % this._blocks] !== tag;

    // set the tag in the cache
    this.blocks_tags[tag % this._blocks] = tag;

    if (data instanceof Error) return data;
    return { value: data, got: faultOccurred };
  }

  public setDatum(address: number, value: number): undefined | Error {
    // get the tag of the address
    const tag = Math.floor(address / this.block_size);

    // set the tag in the cache
    this.blocks_tags[tag % this._blocks] = tag;

    return this.memory.setData(address, value);
  }
}
