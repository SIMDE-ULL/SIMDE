import { a } from "vitest/dist/suite-a18diDsI.js";
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

export abstract class Cache {
  public abstract success: boolean;
  public abstract handler: ProxyHandler<Memory>;
}

export class RandomCache extends Cache {
  public success = true;
  public handler: ProxyHandler<Memory>;
  constructor(public faultChance: number) {
    super();

    this.handler = {
      get: this.get.bind(this),
    };
  }

  public get(target: Memory, prop: string | symbol, receiver: object) {
    if (prop === "getData") {
      this.success = this.faultChance < Math.random();
    }

    return Reflect.get(target, prop, receiver);
  }
}

export class DirectCache extends Cache {
  public success = true;
  public handler: ProxyHandler<Memory>;
  private readonly blocks_tags: number[];
  private block_size: number;

  constructor(
    private _blocks: number, // number of blocks
    private _size: number,
  ) {
    super();

    // Calculate the block size
    this.block_size = Math.floor(_size / _blocks);

    // Initializa the blocks tags to -1
    this.blocks_tags = Array(_blocks).fill(-1);

    this.handler = {
      get: this.get.bind(this),
    };
  }

  public get(target: Memory, prop: string | symbol, receiver: object) {
    if (prop === "getData") {
      //this.success = this.faultChance < Math.random();
      const funcHandler = {
        apply: (target, thisArg: any, args: any[]) => {
          const address = args[0];
          const data = Reflect.apply(target, thisArg, args);

          // get the tag of the address
          const tag = Math.floor(address / this.block_size);

          // check if the tag is in the cache
          const faultOccurred = this.blocks_tags[tag % this._blocks] !== tag;
          this.success = !faultOccurred;

          // set the tag in the cache
          this.blocks_tags[tag % this._blocks] = tag;

          return data;
        }
      };
      return new Proxy(Reflect.get(target, prop, receiver), funcHandler);
    }

    return Reflect.get(target, prop, receiver);
  }

  /*public getFaultyDatum(address: number): Datum | Error {
    const data = this.memory.getData(address);

    // get the tag of the address
    const tag = Math.floor(address / this.block_size);

    // check if the tag is in the cache
    const faultOccurred = this.blocks_tags[tag % this._blocks] !== tag;

    // set the tag in the cache
    this.blocks_tags[tag % this._blocks] = tag;

    if (data instanceof Error) return data;
    return { value: data, got: !faultOccurred };
  }

  public setDatum(address: number, value: number): undefined | Error {
    // get the tag of the address
    const tag = Math.floor(address / this.block_size);

    // set the tag in the cache
    this.blocks_tags[tag % this._blocks] = tag;

    return this.memory.setData(address, value);
  }*/
}

export function createCache(
  cacheType: CacheType,
  ...args: number[]
): RandomCache | DirectCache | null {
  switch (cacheType) {
    case CacheType.NO_CACHE:
    return null;
    case CacheType.RANDOM_CACHE:
      return new RandomCache(args[2]);
    case CacheType.DIRECT_CACHE:
      return new DirectCache(args[0], args[1]);
    default:
      throw new Error("Invalid cache type");
  }
}
