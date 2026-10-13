export enum CommitStatus {
  PIPE_COMMITOK = 0,
  PIPE_COMMITEND,
  PIPE_COMMITMISS,
  PIPE_COMMITNO,
}

export enum PipeStage {
  PIPE_ISSUE = 0,
  PIPE_EXECUTE,
  PIPE_WRITERESULT,
  PIPE_COMMIT,
}

export enum PipelinedStatus {
  PIPE_ENDEXE = -2,
  PIPE_BREAKPOINT = -1,
  PIPE_OK = 0,
}