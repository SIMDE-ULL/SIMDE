import type { ReorderBuffer } from "../../core/Superscalar/ReorderBuffer";
import { colorCell as _colorCell } from "../reducers/color";
import { nextReorderBufferCycle as _nextReorderBufferCycle } from "../reducers/machine";

export function nextReorderBufferCycle(data: ReorderBuffer) {
  return _nextReorderBufferCycle(mapReorderBufferData(data));
}

export function mapReorderBufferData(unit: ReorderBuffer) {
  return unit.getVisualData();
}

export function colorCell(instructionUid: number, color: string) {
  return _colorCell([instructionUid, color]);
}
