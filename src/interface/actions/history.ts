export const STEP_FORWARD = 'STEP_FORWARD';
export const STEP_BACK = 'STEP_BACK';
export const RESET_HISTORY = 'RESET_HISTORY';

export function stepForward(data) {
    return {
      type: STEP_FORWARD,
      value: 1
    }
}

export function stepBack(data) {
    return {
      type: STEP_BACK,
      value: -1
    }
}
