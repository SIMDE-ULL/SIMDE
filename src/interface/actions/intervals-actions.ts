
export const ADD_MEMORY_INTERVAL = 'ADD_MEMORY_INTERVAL';
export const REMOVE_MEMORY_INTERVAL = 'REMOVE_MEMORY_INTERVAL';
export const ADD_GENERAL_REGISTERS_INTERVAL = 'ADD_GENERAL_REGISTERS_INTERVAL';
export const REMOVE_GENERAL_REGISTERS_INTERVAL =
    'REMOVE_GENERAL_REGISTERS_INTERVAL';
export const ADD_FLOATING_REGISTERS_INTERVAL =
    'ADD_FLOATING_REGISTERS_INTERVAL';
export const REMOVE_FLOATING_REGISTERS_INTERVAL =
    'REMOVE_FLOATING_REGISTERS_INTERVAL';


export function addMemoryInterval(data: number[]) {
    return {
        type: ADD_MEMORY_INTERVAL,
        value: data
    };
}

export function addGeneralRegistersInterval(data: number[]) {
    return {
        type: ADD_GENERAL_REGISTERS_INTERVAL,
        value: data
    };
}

export function addFloatingRegistersInterval(data: number[]) {
    return {
        type: ADD_FLOATING_REGISTERS_INTERVAL,
        value: data
    };
}

export function removeMemoryInterval(data: number[]) {
    return {
        type: REMOVE_MEMORY_INTERVAL,
        value: new Set(data)
    };
}

export function removeGeneralRegistersInterval(data: number[]) {
    return {
        type: REMOVE_GENERAL_REGISTERS_INTERVAL,
        value: new Set(data)
    };
}

export function removeFloatingRegistersInterval(data: number[]) {
    return {
        type: REMOVE_FLOATING_REGISTERS_INTERVAL,
        value: new Set(data)
    };
}
