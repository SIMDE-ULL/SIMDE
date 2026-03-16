export const NEXT_REORDER_BUFFER_CYCLE = 'NEXT_REORDER_BUFFER_CYCLE';
export const COLOR_CELL = 'COLOR_CELL';

import { ReorderBuffer } from '../../core/Superscalar/ReorderBuffer';

export function nextReorderBufferCycle(data: ReorderBuffer) {
    return {
        type: NEXT_REORDER_BUFFER_CYCLE,
        value: mapReorderBufferData(data)
    };
}

export function mapReorderBufferData(unit: ReorderBuffer) {
    return unit.getVisualData();
}

export function colorCell(instructionUid: number, color: string) {
    return {
        type: COLOR_CELL,
        value: [instructionUid, color]
    };
}
