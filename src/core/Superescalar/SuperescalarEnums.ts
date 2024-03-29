export enum CommitStatus {
  SUPER_COMMITOK = 0,
  SUPER_COMMITEND = 1,
  SUPER_COMMITMISS = 2,
  SUPER_COMMITNO = 3,
}

export enum SuperStage {
  SUPER_ISSUE = 0,
  SUPER_EXECUTE = 1,
  SUPER_WRITERESULT = 2,
  SUPER_COMMIT = 3,
}

export enum SuperescalarStatus {
  SUPER_ENDEXE = -2,
  SUPER_BREAKPOINT = -1,
  SUPER_OK = 0,
}

export function stageToString(index: number): string {
  const stages = {
    0: "ISSUE",
    1: "EXECUTE",
    2: "WRITE",
    3: "COMMIT",
  };
  return stages[index];
}
