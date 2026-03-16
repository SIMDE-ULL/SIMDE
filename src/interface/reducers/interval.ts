import type { initialState } from './machine';

type MachineState = typeof initialState;

export function addInterval(state: MachineState, field: string, interval: number[]): MachineState {

    const currentField = state[field as keyof MachineState] as { visibleRangeValues: number[]; data: unknown[] };
    const newVisibleRangeValues = Array.from(
        new Set([...currentField.visibleRangeValues, ...interval])
    ).sort((a, b) => +a - +b);

    let newState = {
        ...state,
        history : state.history.map((historyEntry: any) => {
            const newHistoryEntry = {
                ...historyEntry
            };
            newHistoryEntry[field] = {
                ...historyEntry[field],
                visibleRangeValues: newVisibleRangeValues
            };
            return newHistoryEntry;
        })
    };
    (newState as any)[field] = {
        ...currentField,
        visibleRangeValues: Array.from(
            new Set([...currentField.visibleRangeValues, ...interval])
        ).sort((a, b) => +a - +b)
    };

    return newState;
}

export function removeInterval(state: MachineState, field: string, interval: Set<number>): MachineState {
    const currentField = state[field as keyof MachineState] as { visibleRangeValues: number[]; data: unknown[] };
    const newVisibleRangeValues = currentField.visibleRangeValues.filter(
        (x: number) => !interval.has(x)
    );
    let newState = {
        ...state,
        history : state.history.map((historyEntry: any) => {
            const newHistoryEntry = {
                ...historyEntry
            };
            newHistoryEntry[field] = {
                ...historyEntry[field],
                visibleRangeValues: newVisibleRangeValues
            };
            return newHistoryEntry;
        })
    };

    (newState as any)[field] = {
        ...currentField,
        visibleRangeValues: currentField.visibleRangeValues.filter(
            (x: number) => !interval.has(x)
        )
    };

    return newState;
}
