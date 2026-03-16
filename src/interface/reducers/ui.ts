import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

export interface UiState {
    isLoadModalOpen: boolean;
    isAuthorModalOpen: boolean;
    isOptionsModalOpen: boolean;
    isSuperConfigModalOpen: boolean;
    isVliwConfigModalOpen: boolean;
    isSuperscalarLoadContentModalOpen: boolean;
    isVliwLoadContentModalOpen: boolean;
    isBatchModalOpen: boolean;
    isBatchResultsModalOpen: boolean;
    batchResults: number[];
    batchStatsResults: unknown;
}

export const initialState: UiState = {
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

const uiSlice = createSlice({
    name: 'ui',
    initialState,
    reducers: {
        toggleLoadModal(state, action: PayloadAction<boolean>) {
            state.isLoadModalOpen = action.payload;
        },
        toggleAuthorModal(state, action: PayloadAction<boolean>) {
            state.isAuthorModalOpen = action.payload;
        },
        toggleOptionsModal(state, action: PayloadAction<boolean>) {
            state.isOptionsModalOpen = action.payload;
        },
        toggleSuperConfigModal(state, action: PayloadAction<boolean>) {
            state.isSuperConfigModalOpen = action.payload;
        },
        toggleVliwConfigModal(state, action: PayloadAction<boolean>) {
            state.isVliwConfigModalOpen = action.payload;
        },
        toggleBatchModal(state, action: PayloadAction<boolean>) {
            state.isBatchModalOpen = action.payload;
        },
        toggleSuperscalarLoadContentModal(state, action: PayloadAction<boolean>) {
            state.isSuperscalarLoadContentModalOpen = action.payload;
        },
        toggleVliwLoadContentModal(state, action: PayloadAction<boolean>) {
            state.isVliwLoadContentModalOpen = action.payload;
        },
        setCyclesPerReplication(state, action: PayloadAction<number[]>) {
            state.batchResults = action.payload;
        },
        displayBatchResults(state, action: PayloadAction<unknown>) {
            state.isBatchResultsModalOpen = true;
            state.batchStatsResults = action.payload;
        },
        closeBatchResults(state) {
            state.isBatchResultsModalOpen = false;
            state.batchStatsResults = {};
        },
    }
});

export const {
    toggleLoadModal,
    toggleAuthorModal,
    toggleOptionsModal,
    toggleSuperConfigModal,
    toggleVliwConfigModal,
    toggleBatchModal,
    toggleSuperscalarLoadContentModal,
    toggleVliwLoadContentModal,
    setCyclesPerReplication,
    displayBatchResults,
    closeBatchResults,
} = uiSlice.actions;

export const UiReducers = uiSlice.reducer;
