export const ADD_ROB_FPR_INTERVAL = 'ADD_ROB_FPR_INTERVAL';
export const ADD_ROB_GPR_INTERVAL = 'ADD_ROB_GPR_INTERVAL';
export const REMOVE_ROB_FPR_INTERVAL = 'REMOVE_ROB_FPR_INTERVAL';
export const REMOVE_ROB_GPR_INTERVAL = 'REMOVE_ROB_GPR_INTERVAL';

export function addRobFprInterval(data) {
    return {
      type: ADD_ROB_FPR_INTERVAL,
      value: data
    }
}

export function addRobGprInterval(data) {
    return {
      type: ADD_ROB_GPR_INTERVAL,
      value: data
    }
}

export function removeRobFprInterval(data) {
    return {
      type: REMOVE_ROB_FPR_INTERVAL,
      value: new Set(data)
    }
}

export function removeRobGprInterval(data) {
    return {
      type: REMOVE_ROB_GPR_INTERVAL,
      value: new Set(data)
    }
}
