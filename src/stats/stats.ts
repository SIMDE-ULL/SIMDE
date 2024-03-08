"use strict";
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
  private _currentCycle: number = 0;

  public collectMultipleUnitUsage(unitName: string, usages: number[]) {
    let usage =
      usages.reduce((acc, val) => acc + val, 0) / usages.length;
    this.collectUnitUsage(unitName, usage);
  }

  public collectUnitUsage(unitName: string, usage: number) {
    if (!this._unitUsageAtCycle.has(unitName)) {
      this._unitUsageAtCycle.set(unitName, new Map());
    }

    this._unitUsageAtCycle.get(unitName).set(this._currentCycle, usage);
  }

  public collectDecodeUids(uids: number[]) {
    for (let uid of uids) {
      this.createEntryIfNotExists(uid);
      this._instrEntries.get(uid).decodeCycles++;
    }

    this.createStatusesIfNotExists();
    this._statusesAtCycle.get(this._currentCycle).decodeNumber += uids.length;
  }

  public collectPrefetchUids(uids: number[]) {
    for (let uid of uids) {
      this.createEntryIfNotExists(uid);
      this._instrEntries.get(uid).prefetchCycles++;
    }

    this.createStatusesIfNotExists();
    this._statusesAtCycle.get(this._currentCycle).prefetchNumber +=
      uids.length;
  }

  public collectIssuedUids(uids: number[]) {
    for (let uid of uids) {
      this.createEntryIfNotExists(uid);
      this._instrEntries.get(uid).issueCycles++;
    }

    this.createStatusesIfNotExists();
    this._statusesAtCycle.get(this._currentCycle).issueNumber += uids.length;
  }

  public collectExecutingUids(uids: number[]) {
    for (let uid of uids) {
      this.createEntryIfNotExists(uid);
      this._instrEntries.get(uid).executeCycles++;
    }

    this.createStatusesIfNotExists();
    this._statusesAtCycle.get(this._currentCycle).executeNumber += uids.length;
  }

  public collectWriteBackUids(uids: number[]) {
    for (let uid of uids) {
      this.createEntryIfNotExists(uid);
      this._instrEntries.get(uid).writeBackCycles++;
    }

    this.createStatusesIfNotExists();
    this._statusesAtCycle.get(this._currentCycle).writeBackNumber +=
      uids.length;
  }

  public collectCommitUids(uids: number[]) {
    for (let uid of uids) {
      this.createEntryIfNotExists(uid);
      this._instrEntries.get(uid).commited = true;
    }

    this.createStatusesIfNotExists();
    this._statusesAtCycle.get(this._currentCycle).commitNumber += uids.length;
  }

  public associateUidWithInstruction(uid: number, instructionId: number) {
    this.createEntryIfNotExists(uid);
    this._instrEntries.get(uid).instructionId = instructionId;
  }

  public advanceCycle() {
    this._currentCycle++;
  }

  public getUnitsUsage(): Map<string, number[]> {
    let usage = new Map<string, number[]>();
    for (let [unitName, usageAtCycle] of this._unitUsageAtCycle) {
      usage.set(unitName, Array.from(usageAtCycle.values()));
    }
    return usage;
  }

  public getCommitedAndDiscarded(): { commited: number; discarded: number } {
    let commited = 0;
    let total = 0;
    for (let [_, entry] of this._instrEntries) {
      if (entry.commited) {
        commited++;
      }
      total++;
    }
    return { commited, discarded: total - commited };
  }

  public getCommitedPercentagePerInstruction(): Map<number, number> {
    let commited = new Map<number, number>();
    let total = new Map<number, number>();
    for (let [_, entry] of this._instrEntries) {
      if (!total.has(entry.instructionId)) {
        total.set(entry.instructionId, 0);
        commited.set(entry.instructionId, 0);
      }
      total.set(entry.instructionId, total.get(entry.instructionId) + 1);
      if (entry.commited) {
        commited.set(
          entry.instructionId,
          commited.get(entry.instructionId) + 1
        );
      }
    }

    for (let [instructionId, commitedCount] of commited) {
      commited.set(instructionId, commitedCount / total.get(instructionId));
    }
    return commited;
  }

  public getInstructionsStatusesAverage(): Map<number, InstructionStatsEntry> {
    let average = new Map<number, InstructionStatsEntry>();
    let count = new Map<number, number>();
    for (let [uid, entry] of this._instrEntries) {
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
        average.get(entry.instructionId).prefetchCycles += entry.prefetchCycles;
        average.get(entry.instructionId).decodeCycles += entry.decodeCycles;
        average.get(entry.instructionId).issueCycles += entry.issueCycles;
        average.get(entry.instructionId).executeCycles += entry.executeCycles;
        average.get(entry.instructionId).writeBackCycles +=
          entry.writeBackCycles;
        count.set(entry.instructionId, count.get(entry.instructionId) + 1);
      }
    }

    for (let [instructionId, entry] of average) {
      entry.prefetchCycles /= count.get(instructionId);
      entry.decodeCycles /= count.get(instructionId);
      entry.issueCycles /= count.get(instructionId);
      entry.executeCycles /= count.get(instructionId);
      entry.writeBackCycles /= count.get(instructionId);
    }
    return average;
  }

  public getPerStatusCountAtCycle(): Map<string, number[]> {
    let count = new Map<string, number[]>();
    for (let [cycle, statuses] of this._statusesAtCycle) {
      for (let [status, value] of Object.entries(statuses)) {
        if (!count.has(status)) {
          count.set(status, []);
        }
        count.get(status).push(value);
      }
    }
    return count;
  }

  public exportStats(): object {
    let unitUsage = {};
    for (let [unitName, usageAtCycle] of this._unitUsageAtCycle) {
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
