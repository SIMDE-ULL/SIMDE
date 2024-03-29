export const NEXT_MEMORY_CYCLE = "NEXT_MEMORY_CYCLE";

export function nextMemoryCycle(data) {
  return {
    type: NEXT_MEMORY_CYCLE,
    value: data,
  };
}
