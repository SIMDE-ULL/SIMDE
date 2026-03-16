export {
  nextTotalCommited,
  nextInstructionsCommited,
  nextUnitsUsage,
  nextStatusesCount,
  nextInstructionsStatusesAverageCycles,
} from "../reducers/machine";

import { setCyclesPerReplication as _setCyclesPerReplication } from "../reducers/ui";

export const setCyclesPerReplication = _setCyclesPerReplication;

export function clearCyclesPerReplication() {
  return _setCyclesPerReplication([]);
}
