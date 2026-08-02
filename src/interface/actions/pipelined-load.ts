export const PIPELINED_LOAD = 'PIPELINED_LOAD';

export function pipelinedLoad(code) {
    return {
        type: PIPELINED_LOAD,
        value: code
    };
}
