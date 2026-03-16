import { FunctionalUnitType } from "../../core/Common/FunctionalUnit";
import {
  nextVliwHeaderTableCycle as _nextVliwHeaderTableCycle,
  nextVliwTableCycle,
} from "../reducers/machine";

export function nextVLIWHeaderTableCycle(functionalUnitNumbers: number[]) {
  return _nextVliwHeaderTableCycle(mapVLIWHeaderTable(functionalUnitNumbers));
}

interface LargeInstructionLike {
  getVLIWOperationsNumber(): number;
  getOperation(i: number): {
    id: number;
    getFunctionalUnitType(): FunctionalUnitType;
    getFunctionalUnitIndex(): number;
  };
}

export function nextVLIWExecutionTableCycle(
  data: LargeInstructionLike[],
  functionalUnitNumbers: number[],
) {
  return nextVliwTableCycle(
    data.map((element) => mapVLIWTableData(element, functionalUnitNumbers)),
  );
}

function mapVLIWHeaderTable(
  functionalUnitNumbers: number[],
): { translateKey?: string; extraValue: string | number }[] {
  const headers: { translateKey?: string; extraValue: string | number }[] = [];

  headers.push({
    extraValue: "#",
  });

  for (let i = 0; i < functionalUnitNumbers.length; i++) {
    for (let j = 0; j < functionalUnitNumbers[i]; j++) {
      headers.push({
        translateKey: functionalUnitTranslateKeys[i],
        extraValue: j,
      });
    }
  }
  return headers;
}

function mapVLIWTableData(
  data: LargeInstructionLike,
  functionalUnitNumbers: number[],
): (number | string)[] {
  const functionalUnitAmount = functionalUnitNumbers.reduce(
    (accumulator, current) => accumulator + current,
  );

  const cols: (number | null)[] = new Array(functionalUnitAmount);
  cols.fill(null);

  for (let i = 0; i < data.getVLIWOperationsNumber(); i++) {
    for (let j = 0; j < cols.length; j++) {
      if (
        data.getOperation(i).getFunctionalUnitType() ===
          FunctionalUnitType.INTEGERSUM &&
        data.getOperation(i).getFunctionalUnitIndex() === j
      ) {
        cols[j] = data.getOperation(i).id;
      } else if (
        data.getOperation(i).getFunctionalUnitType() ===
          FunctionalUnitType.INTEGERMULTIPLY &&
        data.getOperation(i).getFunctionalUnitIndex() +
          functionalUnitNumbers[0] ===
          j
      ) {
        cols[j] = data.getOperation(i).id;
      } else if (
        data.getOperation(i).getFunctionalUnitType() ===
          FunctionalUnitType.FLOATINGSUM &&
        data.getOperation(i).getFunctionalUnitIndex() +
          functionalUnitNumbers[0] +
          functionalUnitNumbers[1] ===
          j
      ) {
        cols[j] = data.getOperation(i).id;
      } else if (
        data.getOperation(i).getFunctionalUnitType() ===
          FunctionalUnitType.FLOATINGMULTIPLY &&
        data.getOperation(i).getFunctionalUnitIndex() +
          functionalUnitNumbers[0] +
          functionalUnitNumbers[1] +
          functionalUnitNumbers[2] ===
          j
      ) {
        cols[j] = data.getOperation(i).id;
      } else if (
        data.getOperation(i).getFunctionalUnitType() ===
          FunctionalUnitType.MEMORY &&
        data.getOperation(i).getFunctionalUnitIndex() +
          functionalUnitNumbers[0] +
          functionalUnitNumbers[1] +
          functionalUnitNumbers[2] +
          functionalUnitNumbers[3] ===
          j
      ) {
        cols[j] = data.getOperation(i).id;
      } else if (
        data.getOperation(i).getFunctionalUnitType() ===
          FunctionalUnitType.JUMP &&
        data.getOperation(i).getFunctionalUnitIndex() +
          functionalUnitNumbers[0] +
          functionalUnitNumbers[1] +
          functionalUnitNumbers[2] +
          functionalUnitNumbers[3] +
          functionalUnitNumbers[4] ===
          j
      ) {
        cols[j] = data.getOperation(i).id;
      }
    }
  }
  return cols.map((c) => (c != null ? c : " "));
}

const functionalUnitTranslateKeys: Record<number, string> = {
  0: "functionalUnits.intAdd",
  1: "functionalUnits.intMult",
  2: "functionalUnits.floatAdd",
  3: "functionalUnits.floatMult",
  4: "functionalUnits.memory",
  5: "functionalUnits.jump",
};
