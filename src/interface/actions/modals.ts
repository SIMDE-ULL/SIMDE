export const TOGGLE_LOAD_MODAL = 'TOGGLE_LOAD_MODAL';
export const TOGGLE_AUTHOR_MODAL = 'TOGGLE_AUTHOR_MODAL';
export const TOGGLE_INTERVAL_MODAL = 'TOGGLE_INTERVAL_MODAL';
export const TOGGLE_OPTIONS_MODAL = 'TOGGLE_OPTIONS_MODAL';
export const TOGGLE_SUPER_CONFIG_MODAL = 'TOGGLE_SUPER_CONFIG_MODAL';


export function toggleLoadModal(value) {
    return {
      type: TOGGLE_LOAD_MODAL,
      value: value
    }
}

export function toggleAuthorModal(value) {
  return {
    type: TOGGLE_AUTHOR_MODAL,
    value: value
  }
}

export function toggleIntervalModal(value) {
  return {
    type: TOGGLE_INTERVAL_MODAL,
    value: value
  }
}

export function toggleOptionsModal(value) {
  return {
    type: TOGGLE_OPTIONS_MODAL,
    value: value
  }
}

export function toggleSuperConfigModal(value) {
  return {
    type: TOGGLE_SUPER_CONFIG_MODAL,
    value: value
  }
}