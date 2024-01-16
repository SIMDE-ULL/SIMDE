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
    return unit.getVisualData().map(element => {
        let aux = {
            instruction: { id: '', value: '', color: '' },
            destinyRegister: '',
            value: '',
            address: '',
            superStage: ''
        };
        if (element != null) {
            aux = {
                instruction: { id: '', value: '', color: '' },
                destinyRegister: '' + element.destinyRegister,
                value: '' + element.value,
                address: '' + element.address,
                superStage: stageToString(element.superStage)
            };
            if (element.instruction != null) {
                aux.instruction.id = '' + element.instruction.id;
                aux.instruction.value = element.instruction.toString();
                aux.instruction.color = element.instruction.color;
            }
        }
        return aux;
    });
}

export function colorCell(instructionid, color) {
    return {
        type: COLOR_CELL,
        value: [instructionid, color]
    };
}
