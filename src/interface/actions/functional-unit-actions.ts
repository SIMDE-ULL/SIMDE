import { FunctionalUntitVisualEntry } from "../../core/Common/FunctionalUnit";

export const FUNCTIONAL_UNIT_CYCLE = 'FUNCTIONAL_UNIT_CYCLE';

export function nextFunctionalUnitCycle(data: unknown[][]) {
    return {
        type: FUNCTIONAL_UNIT_CYCLE,
        value: data.map(element => mapFunctionalUnitData(element))
    };
}
function mapFunctionalUnitData(data: unknown[]): { content: unknown[]; header: string[] } {
    let toReturnObject: { content: unknown[]; header: string[] } = {
        content: [],
        header: []
    };
    let content: unknown[] = [];
    if (data != null && data[0] != null) {
        let aux: unknown[] = [];
        for (let j = 0; j < data.length; j++) {
            let instrsEntries: FunctionalUntitVisualEntry[] = (data[j] as { getVisualData(): FunctionalUntitVisualEntry[] }).getVisualData();

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

function generateFunctionalUnitHeader(data: unknown[]): string[] {
    let toReturn: string[] = [];
    if (data != null) {
        for (let i = 0; i < data.length; i++) {
            toReturn.push(`#${i}`);
        }
    }
    return toReturn;
}
