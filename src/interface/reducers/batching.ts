import type { Reducer, UnknownAction } from '@reduxjs/toolkit';

interface BatchAction {
    type: 'BATCH_ACTIONS';
    actions: UnknownAction[];
}

export function enableBatching<S>(reducer: Reducer<S>): Reducer<S> {
    return function batchingReducer(state: S | undefined, action: UnknownAction): S {
        if (action.type === 'BATCH_ACTIONS') {
            return (action as unknown as BatchAction).actions.reduce(
                (s, a) => batchingReducer(s, a),
                state as S
            );
        }
        return reducer(state, action);
    };
}
