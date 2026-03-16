import type { FunctionalUntitVisualEntry } from "../../core/Common/FunctionalUnit";
import { nextFunctionalUnitCycle as _nextFunctionalUnitCycle } from "../reducers/machine";

export function nextFunctionalUnitCycle(data: unknown[][]) {
  return _nextFunctionalUnitCycle(
    data.map((element) => mapFunctionalUnitData(element)),
  );
}

function mapFunctionalUnitData(data: unknown[]): {
  content: unknown[];
  header: string[];
} {
  const toReturnObject: { content: unknown[]; header: string[] } = {
    content: [],
    header: [],
  };
  const content: unknown[] = [];
  if (data != null && data[0] != null) {
    const aux: unknown[] = [];
    for (let j = 0; j < data.length; j++) {
      const instrsEntries: FunctionalUntitVisualEntry[] = (
        data[j] as { getVisualData(): FunctionalUntitVisualEntry[] }
      ).getVisualData();

      for (const entry of instrsEntries) {
        if (entry.id !== -1) {
          aux.push({
            id: entry.id,
            value: entry.value,
            uid: entry.uid,
            color: "",
          });
        } else {
          aux.push({
            id: "-",
            value: "",
            uid: -1,
            color: "",
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
  const toReturn: string[] = [];
  if (data != null) {
    for (let i = 0; i < data.length; i++) {
      toReturn.push(`#${i}`);
    }
  }
  return toReturn;
}
