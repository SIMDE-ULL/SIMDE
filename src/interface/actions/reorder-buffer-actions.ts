export const NEXT_REORDER_BUFFER_CYCLE = 'NEXT_REORDER_BUFFER_CYCLE';
import { stageToString } from '../../core/Superescalar/SuperescalarEnums';
import { ReorderBufferEntry } from '../../core/Superescalar/ReorderBufferEntry';

export function nextReorderBufferCycle(data) {
    return {
        type: NEXT_REORDER_BUFFER_CYCLE,
        value: mapReorderBufferData(data)
    };
}

export function mapReorderBufferData(data: ReorderBufferEntry[]) {
    let toReturn = new Array();
    for (let i = 0; i < data.length; i++) {
        let aux = {
            instruction: { id: '', value: '', color: '' },
            destinyRegister: '',
            value: '',
            address: '',
            superStage: ''
        };
        if (data[i] != null) {
            aux = {
                instruction: { id: '', value: '', color: ''},
                destinyRegister: '' + data[i].destinyRegister,
                value: '' + data[i].value,
                address: '' + data[i].address,
                superStage: stageToString(data[i].superStage)
            };
            if (data[i].instruction != null) {
                aux.instruction.id = '' + data[i].instruction.id;
                aux.instruction.value = data[i].instruction.toString();
                aux.instruction.color = data[i].instruction.color;
            }
        }
        toReturn.push(aux);
    }
    return toReturn;
}
