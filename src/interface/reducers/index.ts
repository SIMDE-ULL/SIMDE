import { 
    nextPrefetchCycle, 
    NEXT_PREFETCH_CYCLE
} from '../actions'

export const initialState = {
    prefetchUnit : [],
    decoder: []
}

export function SuperescalarReducers(state = initialState, action) {
    switch (action.type) {
        case NEXT_PREFETCH_CYCLE:
            return state = {...state, prefetchUnit : action.value };

        default:
            return state
    }
}