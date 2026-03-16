export const NEXT_REORDER_BUFFER_MAPPER_CYCLE = 'NEXT_REORDER_BUFFER_MAPPER_CYCLE';

export function nextReorderBufferMapperCycle(data: unknown) {
    return {
        type: NEXT_REORDER_BUFFER_MAPPER_CYCLE,
        value: data
    };
}
