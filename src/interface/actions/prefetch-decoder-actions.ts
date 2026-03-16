export const NEXT_PREFETCH_CYCLE = 'NEXT_PREFETCH_CYCLE';
export const NEXT_DECODER_CYCLE = 'NEXT_DECODER_CYCLE';

export function nextPrefetchCycle(data: unknown) {
    return {
        type: NEXT_PREFETCH_CYCLE,
        value: data
    };
}

export function nextDecoderCycle(data: unknown) {
    return {
        type: NEXT_DECODER_CYCLE,
        value: data
    };
}