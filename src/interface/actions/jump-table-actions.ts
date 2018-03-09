export const NEXT_JUMP_TABLE_CYCLE = 'NEXT_JUMP_TABLE_CYCLE';

export function nextJumpTableCycle(data) {
    return {
        type: NEXT_JUMP_TABLE_CYCLE,
        value: mapJumpTableData(data)
    };
}

export function mapJumpTableData(data) {
    return data.map(datum => changeValue(data));
}

function changeValue(value): string {
    const possibleValues = {
        0: 'F(00)',
        1: 'F(01)',
        2: 'V(10)',
        3: 'V(11)'
    };
    return possibleValues[value];
}
