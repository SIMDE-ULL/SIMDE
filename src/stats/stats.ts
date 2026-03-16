export interface InstructionStatsEntry {
  instructionId: number;

  prefetchCycles: number;
  decodeCycles: number;
  issueCycles: number;
  executeCycles: number;
  writeBackCycles: number;
  commited: boolean;
}

interface StatusesStats {
  prefetchNumber: number;
  decodeNumber: number;
  issueNumber: number;
  executeNumber: number;
  writeBackNumber: number;
  commitNumber: number;
}

export class Stats {
  private _instrEntries: Map<number, InstructionStatsEntry> = new Map();
  private _statusesAtCycle: Map<number, StatusesStats> = new Map();
  private _unitUsageAtCycle: Map<string, Map<number, number>> = new Map();
  private _currentCycle = 0;

  public collectMultipleUnitUsage(unitName: string, usages: number[]) {
    const usage = usages.reduce((acc, val) => acc + val, 0) / usages.length;
    this.collectUnitUsage(unitName, usage);
  }

  public collectUnitUsage(unitName: string, usage: number) {
    if (!this._unitUsageAtCycle.has(unitName)) {
      this._unitUsageAtCycle.set(unitName, new Map());
    }

    this._unitUsageAtCycle.get(unitName)?.set(this._currentCycle, usage);
  }

  public collectDecodeUids(uids: number[]) {
    for (const uid of uids) {
      this.createEntryIfNotExists(uid);
      this.getEntry(uid).decodeCycles++;
    }

    this.createStatusesIfNotExists();
    this.getStatusesAtCurrentCycle().decodeNumber += uids.length;
  }

  public collectPrefetchUids(uids: number[]) {
    for (const uid of uids) {
      this.createEntryIfNotExists(uid);
      this.getEntry(uid).prefetchCycles++;
    }

    this.createStatusesIfNotExists();
    this.getStatusesAtCurrentCycle().prefetchNumber += uids.length;
  }

  public collectIssuedUids(uids: number[]) {
    for (const uid of uids) {
      this.createEntryIfNotExists(uid);
      this.getEntry(uid).issueCycles++;
    }

    this.createStatusesIfNotExists();
    this.getStatusesAtCurrentCycle().issueNumber += uids.length;
  }

  public collectExecutingUids(uids: number[]) {
    for (const uid of uids) {
      this.createEntryIfNotExists(uid);
      this.getEntry(uid).executeCycles++;
    }

    this.createStatusesIfNotExists();
    this.getStatusesAtCurrentCycle().executeNumber += uids.length;
  }

  public collectWriteBackUids(uids: number[]) {
    for (const uid of uids) {
      this.createEntryIfNotExists(uid);
      this.getEntry(uid).writeBackCycles++;
    }

    this.createStatusesIfNotExists();
    this.getStatusesAtCurrentCycle().writeBackNumber += uids.length;
  }

  public collectCommitUids(uids: number[]) {
    for (const uid of uids) {
      this.createEntryIfNotExists(uid);
      this.getEntry(uid).commited = true;
    }

    this.createStatusesIfNotExists();
    this.getStatusesAtCurrentCycle().commitNumber += uids.length;
  }

  public associateUidWithInstruction(uid: number, instructionId: number) {
    this.createEntryIfNotExists(uid);
    this.getEntry(uid).instructionId = instructionId;
  }

  public advanceCycle() {
    this._currentCycle++;
  }

  public getUnitsUsage(): Map<string, number[]> {
    const usage = new Map<string, number[]>();
    for (const [unitName, usageAtCycle] of this._unitUsageAtCycle) {
      usage.set(unitName, Array.from(usageAtCycle.values()));
    }
    return usage;
  }

  public getCommitedAndDiscarded(): { commited: number; discarded: number } {
    let commited = 0;
    let total = 0;
    for (const [_, entry] of this._instrEntries) {
      if (entry.commited) {
        commited++;
      }
      total++;
    }
    return { commited, discarded: total - commited };
  }

