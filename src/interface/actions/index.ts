export const NEXT_PREFETCH_CYCLE = 'NEXT_PREFETCH_CYCLE';
export const NEXT_DECODER_CYCLE = 'NEXT_DECODER_CYCLE';

export function nextPrefetchCycle(data) {
    return {
      type: NEXT_PREFETCH_CYCLE,
      value: mapPrefetchDecoderData(data)
    }
}

export function nextDecoderCycle(data) {
    return {
      type: NEXT_DECODER_CYCLE,
      value: mapPrefetchDecoderData(data)
    }
}

export function mapPrefetchDecoderData(data) {
    let toReturn = new Array(data.elements.length - 1);
    toReturn.fill(' ');
    for (let i = data.first, j = 0; i !== data.last; i = data.nextIterator(i), j++) {
        toReturn[j] = ((data.getElement(i) != null) ? data.getElement(i).instruction.id : '0');
    }
    return toReturn;
}