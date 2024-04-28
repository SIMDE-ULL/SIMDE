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
  public abstract getHandler: ProxyHandler<typeof Memory.prototype.getData>;
  public abstract setHandler: ProxyHandler<typeof Memory.prototype.setData>;
}

export class RandomCache extends Cache {
  public success = true;
  public getHandler: ProxyHandler<typeof Memory.prototype.getData>;
  public setHandler: ProxyHandler<typeof Memory.prototype.setData> = {};
  constructor(public faultChance: number) {
    super();

    this.getHandler = {
      apply: this.applyToGetData.bind(this),
    };
  }

  public applyToGetData(
    target: typeof Memory.prototype.getData,
    thisArg: any,
    args: any[],
  ) {
    this.success = this.faultChance < Math.random();

    return Reflect.apply(target, thisArg, args);
  }
}

export class DirectCache extends Cache {
  public success = true;
  public getHandler: ProxyHandler<typeof Memory.prototype.getData>;
  public setHandler: ProxyHandler<typeof Memory.prototype.setData>;
  private readonly blocks_tags: number[];
  private block_size: number;

  constructor(
    private _blocks: number, // number of blocks
    _size: number,
  ) {
    super();

    // Calculate the block size
    this.block_size = Math.floor(_size / _blocks);

    // Initializa the blocks tags to -1
    this.blocks_tags = Array(_blocks).fill(-1);

    this.getHandler = {
      apply: this.applyToGetData.bind(this),
    };

    this.setHandler = {
      apply: this.applyToSetData.bind(this),
    };
  }

  public applyToGetData(
    target: typeof Memory.prototype.getData,
    thisArg: any,
    args: any[],
  ) {
    const address = args[0];

    // get the tag of the address
    const tag = Math.floor(address / this.block_size);

    // check if the tag is in the cache
    const faultOccurred = this.blocks_tags[tag % this._blocks] !== tag;
    this.success = !faultOccurred;

    // set the tag in the cache
    this.blocks_tags[tag % this._blocks] = tag;

    return Reflect.apply(target, thisArg, args);
  }

  public applyToSetData(
    target: typeof Memory.prototype.getData,
    thisArg: any,
    args: any[],
  ) {
    const address = args[0];

    // get the tag of the address
    const tag = Math.floor(address / this.block_size);

    // set the tag in the cache
    this.blocks_tags[tag % this._blocks] = tag;

    return Reflect.apply(target, thisArg, args);
  }
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
