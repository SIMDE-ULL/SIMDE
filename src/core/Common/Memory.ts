export interface Datum {
	value: number;
	got: boolean;
}

/**
 * Returns an Error when target method is called with
 * a non-positive `address: number` argument.
 */
export const forcePositiveAddresses = (address: number): undefined | Error => {
	if (address < 0) {
		return Error("Negative numbers are invalid as addresses");
	}
};

export class Memory implements Iterable<Datum> {
	private readonly data: Datum[];

	constructor(
		size: number,
		public faultChance = 0.0,
	) {
		// Initialize clean data array with `size` Datum slots.
		this.data = Array.from(Array(size).keys()).map((n) => ({
			value: 0,
			got: true,
		}));
	}

	// Memory iterator
	[Symbol.iterator](): IterableIterator<Datum> {
		return this.data.values();
	}

	/**
	 * Memory size as the amount of datum slots in memory.
	 * @returns memory size as a number.
	 */
	public get size(): number {
		return this.data.length;
	}

	public getFaultyDatum(address: number): Datum | Error {
		const error = forcePositiveAddresses(address);
		if (error) return error;

		const datum = this.data[address];

		const faultOccurred = this.faultChance > Math.random();

		// This will flip 'got' to false if a fault occurred or to true if there was a fault the last time.
		// So effectively, we will evite getting the same fault twice in a row.
		if (faultOccurred || !datum.got) {
			datum.got = !datum.got;
		}

		return { ...datum };
	}

	public setDatum(address: number, value: number): undefined | Error {
		const error = forcePositiveAddresses(address);
		if (error) return error;

		this.data[address] = { ...this.data[address], value };
	}
}
