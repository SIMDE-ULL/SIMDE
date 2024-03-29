export function generateIntervalFromImput(
	input: string,
	max: number,
): number[] {
	const newInterval = new Set<number>();

	if (!input) {
		throw new Error("noEmptyInput");
	}

	input.split(",").map((value: string) => {
		if (value.includes("-")) {
			const range = value.split("-");

			let num1 = Number.parseInt(range[0]);
			let num2 = Number.parseInt(range[1]);

			if (isNaN(num1) || isNaN(num2)) {
				throw new Error("noInputNumber");
			}

			if (num1 >= max || num2 >= max) {
				throw new Error(`inputOutOfRange`);
			}

			if (num1 >= max) {
				num1 = max - 1;
			}
			if (num2 >= max) {
				num2 = max - 1;
			}
			if (num1 < num2) {
				for (; num1 <= num2; num1++) {
					newInterval.add(num1);
				}
			} else {
				for (; num2 <= num1; num2++) {
					newInterval.add(num2);
				}
			}
		} else {
			const num = Number.parseInt(value);

			if (isNaN(num)) {
				throw new Error("noInputNumber");
			}

			if (num >= max) {
				throw new Error(`inputOutOfRange`);
			}

			newInterval.add(num);
		}
	});

	return Array.from(newInterval);
}

export function generateRangeArray(size) {
	if (size < 0) {
		throw new Error("Invalid array range");
	}

	const range = [];
	for (let i = 0; i < size; i++) {
		range.push(i);
	}

	return range;
}
