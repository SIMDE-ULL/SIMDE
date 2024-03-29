export const NEXT_CYCLE = "NEXT_CYCLE";
export const CURRENT_PC = "CURRENT_PC";

export function nextCycle(data) {
	return {
		type: NEXT_CYCLE,
		value: data,
	};
}

export function currentPC(data) {
	return {
		type: CURRENT_PC,
		value: data,
	};
}
