import {
    TOGGLE_LOAD_MODAL,
    TOGGLE_AUTHOR_MODAL,
    TOGGLE_OPTIONS_MODAL,
    TOGGLE_SUPER_CONFIG_MODAL,
    TOGGLE_VLIW_CONFIG_MODAL,
    TOGGLE_SUPERESCALAR_LOAD_CONTENT_MODAL,
    TOGGLE_VLIW_LOAD_CONTENT_MODAL,
    TOGGLE_BATCH_MODAL,
    CLEAR_BATCH_RESULTS
} from '../actions/modals';

import {
    SET_CYCLES_PER_REPLICATION
} from '../actions/stats-actions';

const initialState = {
    isLoadModalOpen: false,
    isAuthorModalOpen: false,
    isOptionsModalOpen: false,
    isSuperConfigModalOpen: false,
    isVliwConfigModalOpen: false,
    isSuperescalarLoadContentModalOpen: false,
    isVliwLoadContentModalOpen: false,
    isBatchModalOpen: false,
    isBatchResultsModalOpen: false,
    batchResults: []
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
        case TOGGLE_SUPERESCALAR_LOAD_CONTENT_MODAL:
            return (state = {
                ...state,
                isSuperescalarLoadContentModalOpen: action.value
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
                isBatchResultsModalOpen: true
            });
        case CLEAR_BATCH_RESULTS:
            return (state = {
                ...state,
                batchResults: [],
                isBatchResultsModalOpen: false
            });

        default: 
            return state;
    }
}