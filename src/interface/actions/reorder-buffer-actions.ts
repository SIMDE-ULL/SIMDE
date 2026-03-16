import { ReorderBuffer } from '../../core/Superscalar/ReorderBuffer';
import { nextReorderBufferCycle as _nextReorderBufferCycle } from '../reducers/machine';
import { colorCell as _colorCell } from '../reducers/color';

export function nextReorderBufferCycle(data: ReorderBuffer) {
    return _nextReorderBufferCycle(mapReorderBufferData(data));
}

export function mapReorderBufferData(unit: ReorderBuffer) {
    return unit.getVisualData();
}

export function colorCell(instructionUid: number, color: string) {
    return _colorCell([instructionUid, color]);
}
