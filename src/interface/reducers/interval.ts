export function addInterval(state, field, interval) {
	const newVisibleRangeValues = Array.from(
		new Set([...state[field].visibleRangeValues, ...interval]),
	).sort((a, b) => +a - +b);

	const newState = {
		...state,
		history: state.history.map((historyEntry) => {
			const newHistoryEntry = {
				...historyEntry,
			};
			newHistoryEntry[field] = {
				...historyEntry[field],
				visibleRangeValues: newVisibleRangeValues,
			};
			return newHistoryEntry;
		}),
	};
	newState[field] = {
		...state[field],
		visibleRangeValues: Array.from(
			new Set([...state[field].visibleRangeValues, ...interval]),
		).sort((a, b) => +a - +b),
	};

	return newState;
}

export function removeInterval(state, field, interval) {
	const newVisibleRangeValues = state[field].visibleRangeValues.filter(
		(x) => !interval.has(x),
	);
	const newState = {
		...state,
		history: state.history.map((historyEntry) => {
			const newHistoryEntry = {
				...historyEntry,
			};
			newHistoryEntry[field] = {
				...historyEntry[field],
				visibleRangeValues: newVisibleRangeValues,
			};
			return newHistoryEntry;
		}),
	};

	newState[field] = {
		...state[field],
		visibleRangeValues: state[field].visibleRangeValues.filter(
			(x) => !interval.has(x),
		),
	};

	return (state = newState);
}
