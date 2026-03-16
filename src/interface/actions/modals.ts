export const TOGGLE_LOAD_MODAL = 'TOGGLE_LOAD_MODAL';
export const TOGGLE_AUTHOR_MODAL = 'TOGGLE_AUTHOR_MODAL';
export const TOGGLE_OPTIONS_MODAL = 'TOGGLE_OPTIONS_MODAL';
export const TOGGLE_SUPER_CONFIG_MODAL = 'TOGGLE_SUPER_CONFIG_MODAL';
export const TOGGLE_VLIW_CONFIG_MODAL = 'TOGGLE_VLIW_CONFIG_MODAL';
export const TOGGLE_BATCH_MODAL = 'TOGGLE_BATCH_MODAL';
export const TOGGLE_SUPERSCALAR_LOAD_CONTENT_MODAL = 'TOGGLE_SUPERSCALAR_LOAD_CONTENT_MODAL';
export const TOGGLE_VLIW_LOAD_CONTENT_MODAL = 'TOGGLE_VLIW_LOAD_CONTENT_MODAL';
export const DISPLAY_BATCH_RESULTS = 'DISPLAY_BATCH_RESULTS';
export const CLOSE_BATCH_RESULTS = 'CLOSE_BATCH_RESULTS';

export function toggleLoadModal(value: boolean) {
    return {
        type: TOGGLE_LOAD_MODAL,
        value: value
    };
}

export function toggleAuthorModal(value: boolean) {
    return {
        type: TOGGLE_AUTHOR_MODAL,
        value: value
    };
}

export function toggleSuperscalarLoadContentModal(value: boolean) {
    return {
        type: TOGGLE_SUPERSCALAR_LOAD_CONTENT_MODAL,
        value: value
    };
}

export function toggleVliwLoadContentModal(value: boolean) {
    return {
        type: TOGGLE_VLIW_LOAD_CONTENT_MODAL,
        value: value
    };
}

export function toggleOptionsModal(value: boolean) {
    return {
        type: TOGGLE_OPTIONS_MODAL,
        value: value
    };
}

export function toggleSuperConfigModal(value: boolean) {
    return {
        type: TOGGLE_SUPER_CONFIG_MODAL,
        value: value
    };
}

export function toggleVliwConfigModal(value: boolean) {
    return {
        type: TOGGLE_VLIW_CONFIG_MODAL,
        value: value
    };
}

export function toggleBatchModal(value: boolean) {
    return {
        type: TOGGLE_BATCH_MODAL,
        value: value
    };
}

export function displayBatchResults(exportStatsResults: unknown) {
    return {
        type: DISPLAY_BATCH_RESULTS,
        value: exportStatsResults
    };
}

export function closeBatchResults() {
    return {
        type: CLOSE_BATCH_RESULTS,
        value: null
    };
}
