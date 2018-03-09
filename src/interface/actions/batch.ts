export function batchActions(...actions) {
    return {
        type: 'BATCH_ACTIONS',
        actions: actions
    };
}
