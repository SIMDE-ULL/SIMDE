export const NEXT_JUMP_TABLE_CYCLE = 'NEXT_JUMP_TABLE_CYCLE';

export function nextJumpTableCycle(data: unknown) {
    return {
        type: NEXT_JUMP_TABLE_CYCLE,
        value: data
    };
}