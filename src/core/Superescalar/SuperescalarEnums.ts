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

export function stageToString(index: number): string {
    const stages = {
        0: 'ISSUE',
        1: 'EXECUTE',
        2: 'WRITE',
        3: 'COMMIT'
    };
    return stages[index];
}
