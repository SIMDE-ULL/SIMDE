export const NEXT_TOTAL_COMMITED = 'NEXT_TOTAL_COMMITED';
export const NEXT_INSTRUCTIONS_COMMITED = 'NEXT_INSTRUCTIONS_COMMITED';

export function nextTotalCommited(data) {
    return {
        type: NEXT_TOTAL_COMMITED,
        value: data
    };
}

export function nextInstructionsCommited(data) {
    return {
        type: NEXT_INSTRUCTIONS_COMMITED,
        value: data
    };
}
