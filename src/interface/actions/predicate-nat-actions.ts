export const NEXT_NAT_FPR_CYCLE = 'NEXT_NAT_FPR_CYCLE';
export const NEXT_NAT_GPR_CYCLE = 'NEXT_NAT_GPR_CYCLE';
export const NEXT_PREDICATE_CYCLE = 'NEXT_PREDICATE_CYCLE';

export const ADD_NAT_FPR_INTERVAL = 'ADD_NAT_FPR_INTERVAL';
export const ADD_NAT_GPR_INTERVAL = 'ADD_NAT_GPR_INTERVAL';
export const REMOVE_NAT_FPR_INTERVAL = 'REMOVE_NAT_FPR_INTERVAL';
export const REMOVE_NAT_GPR_INTERVAL = 'REMOVE_NAT_GPR_INTERVAL';
export const ADD_PREDICATE_INTERVAL = 'ADD_PREDICATE_INTERVAL';
export const REMOVE_PREDICATE_INTERVAL = 'REMOVE_PREDICATE_INTERVAL';

export function addNatFprInterval(data: number[]) {
    return {
        type: ADD_NAT_FPR_INTERVAL,
        value: data
    };
}

export function addNatGprInterval(data: number[]) {
    return {
        type: ADD_NAT_GPR_INTERVAL,
        value: data
    };
}

export function removeNatFprInterval(data: number[]) {
    return {
        type: REMOVE_NAT_FPR_INTERVAL,
        value: new Set(data)
    };
}

export function removeNatGprInterval(data: number[]) {
    return {
        type: REMOVE_NAT_GPR_INTERVAL,
        value: new Set(data)
    };
}

export function addMemoryInterval(data: number[]) {
    return {
        type: ADD_PREDICATE_INTERVAL,
        value: data
    };
}

export function removeMemoryInterval(data: number[]) {
    return {
        type: REMOVE_PREDICATE_INTERVAL,
        value: new Set(data)
    };
}

export function nextNatFprCycle(data: boolean[]) {
    return {
        type: NEXT_NAT_FPR_CYCLE,
        value: data
    };
}

export function nextNatGprCycle(data: boolean[]) {
    return {
        type: NEXT_NAT_GPR_CYCLE,
        value: data
    };
}

export function nextPredicateCycle(data: boolean[]) {
    return {
        type: NEXT_PREDICATE_CYCLE,
        value: data
    };
}
