import { nextReserveStationCycle as _nextReserveStationCycle } from "../reducers/machine";

export function nextReserveStationCycle(data: unknown[]) {
  return _nextReserveStationCycle(
    data.map((element) => mapReserveStationEntry(element)),
  );
}

interface ReserveStationEntry {
  instruction: { id: string; value: string; uid: string } | null;
  Qj: string;
  Vj: string;
  Qk: string;
  Vk: string;
  A: string;
  ROB: string;
}

function mapReserveStationEntry(element: unknown): unknown[] {
  const content = element as {
    data: (ReserveStationEntry | null)[];
    size: number;
  };
  const data = content.data;
  const toReturn = [];
  let i: number;

  const defaultObject = {
    instruction: { id: "", value: "", uid: "" },
    Qj: "",
    Vj: "",
    Qk: "",
    Vk: "",
    A: "",
    ROB: "",
  };
  for (i = 0; i < data.length; i++) {
    let aux = { ...defaultObject };
    const entry = data[i];
    if (entry != null) {
      aux = {
        instruction: { id: "", value: "", uid: "" },
        Qj: entry.Qj,
        Vj: entry.Vj,
        Qk: entry.Qk,
        Vk: entry.Vk,
        A: entry.A,
        ROB: entry.ROB,
      };
      if (entry.instruction != null) {
        aux.instruction.id = entry.instruction.id;
        aux.instruction.value = entry.instruction.value;
        aux.instruction.uid = entry.instruction.uid;
      }
    }

    toReturn.push(aux);
  }

  for (let j = i; j < content.size; j++) {
    toReturn.push({ ...defaultObject });
  }
  return toReturn;
}
