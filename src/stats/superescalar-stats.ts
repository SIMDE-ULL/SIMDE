

interface InstructionStatsEntry {
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