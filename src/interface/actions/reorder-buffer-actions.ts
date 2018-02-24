export const NEXT_REORDER_BUFFER_CYCLE = 'NEXT_REORDER_BUFFER_CYCLE';
import { stageToString } from '../../core/Superescalar/SuperescalarEnums';

export function nextReorderBufferCycle(data) {
    return {
      type: NEXT_REORDER_BUFFER_CYCLE,
      value: mapReorderBufferData(data)
    }
}

export function mapReorderBufferData(data) {
     let toReturn = new Array();
     for (let i = 0; i < data.length; i++) {
        let aux = {
           instruction: { id: '' },
           destinyRegister: '',
           value: '',
           address: '',
           superStage: ''
        };
        if (data[i] != null) {
           aux = {
              instruction: { id: '' },
              destinyRegister: data[i].destinyRegister,
              value: data[i].value,
              address: data[i].address,
              superStage: stageToString(data[i].superStage)
           };
           if (data[i].instruction != null) {
              aux.instruction.id = data[i].instruction.id;
           }
        };
        toReturn.push(aux);
     }
     return toReturn;
}