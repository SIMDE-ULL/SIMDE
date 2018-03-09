export const NEXT_CYCLE = 'NEXT_CYCLE';

export function nextCycle(data) {
    return {
        type: NEXT_CYCLE,
        value: data
    };
}
