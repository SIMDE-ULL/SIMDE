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
            let instrIds = data[j].getVisualIds();

            for (let id of instrIds) {
                if (id !== -1) {
                    aux.push({
                        id: data[j].getInstruction(id).id,
                        value: data[j].getInstruction(id).toString(),
                        color: data[j].getInstruction(id).color
                    });
                } else {
                    aux.push({
                        id: '-',
                        value: '',
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
