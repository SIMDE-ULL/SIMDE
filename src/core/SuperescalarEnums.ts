export enum CommitStatus {
   SUPER_COMMITOK = 0,
   SUPER_COMMITEND,
   SUPER_COMMITMISS,
   SUPER_COMMITNO
}

export enum SuperStage {
   SUPER_ISSUE = 0,
   SUPER_EXECUTE,
   SUPER_WRITERESULT,
   SUPER_COMMIT
}

export enum SuperescalarStatus {
   SUPER_ENDEXE = -2,
   SUPER_BREAKPOINT = -1,
   SUPER_OK = 0
}
