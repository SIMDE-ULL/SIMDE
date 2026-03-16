export function enableBatching(reducer: any) {
    return function batchingReducer(state: any, action: any) {
        switch (action.type) {
            case 'BATCH_ACTIONS':
                return action.actions.reduce(batchingReducer, state);
            default:
                return reducer(state, action);
        }
    };
}
