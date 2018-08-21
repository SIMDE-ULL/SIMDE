import { FunctionalUnit, FunctionalUnitType } from '../../core/Common/FunctionalUnit';
export const HEADER_TABLE_CYCLE = 'HEADER_TABLE_CYCLE';
export const TABLE_CYCLE = 'TABLE_CYCLE';

export function nextVLIWHeaderTableCycle(functionalUnitNumbers: number[]) {
    return {
        type: HEADER_TABLE_CYCLE,
        value: mapVLIWHeaderTable(functionalUnitNumbers)
    };
}

export function nextVLIWExecutionTableCycle(data, functionalUnitNumbers: number[]) {
    return {
        type: TABLE_CYCLE,
        value: data.map(element => mapVLIWTableData(element, functionalUnitNumbers))
    };
}

function mapVLIWHeaderTable(functionalUnitNumbers: number[]): any {
    const functionalUnitAmount = functionalUnitNumbers.reduce((accumulator, current) => accumulator + current);
    console.log(functionalUnitAmount);
    let headers = new Array();

    headers.push({
        extraValue: '#'
    });

    for (let i = 0; i < functionalUnitNumbers.length; i++) {
        for (let j = 0; j < functionalUnitNumbers[i]; j++) {
            headers.push({
                translateKey: functionalUnitTranslateKeys[i],
                extraValue: j
            });
        }
    }
    return headers;
}

function mapVLIWTableData(data, functionalUnitNumbers: number[]): any {

    const functionalUnitAmount = functionalUnitNumbers.reduce((accumulator, current) => accumulator + current);

    let cols = new Array(functionalUnitAmount);
    cols.fill(null);

    for (let i = 0; i < data.getVLIWOperationsNumber(); i++) { // numero de instrucciones cortas en la instrucción larga
        for (let j = 0; j < cols.length; j++) {
            if ((data.getOperation(i).getFunctionalUnitType() === FunctionalUnitType.INTEGERSUM)
                && (data.getOperation(i).getFunctionalUnitIndex() === j)) {

                cols[j] = data.getOperation(i).id;

            } else if ((data.getOperation(i).getFunctionalUnitType() === FunctionalUnitType.INTEGERMULTIPLY)
                && ((data.getOperation(i).getFunctionalUnitIndex() + functionalUnitNumbers[0]) === j)) {

                cols[j] = data.getOperation(i).id;

            } else if ((data.getOperation(i).getFunctionalUnitType() === FunctionalUnitType.FLOATINGSUM)
            && ((data.getOperation(i).getFunctionalUnitIndex() + functionalUnitNumbers[0] + functionalUnitNumbers[1]) === j)) {

                cols[j] = data.getOperation(i).id;

            } else if ((data.getOperation(i).getFunctionalUnitType() === FunctionalUnitType.FLOATINGMULTIPLY)
            && ((data.getOperation(i).getFunctionalUnitIndex() + functionalUnitNumbers[0] + functionalUnitNumbers[1] + functionalUnitNumbers[2]) === j)) {

                cols[j] = data.getOperation(i).id;

            } else if ((data.getOperation(i).getFunctionalUnitType() === FunctionalUnitType.MEMORY)
            && ((data.getOperation(i).getFunctionalUnitIndex() + functionalUnitNumbers[0] +
             functionalUnitNumbers[1] + functionalUnitNumbers[2] + functionalUnitNumbers[3]) === j)) {

                cols[j] = data.getOperation(i).id;

            } else if ((data.getOperation(i).getFunctionalUnitType() === FunctionalUnitType.JUMP)
            && ((data.getOperation(i).getFunctionalUnitIndex() + functionalUnitNumbers[0] + functionalUnitNumbers[1]
            + functionalUnitNumbers[2] + functionalUnitNumbers[3] + functionalUnitNumbers[4]) === j)) {

                cols[j] = data.getOperation(i).id;
            }
        }
    }
    return cols.map(c => c != null ? c : ' ');

    // data.getVLIWOperationsNumber(); numero de operaciones de la instucción larga
    // data.getOperation(0).id; //numero de la operación superescalar
    // data.getOperation(0).getFunctionalUnitType; // tipo de operacion ADDI...
    // data.getOperation(0).getFunctionalUnitIndex; // numero de unidad funcional a la que se asignara
}

const functionalUnitTranslateKeys = {
    0: 'planificator.IntegerAdd',
    1: 'planificator.IntegerMult',
    2: 'planificator.FloatAdd',
    3: 'planificator.FloatMult',
    4: 'planificator.Memory',
    5: 'planificator.Jump'
};
