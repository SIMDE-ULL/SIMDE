export const NEXT_JUMP_TABLE_CYCLE = 'NEXT_JUMP_TABLE_CYCLE';

export function nextJumpTableCycle(data) {
    return {
      type: NEXT_JUMP_TABLE_CYCLE,
      value: mapJumpTableData(data)
    }
}

export function mapJumpTableData(data) {
    let toReturn = [];
    for (let i = 0; i < data.length; i++) {
        toReturn.push(changeValue(data[i]));
    }
    return toReturn;
}

function changeValue(value): string {
    let valueToShow;
    switch (value) {
       case 0:
          valueToShow = 'F(00)';
          break;
       case 1:
          valueToShow = 'F(01)';
          break;
       case 2:
          valueToShow = 'V(10)';
          break;
       case 3:
          valueToShow = 'V(11)';
          break;
    }
    return valueToShow;
 }