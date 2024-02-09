export const NEXT_TOTAL_COMMITED = 'NEXT_TOTAL_COMMITED';
export const NEXT_INSTRUCTIONS_COMMITED = 'NEXT_INSTRUCTIONS_COMMITED';
export const NEXT_UNITS_OCUPATION = 'NEXT_UNITS_OCUPATION';
export const NEXT_STATUSES_COUNT = 'NEXT_STATUSES_COUNT';
export const NEXT_INSTRUCTIONS_STATUSES_AVERAGE_CYCLES = 'NEXT_INSTRUCTIONS_STATUSES_AVERAGE_CYCLES';


export function nextInstructionsStatusesAverageCycles(data) {
    return {
        type: NEXT_INSTRUCTIONS_STATUSES_AVERAGE_CYCLES,
        value: data
    };
}

export function nextStatusesCount(data) {
    return {
        type: NEXT_STATUSES_COUNT,
        value: data
    };
}

export function nextUnitsOcupation(data) {
    return {
        type: NEXT_UNITS_OCUPATION,
        value: data
    };
}

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
