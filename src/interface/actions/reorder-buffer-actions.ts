export const NEXT_REORDER_BUFFER_CYCLE = 'NEXT_REORDER_BUFFER_CYCLE';
export const COLOR_CELL = 'COLOR_CELL';

import { stageToString } from '../../core/Superescalar/SuperescalarEnums';
import { ReorderBuffer } from '../../core/Superescalar/ReorderBuffer';

export function nextReorderBufferCycle(data) {
    return {
        type: NEXT_REORDER_BUFFER_CYCLE,
        value: mapReorderBufferData(data)
    };
}

export function mapReorderBufferData(unit: ReorderBuffer) {
    return unit.getVisualData();
}

export function colorCell(instructionid, color) {
    return {
        type: COLOR_CELL,
        value: [instructionid, color]
    };
}
