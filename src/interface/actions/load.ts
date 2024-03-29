export const SUPERESCALAR_LOAD = "SUPERESCALAR_LOAD";

export function superescalarLoad(code) {
	return {
		type: SUPERESCALAR_LOAD,
		value: code,
	};
}
