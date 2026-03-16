export function batchActions(...actions: unknown[]) {
  return {
    type: "BATCH_ACTIONS",
    actions: actions,
  };
}
