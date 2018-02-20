export const NEXT_PREFETCH_CYCLE = 'NEXT_PREFETCH_CYCLE';

export function nextPrefetchCycle(data) {

    let toReturn = new Array(data.elements.length - 1);
    toReturn.fill(' ');
    for (let i = data.first, j = 0; i !== data.last; i = data.nextIterator(i), j++) {
        toReturn[j] = ((data.getElement(i) != null) ? data.getElement(i).instruction.id : '0');
    }
    
    return {
      type: NEXT_PREFETCH_CYCLE,
      value: toReturn
    }
}