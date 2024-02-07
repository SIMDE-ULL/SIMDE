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

export class SuperescalarStats {
    private _instrEntries: Map<number, InstructionStatsEntry> = new Map();
    private _statusesAtCycle: Map<number, StatusesStats> = new Map();
    private _unitOcupationAtCycle: Map<string, Map<number, number>> = new Map();
    private _currentCycle: number = 0;

    constructor() {

    }

    public collectMultipleUnitOcupation(unitName: string, ocupations: number[]) {
        let ocupation = ocupations.reduce((acc, val) => acc + val, 0) / ocupations.length;
        this.collectUnitOcupation(unitName, ocupation);
    }

    public collectUnitOcupation(unitName: string, ocupation: number) {
        if (!this._unitOcupationAtCycle.has(unitName)) {
            this._unitOcupationAtCycle.set(unitName, new Map());
        }

        this._unitOcupationAtCycle.get(unitName).set(this._currentCycle, ocupation);
    }

    public collectDecodeUuids(uuids: number[]) {
        for (let uuid of uuids) {
            this.createEntryIfNotExists(uuid);
            this._instrEntries.get(uuid).decodeCycles++;
        }

        this.createStatusesIfNotExists();
        this._statusesAtCycle.get(this._currentCycle).decodeNumber += uuids.length;
    }

    public collectPrefetchUuids(uuids: number[]) {
        for (let uuid of uuids) {
            this.createEntryIfNotExists(uuid);
            this._instrEntries.get(uuid).prefetchCycles++;
        }

        this.createStatusesIfNotExists();
        this._statusesAtCycle.get(this._currentCycle).prefetchNumber += uuids.length;
    }

    public collectIssuedUuids(uuids: number[]) {
        for (let uuid of uuids) {
            this.createEntryIfNotExists(uuid);
            this._instrEntries.get(uuid).issueCycles++;
        }

        this.createStatusesIfNotExists();
        this._statusesAtCycle.get(this._currentCycle).issueNumber += uuids.length;
    }

    public collectExecutingUuids(uuids: number[]) {
        for (let uuid of uuids) {
            this.createEntryIfNotExists(uuid);
            this._instrEntries.get(uuid).executeCycles++;
        }

        this.createStatusesIfNotExists();
        this._statusesAtCycle.get(this._currentCycle).executeNumber += uuids.length;
    }

    public collectWriteBackUuids(uuids: number[]) {
        for (let uuid of uuids) {
            this.createEntryIfNotExists(uuid);
            this._instrEntries.get(uuid).writeBackCycles++;
        }

        this.createStatusesIfNotExists();
        this._statusesAtCycle.get(this._currentCycle).writeBackNumber += uuids.length;
    }

    public collectCommitUuids(uuids: number[]) {
        for (let uuid of uuids) {
            this.createEntryIfNotExists(uuid);
            this._instrEntries.get(uuid).commited = true;
        }

        this.createStatusesIfNotExists();
        this._statusesAtCycle.get(this._currentCycle).commitNumber += uuids.length;
    }

    public associateUuidWithInstruction(uuid: number, instructionId: number) {
        this.createEntryIfNotExists(uuid);
        this._instrEntries.get(uuid).instructionId = instructionId;
    }

    public advanceCycle() {
        this._currentCycle++;
    }

    public getCommitedAndDiscarded(): { commited: number, discarded: number } {
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
                commited.set(entry.instructionId, commited.get(entry.instructionId) + 1);
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
        for (let [uuid, entry] of this._instrEntries) {
            if (!count.has(entry.instructionId)) {
                count.set(entry.instructionId, 0);
                average.set(entry.instructionId, {
                    instructionId: entry.instructionId,
                    prefetchCycles: 0,
                    decodeCycles: 0,
                    issueCycles: 0,
                    executeCycles: 0,
                    writeBackCycles: 0,
                    commited: false
                });
            }

            if (entry.commited) {
                average.get(entry.instructionId).prefetchCycles += entry.prefetchCycles;
                average.get(entry.instructionId).decodeCycles += entry.decodeCycles;
                average.get(entry.instructionId).issueCycles += entry.issueCycles;
                average.get(entry.instructionId).executeCycles += entry.executeCycles;
                average.get(entry.instructionId).writeBackCycles += entry.writeBackCycles;
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

    public exportStats(): object {
        let unitOcupation = {};
        for (let [unitName, ocupationAtCycle] of this._unitOcupationAtCycle) {
            unitOcupation[unitName] = Object.fromEntries(ocupationAtCycle);
        }
        return { instances: Object.fromEntries(this._instrEntries), statuses: Object.fromEntries(this._statusesAtCycle), unitOcupation };
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

    private createEntryIfNotExists(uuid: number) {
        if (!this._instrEntries.has(uuid)) {
            this._instrEntries.set(uuid, {
                instructionId: -1,
                prefetchCycles: 0,
                decodeCycles: 0,
                issueCycles: 0,
                executeCycles: 0,
                writeBackCycles: 0,
                commited: false
            });
        }
    }

}