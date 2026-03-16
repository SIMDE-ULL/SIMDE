export const SUPERSCALAR_LOAD = 'SUPERSCALAR_LOAD';

export function superscalarLoad(code: unknown) {
    return {
        type: SUPERSCALAR_LOAD,
        value: code
    };
}
