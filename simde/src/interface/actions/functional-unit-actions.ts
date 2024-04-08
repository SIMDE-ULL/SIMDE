import { FunctionalUntitVisualEntry } from "../../core/Common/FunctionalUnit";

export const FUNCTIONAL_UNIT_CYCLE = 'FUNCTIONAL_UNIT_CYCLE';

export function nextFunctionalUnitCycle(data) {
    return {
        type: FUNCTIONAL_UNIT_CYCLE,
        value: data.map(element => mapFunctionalUnitData(element))
    };
}
function mapFunctionalUnitData(data): any {
    let toReturnObject = {
        content: [],
        header: []
    };
    let content = new Array();
    if (data != null && data[0] != null) {
        let aux = [];
        for (let j = 0; j < data.length; j++) {
            let instrsEntries: FunctionalUntitVisualEntry[] = data[j].getVisualData();

            for (let entry of instrsEntries) {
                if (entry.id !== -1) {
                    aux.push({
                        id: entry.id,
                        value: entry.value,
                        uid: entry.uid,
                        color: ''
                    });
                } else {
                    aux.push({
                        id: '-',
                        value: '',
                        uid: -1,
                        color: ''
                    });
                }
            }
        }
        content.push(aux);

    }
    toReturnObject.content = content;
    toReturnObject.header = generateFunctionalUnitHeader(data);
    return toReturnObject;
}

function generateFunctionalUnitHeader(data): string[] {
    let toReturn = [];
    if (data != null) {
        for (let i = 0; i < data.length; i++) {
            toReturn.push(`#${i}`);
        }
    }
    return toReturn;
}
