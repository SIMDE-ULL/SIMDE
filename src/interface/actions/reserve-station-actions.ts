export const NEXT_RESERVE_STATION_CYCLE = 'NEXT_RESERVE_STATION_CYCLE';

export function nextReserveStationCycle(data) {
    return {
        type: NEXT_RESERVE_STATION_CYCLE,
        value: data.map(element => mapReserveStationEntry(element))
    };
}

function mapReserveStationEntry(content: { data: any, size: number }): any {
    let data = content.data;
    let toReturn = [];
    let i;

    const defaultObject = {
        instruction: { id: '', value: '', color: '' },
        Qj: '',
        Vj: '',
        Qk: '',
        Vk: '',
        A: '',
        ROB: ''
    };
    for (i = 0; i < data.length; i++) {
        let aux = { ...defaultObject };
        if (data[i] != null) {
            aux = {
                instruction: { id: '', value: '', color: '' },
                Qj: data[i].Qj,
                Vj: data[i].Vj,
                Qk: data[i].Qk,
                Vk: data[i].Vk,
                A: data[i].A,
                ROB: data[i].ROB
            };
            if (data[i].instruction != null) {
                aux.instruction.id = data[i].instruction.id;
                aux.instruction.value = data[i].instruction.toString();
                aux.instruction.color = data[i].instruction.color;
            }
        }

        toReturn.push(aux);
    }

    for (let j = i; j < content.size; j++) {
        toReturn.push({ ...defaultObject });
    }
    return toReturn;
}
