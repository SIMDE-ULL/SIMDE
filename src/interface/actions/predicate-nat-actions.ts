import {
    addPredicateInterval as _addPredicateInterval,
    removePredicateInterval as _removePredicateInterval,
} from '../reducers/machine';

export {
    addNatFprInterval,
    addNatGprInterval,
    removeNatFprInterval,
    removeNatGprInterval,
    nextNatFprCycle,
    nextNatGprCycle,
    nextPredicateCycle,
} from '../reducers/machine';

export const addPredicateInterval = _addPredicateInterval;
export const removePredicateInterval = _removePredicateInterval;
