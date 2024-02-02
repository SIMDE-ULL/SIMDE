import { COLOR_CELL } from "../actions";

const initialState = {
    uuidColors: {},
    IidColors: {}
}

export function ColorReducers(state = initialState, action) {
    switch (action.type) {
        case COLOR_CELL:
            return (state = {
                ...state,
                uuidColors: {
                    ...state.uuidColors,
                    [action.value[0]]: action.value[1]
                }
            });
        default:
            return state;
    }
}