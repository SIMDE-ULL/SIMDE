import {
    TOGGLE_LOAD_MODAL,
    TOGGLE_AUTHOR_MODAL,
    TOGGLE_OPTIONS_MODAL,
    TOGGLE_SUPER_CONFIG_MODAL,
    TOGGLE_VLIW_CONFIG_MODAL,
    TOGGLE_SUPERSCALAR_LOAD_CONTENT_MODAL,
    TOGGLE_VLIW_LOAD_CONTENT_MODAL,
    TOGGLE_BATCH_MODAL,
    CLOSE_BATCH_RESULTS,
    DISPLAY_BATCH_RESULTS
} from '../actions/modals';

import {
    SET_CYCLES_PER_REPLICATION
} from '../actions/stats-actions';

export const initialState = {
    isLoadModalOpen: false,
    isAuthorModalOpen: false,
    isOptionsModalOpen: false,
    isSuperConfigModalOpen: false,
    isVliwConfigModalOpen: false,
    isSuperscalarLoadContentModalOpen: false,
    isVliwLoadContentModalOpen: false,
    isBatchModalOpen: false,
    isBatchResultsModalOpen: false,
    batchResults: [],
    batchStatsResults: {}
};

export function UiReducers(state = initialState, action) {
    switch (action.type) {
        case TOGGLE_LOAD_MODAL:
            return (state = {
                ...state,
                isLoadModalOpen: action.value
            });
        case TOGGLE_AUTHOR_MODAL:
            return (state = {
                ...state,
                isAuthorModalOpen: action.value
            });
        case TOGGLE_OPTIONS_MODAL:
            return (state = {
                ...state,
                isOptionsModalOpen: action.value
            });
        case TOGGLE_SUPER_CONFIG_MODAL:
            return (state = {
                ...state,
                isSuperConfigModalOpen: action.value
            });
        case TOGGLE_VLIW_CONFIG_MODAL:
            return (state = {
                ...state,
                isVliwConfigModalOpen: action.value
            });
        case TOGGLE_BATCH_MODAL:
            return (state = {
                ...state,
                isBatchModalOpen: action.value
            });
        case TOGGLE_SUPERSCALAR_LOAD_CONTENT_MODAL:
            return (state = {
                ...state,
                isSuperscalarLoadContentModalOpen: action.value
            });
        case TOGGLE_VLIW_LOAD_CONTENT_MODAL:
            return (state = {
                ...state,
                isVliwLoadContentModalOpen: action.value
            });
        case SET_CYCLES_PER_REPLICATION:
            return (state = {
                ...state,
                batchResults: action.value,
            });
        case DISPLAY_BATCH_RESULTS:
            return (state = {
                ...state,
                isBatchResultsModalOpen: true,
                batchStatsResults: action.value
            });
        case CLOSE_BATCH_RESULTS:
            return (state = {
                ...state,
                isBatchResultsModalOpen: false,
                batchStatsResults: {}
            });

        default: 
            return state;
    }
}