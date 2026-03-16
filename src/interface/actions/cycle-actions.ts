export const NEXT_CYCLE = 'NEXT_CYCLE';
export const CURRENT_PC = 'CURRENT_PC';

export function nextCycle(data: number) {
    return {
        type: NEXT_CYCLE,
        value: data
    };
}

export function currentPC(data: number) {
    return {
        type: CURRENT_PC,
        value: data
    };
}
