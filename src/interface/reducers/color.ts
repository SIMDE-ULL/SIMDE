import { COLOR_CELL } from "../actions";

export const initialState = {
	uidColors: {},
	IidColors: {},
};

export function ColorReducers(state = initialState, action) {
	switch (action.type) {
		case COLOR_CELL:
			return (state = {
				...state,
				uidColors: {
					...state.uidColors,
					[action.value[0]]: action.value[1],
				},
			});
		default:
			return state;
	}
}
