/**
 * Returns an Error when target method is called with
 * a non-positive `address: number` argument.
 */
export const forcePositiveAddresses = (address: number): undefined | Error => {
  if (address < 0) {
    return Error("Negative numbers are invalid as addresses");
  }
};

export class Memory implements Iterable<number> {
  private readonly data: number[];

  constructor(size: number) {
    // Initialize clean data array with `size` Datum slots.
    this.data = Array(size).fill(0);
  }

  // Memory iterator
  [Symbol.iterator](): IterableIterator<number> {
    return this.data.values();
  }

  /**
   * Memory size as the amount of datum slots in memory.
   * @returns memory size as a number.
   */
  public get size(): number {
    return this.data.length;
  }

  public getData(address: number): number | Error {
    const error = forcePositiveAddresses(address);
    if (error) return error;

    return this.data[address];
  }

  public setData(address: number, value: number): undefined | Error {
    const error = forcePositiveAddresses(address);
    if (error) return error;

    this.data[address] = value;
  }
}
