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
   let toReturn = '';
   switch (index) {
      case 0:
         toReturn = 'ISSUE';
         break;
      case 1:
         toReturn = 'EXECUTE';
         break;
      case 2:
         toReturn = 'WRITE';
         break;
      case 3:
         toReturn = 'COMMIT';
         break;
   }
   return toReturn;
}