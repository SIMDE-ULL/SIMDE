export const NEXT_REGISTERS_CYCLE = 'NEXT_REGISTERS_CYCLE';

export function nextRegistersCycle(data: unknown) {
    return {
        type: NEXT_REGISTERS_CYCLE,
        value: data
    };
}