  public getCommitedPercentagePerInstruction(): Map<number, number> {
    const commited = new Map<number, number>();
    const total = new Map<number, number>();
    for (const [_, entry] of this._instrEntries) {
      if (!total.has(entry.instructionId)) {
        total.set(entry.instructionId, 0);
        commited.set(entry.instructionId, 0);
      }
      total.set(entry.instructionId, (total.get(entry.instructionId) ?? 0) + 1);
      if (entry.commited) {
        commited.set(
          entry.instructionId,
          (commited.get(entry.instructionId) ?? 0) + 1,
        );
      }
    }

    for (const [instructionId, commitedCount] of commited) {
      const totalCount = total.get(instructionId) ?? 1;
      commited.set(instructionId, commitedCount / totalCount);
    }
    return commited;
  }

  public getInstructionsStatusesAverage(): Map<number, InstructionStatsEntry> {
    const average = new Map<number, InstructionStatsEntry>();
    const count = new Map<number, number>();
    for (const [, entry] of this._instrEntries) {
      if (!count.has(entry.instructionId)) {
        count.set(entry.instructionId, 0);
        average.set(entry.instructionId, {
          instructionId: entry.instructionId,
          prefetchCycles: 0,
          decodeCycles: 0,
          issueCycles: 0,
          executeCycles: 0,
          writeBackCycles: 0,
          commited: false,
        });
      }

      if (entry.commited) {
        const avg = average.get(entry.instructionId);
        if (avg) {
          avg.prefetchCycles += entry.prefetchCycles;
          avg.decodeCycles += entry.decodeCycles;
          avg.issueCycles += entry.issueCycles;
          avg.executeCycles += entry.executeCycles;
          avg.writeBackCycles += entry.writeBackCycles;
        }
        count.set(
          entry.instructionId,
          (count.get(entry.instructionId) ?? 0) + 1,
        );
      }
    }

    for (const [instructionId, entry] of average) {
      const c = count.get(instructionId) ?? 1;
      entry.prefetchCycles /= c;
      entry.decodeCycles /= c;
      entry.issueCycles /= c;
      entry.executeCycles /= c;
      entry.writeBackCycles /= c;
    }
    return average;
  }

  public getPerStatusCountAtCycle(): Map<string, number[]> {
    const count = new Map<string, number[]>();
    for (const [, statuses] of this._statusesAtCycle) {
      for (const [status, value] of Object.entries(statuses)) {
        if (!count.has(status)) {
          count.set(status, []);
        }
        count.get(status)?.push(value);
      }
    }
    return count;
  }

  public exportStats(): object {
    const unitUsage: Record<string, object> = {};
    for (const [unitName, usageAtCycle] of this._unitUsageAtCycle) {
      unitUsage[unitName] = Object.fromEntries(usageAtCycle);
    }
    return {
      instances: Object.fromEntries(this._instrEntries),
      statuses: Object.fromEntries(this._statusesAtCycle),
      unitUsage,
    };
  }

  private createStatusesIfNotExists() {
    if (!this._statusesAtCycle.has(this._currentCycle)) {
      this._statusesAtCycle.set(this._currentCycle, {
        prefetchNumber: 0,
        decodeNumber: 0,
        issueNumber: 0,
        executeNumber: 0,
        writeBackNumber: 0,
        commitNumber: 0,
      });
    }
  }

  private getEntry(uid: number): InstructionStatsEntry {
    const entry = this._instrEntries.get(uid);
    if (!entry) {
      throw new Error(`Stats entry for uid ${uid} not found`);
    }
    return entry;
  }

  private getStatusesAtCurrentCycle(): StatusesStats {
    const statuses = this._statusesAtCycle.get(this._currentCycle);
    if (!statuses) {
      throw new Error(`Statuses for cycle ${this._currentCycle} not found`);
    }
    return statuses;
  }

  private createEntryIfNotExists(uid: number) {
    if (!this._instrEntries.has(uid)) {
      this._instrEntries.set(uid, {
        instructionId: -1,
        prefetchCycles: 0,
        decodeCycles: 0,
        issueCycles: 0,
        executeCycles: 0,
        writeBackCycles: 0,
        commited: false,
      });
    }
  }
}
