import { Machine } from '../Common/Machine';
import { Opcodes } from '../Common/Opcodes';
import { Code } from '../Common/Code';

import { ReorderBufferEntry } from './ReorderBufferEntry';
import { PrefetchEntry } from './PrefetchEntry';
import { DecoderEntry } from './DecoderEntry';
import { ReserveStationEntry } from './ReserveStationEntry';
import { FunctionalUnit, FunctionalUnitType, FUNCTIONALUNITTYPESQUANTITY } from '../Common/FunctionalUnit';
import { Queue } from '../Collections/Queue';
import { Instruction } from '../Common/Instruction';
import { CommitStatus, SuperStage, SuperescalarStatus } from './SuperescalarEnums';

export class Superescalar extends Machine {

    private static PREDTABLEBITS = 4;
    private static PREDTABLESIZE = 1 << Superescalar.PREDTABLEBITS;

    private static ISSUE_DEF = 4;

    private _issue: number;
    private _code: Code;

    private _ROBGpr: number[];
    private _ROBFpr: number[];
    private _reserveStationEntry: ReserveStationEntry[][];
    private _reorderBuffer: Queue<ReorderBufferEntry>;
    private _prefetchUnit: Queue<PrefetchEntry>;
    private _decoder: Queue<DecoderEntry>;
    private _aluMem: FunctionalUnit[];

    private _jumpPrediction: number[];

    constructor() {
        super();
        this.issue = Superescalar.ISSUE_DEF;

        this.ROBFpr = new Array(Machine.NFP);
        this.ROBFpr.fill(-1);
        this.ROBGpr = new Array(Machine.NGP);
        this.ROBGpr.fill(-1);
        this.jumpPrediction = new Array(Superescalar.PREDTABLESIZE).fill(0);
        this.reserveStationEntry = new Array(FUNCTIONALUNITTYPESQUANTITY).fill(null);
        // Calculate total ROB size
        let total = 0;
        for (let i = 0; i < FUNCTIONALUNITTYPESQUANTITY; i++) {
            this.reserveStationEntry[i] = new Array();
            total += this.getReserveStationSize(i);
        }
        this.reorderBuffer = new Queue<ReorderBufferEntry>();
        this.prefetchUnit = new Queue<PrefetchEntry>();
        this.decoder = new Queue<DecoderEntry>();

        this.reorderBuffer.init(total);
        this.decoder.init(this.issue);
        this.prefetchUnit.init(2 * this.issue);
        this._code = null;

        this.aluMem = new Array(this.functionalUnitNumbers[FunctionalUnitType.MEMORY]);

        for (let j = 0; j < this.functionalUnitNumbers[FunctionalUnitType.MEMORY]; j++) {
            this.aluMem[j] = new FunctionalUnit();
            this.aluMem[j].type = FunctionalUnitType.INTEGERSUM;
            this.aluMem[j].latency = this.functionalUnitLatencies[FunctionalUnitType.INTEGERSUM];
        }
    }

    init(reset: boolean) {
        super.init(reset);
        // Clean Gpr, Fpr, predSalto
        this.ROBGpr.fill(-1);
        this.ROBFpr.fill(-1);
        this.jumpPrediction.fill(0);
        // Calculate ROB size
        let total = 0;

        for (let i = 0; i < FUNCTIONALUNITTYPESQUANTITY; i++) {
            this.reserveStationEntry[i] = new Array();
            total += this.getReserveStationSize(i);
        }
        this.reorderBuffer.init(total);
        this.decoder.init(this.issue);
        this.prefetchUnit.init(2 * this.issue);
        this._code = null;

        this.aluMem = new Array(this.functionalUnitNumbers[FunctionalUnitType.MEMORY]).fill(new FunctionalUnit());

        for (let j = 0; j < this.functionalUnitNumbers[FunctionalUnitType.MEMORY]; j++) {
            this.aluMem[j] = new FunctionalUnit();
            this.aluMem[j].type = FunctionalUnitType.INTEGERSUM;
            this.aluMem[j].latency = this.functionalUnitLatencies[FunctionalUnitType.INTEGERSUM];
        }
    }

    ticPrefetch(): number {
        while (!this.prefetchUnit.isFull() && (this.pc < this.code.lines)) {
            let aux: PrefetchEntry = new PrefetchEntry();
            // Importante: Hago una copia de la instrucción original para distinguir
            // las distintas apariciones de una misma inst.
            aux.instruction = new Instruction();
            aux.instruction.copy(this.code.instructions[this.pc]);
            if (((aux.instruction.opcode === Opcodes.BEQ
            || aux.instruction.opcode === Opcodes.BNE
            || aux.instruction.opcode === Opcodes.BGT)
            && this.prediction(this.pc))) {
                this.pc = this.code.getBasicBlockInstruction(aux.instruction.getOperand(2));
            } else {
                this.pc++;
            }
            this.prefetchUnit.add(aux);
        }
        return this.prefetchUnit.getCount();
    }

    public getReserveStationSize(type: FunctionalUnitType): number {
        return this.functionalUnitNumbers[type] * (this._functionalUnitLatencies[type] + 1);
    }

    ticDecoder(): number {
        for (let i = this.prefetchUnit.first; !this.decoder.isFull() && i !== this.prefetchUnit.end(); i = this.prefetchUnit.nextIterator(i)) {
            let aux: PrefetchEntry = this.prefetchUnit.elements[i];
            this.prefetchUnit.remove(i);
            let newDecoderEntry = new DecoderEntry();
            newDecoderEntry.instruction = aux.instruction;
            this.decoder.add(newDecoderEntry);
        }
        return this.decoder.getCount();
    }

    checkRegister(register: number, floatingPoint: boolean, reserveStationEntry: ReserveStationEntry, j: boolean) {
        let q = -1;
        let v = 0;
        if (floatingPoint) {
            // The register has the value ready
            if (!this._fpr.busy[register]) {
                v = this._fpr.content[register];
            } else if (this.reorderBuffer.elements[this.ROBFpr[register]].ready) {
                v = this.reorderBuffer.elements[this.ROBFpr[register]].value;
            } else {
                // The value is still being calculated
                q = this.ROBFpr[register];
            }
        } else {
            if (!this._gpr.busy[register]) {
                v = this._gpr.content[register];
            } else if (this.reorderBuffer.elements[this.ROBGpr[register]].ready) {
                v = this.reorderBuffer.elements[this.ROBGpr[register]].value;
            } else {
                // The value is still being calculated
                q = this.ROBGpr[register];
            }
        }

        if (j) {
            reserveStationEntry.Qj = q;
            reserveStationEntry.Vj = v;
        } else {
            reserveStationEntry.Qk = q;
            reserveStationEntry.Vk = v;
        }
    }

    issueInstruction(instruction: Instruction, type: number, robIndex: number) {
        let actualReserveStation = this.reserveStationEntry[type];
        actualReserveStation[actualReserveStation.length - 1].instruction = instruction;
        actualReserveStation[actualReserveStation.length - 1].ROB = robIndex;
        actualReserveStation[actualReserveStation.length - 1].FUNum = -1;
        actualReserveStation[actualReserveStation.length - 1].A = -1;
        /* tslint:disable:ter-indent */
        switch (instruction.opcode) {
            case Opcodes.ADD:
            case Opcodes.SUB:
            case Opcodes.MULT:
            case Opcodes.OR:
            case Opcodes.AND:
            case Opcodes.NOR:
            case Opcodes.XOR:
            case Opcodes.SLLV:
            case Opcodes.SRLV:
            this.checkRegister(instruction.getOperand(1), false, actualReserveStation[actualReserveStation.length - 1], true);
            this.checkRegister(instruction.getOperand(2), false, actualReserveStation[actualReserveStation.length - 1], false);
            this.ROBGpr[instruction.getOperand(0)] = robIndex;
            this._gpr.setBusy(instruction.getOperand(0), true);
            this.reorderBuffer.elements[robIndex].destinyRegister = instruction.getOperand(0);
            break;
            case Opcodes.ADDI:
            this.checkRegister(instruction.getOperand(1), false, actualReserveStation[actualReserveStation.length - 1], true);
            actualReserveStation[actualReserveStation.length - 1].Qk = -1;
            actualReserveStation[actualReserveStation.length - 1].Vk = instruction.getOperand(2);
            this.ROBGpr[instruction.getOperand(0)] = robIndex;
            this._gpr.setBusy(instruction.getOperand(0), true);
            this.reorderBuffer.elements[robIndex].destinyRegister = instruction.getOperand(0);
            break;
            case Opcodes.ADDF:
            case Opcodes.SUBF:
            case Opcodes.MULTF:
            this.checkRegister(instruction.getOperand(1), true, actualReserveStation[actualReserveStation.length - 1], true);
            this.checkRegister(instruction.getOperand(2), true, actualReserveStation[actualReserveStation.length - 1], false);
            this.ROBFpr[instruction.getOperand(0)] = robIndex;
            this._fpr.setBusy(instruction.getOperand(0), true);
            this.reorderBuffer.elements[robIndex].destinyRegister = instruction.getOperand(0);
            break;
            case Opcodes.SW:
            this.checkRegister(instruction.getOperand(0), false, actualReserveStation[actualReserveStation.length - 1], true);
            this.checkRegister(instruction.getOperand(2), false, actualReserveStation[actualReserveStation.length - 1], false);
            actualReserveStation[actualReserveStation.length - 1].A = instruction.getOperand(1);
            this.reorderBuffer.elements[robIndex].address = -1;
            break;
            case Opcodes.SF:
            this.checkRegister(instruction.getOperand(0), true, actualReserveStation[actualReserveStation.length - 1], true);
            this.checkRegister(instruction.getOperand(2), false, actualReserveStation[actualReserveStation.length - 1], false);
            actualReserveStation[actualReserveStation.length - 1].A = instruction.getOperand(1);
            this.reorderBuffer.elements[robIndex].address = -1;
            break;
            case Opcodes.LW:
            this.checkRegister(instruction.getOperand(2), false, actualReserveStation[actualReserveStation.length - 1], false);
            actualReserveStation[actualReserveStation.length - 1].Qj = -1;
            actualReserveStation[actualReserveStation.length - 1].Vj = 0;
            actualReserveStation[actualReserveStation.length - 1].A = instruction.getOperand(1);
            this.ROBGpr[instruction.getOperand(0)] = robIndex;
            this._gpr.setBusy(instruction.getOperand(0), true);
            this.reorderBuffer.elements[robIndex].destinyRegister = instruction.getOperand(0);
            this.reorderBuffer.elements[robIndex].address = -1;
            break;
            case Opcodes.LF:
            this.checkRegister(instruction.getOperand(2), false, actualReserveStation[actualReserveStation.length - 1], false);
            actualReserveStation[actualReserveStation.length - 1].Qj = -1;
            actualReserveStation[actualReserveStation.length - 1].Vj = 0;
            actualReserveStation[actualReserveStation.length - 1].A = instruction.getOperand(1);
            this.ROBFpr[instruction.getOperand(0)] = robIndex;
            this._fpr.setBusy(instruction.getOperand(0), true);
            this.reorderBuffer.elements[robIndex].destinyRegister = instruction.getOperand(0);
            this.reorderBuffer.elements[robIndex].address = -1;
            break;
            case Opcodes.BEQ:
            case Opcodes.BNE:
            case Opcodes.BGT:
            this.checkRegister(instruction.getOperand(0), false, actualReserveStation[actualReserveStation.length - 1], true);
            this.checkRegister(instruction.getOperand(1), false, actualReserveStation[actualReserveStation.length - 1], false);
            actualReserveStation[actualReserveStation.length - 1].A = instruction.getOperand(2);
            break;
            default:
            break;
        }
        /* tslint:enable:ter-indent */
    }

    ticIssue(): number {
        let cont = 0;

        for (let i = this.decoder.first; i !== this.decoder.end();
            i = this.decoder.nextIterator(i), cont++) {
            let instruction: Instruction = this.decoder.elements[i].instruction;
            if (this.reorderBuffer.isFull()) {
                break;
            }
            let fuType: FunctionalUnitType =  this.code.getFunctionalUnitType(instruction.opcode);
            if (this.reserveStationEntry[fuType].length === this.getReserveStationSize(fuType)) {
                break;
            }
            let newROB: ReorderBufferEntry = new ReorderBufferEntry();
            newROB.value = 0.0;
            newROB.destinyRegister = -1;
            newROB.address = -1;
            let robPos = this.reorderBuffer.add(newROB);
            let newER: ReserveStationEntry = new ReserveStationEntry();
            this.reserveStationEntry[fuType].push(newER);
            this.issueInstruction(instruction, fuType, robPos);

            this.reorderBuffer.elements[robPos].instruction = instruction;
            this.reorderBuffer.elements[robPos].ready = false;
            this.reorderBuffer.elements[robPos].superStage = SuperStage.SUPER_ISSUE;
            this.decoder.remove(i);
        }

        return cont;
    }

    checkStore(robIndex: number, address: number): boolean {
        // Check for previous stores
        let i;
        for (i = this.reorderBuffer.first; i !== robIndex; i = this.reorderBuffer.nextIterator(i)) {
            let opcode: number = this.reorderBuffer.elements[i].instruction.opcode;
            if ((opcode === Opcodes.SW) || (opcode === Opcodes.SF)) {
                // without calculated address...
                if (this.reorderBuffer.elements[i].address === -1) {
                    break;
                    // ...or with the same address.
                } else if (this.reorderBuffer.elements[i].address === address) {
                    break;
                }
            }
        }
        return i === robIndex;
    }

    executeInstruction(type: FunctionalUnitType, num: number) {
        let i = 0;
        /* tslint:disable:ter-indent */
        switch (type) {
            case FunctionalUnitType.INTEGERSUM:
            case FunctionalUnitType.INTEGERMULTIPLY:
            case FunctionalUnitType.FLOATINGSUM:
            case FunctionalUnitType.FLOATINGMULTIPLY:
            case FunctionalUnitType.JUMP:
            // Operandos disponibles
            while (i !== this.reserveStationEntry[type].length &&
                !((this.reserveStationEntry[type][i].Qj === -1)
                    && (this.reserveStationEntry[type][i].Qk === -1) &&
                    (this.reserveStationEntry[type][i].FUNum === -1))) {
                i++;
            }
            if (i !== this.reserveStationEntry[type].length) {
                this.reserveStationEntry[type][i].FUNum = num;
                this.reserveStationEntry[type][i].FUPos = this.functionalUnit[type][num].fillFlow(this.reserveStationEntry[type][i].instruction);
                this.reorderBuffer.elements[this.reserveStationEntry[type][i].ROB].superStage = SuperStage.SUPER_EXECUTE;
            }
            break;
            case FunctionalUnitType.MEMORY:
            // Fase 2 (Sólo los LOAD): Poner a ejecutar
            for (; i !== this.reserveStationEntry[type].length; i++) {
                let opcode = this.reserveStationEntry[type][i].instruction.opcode;
                if ((opcode === Opcodes.LW || opcode === Opcodes.LF)
                    && (this.reserveStationEntry[type][i].FUNum === -1)
                    && this.reorderBuffer.elements[this.reserveStationEntry[type][i].ROB].address !== -1
                    && this.checkStore(this.reserveStationEntry[type][i].ROB, this.reorderBuffer.elements[this.reserveStationEntry[type][i].ROB].address)) {
                    break;
                }
            }
            if (i !== this.reserveStationEntry[type].length) {
                this.reserveStationEntry[type][i].FUNum = num;
                this.reserveStationEntry[type][i].FUPos = this.functionalUnit[type][num].fillFlow(this.reserveStationEntry[type][i].instruction);
            }
            break;
            default:
            break;
        }
        /* tslint:enable:ter-indent */
    }

    ticExecute(): void {
        // Go through all the Functional Unit
        for (let i = 0; i < FUNCTIONALUNITTYPESQUANTITY; i++) {
            for (let j = 0; j < this.functionalUnitNumbers[i]; j++) {
                if (this.functionalUnit[i][j].isFree()) {
                    this.executeInstruction(i, j);
                }
            }
        }
        // Steb b of address calculation
        // Now it's time to gi through the FU of Address Calc
        for (let i = 0; i < this.functionalUnitNumbers[FunctionalUnitType.MEMORY]; i++) {
            if (this.aluMem[i].getTopInstruction() != null) {
                // Look the entry of the Reserve station that matchs this instruction
                let j = 0;
                while ((this.reserveStationEntry[FunctionalUnitType.MEMORY][j].FUNum !== (this.functionalUnitNumbers[FunctionalUnitType.MEMORY] + i))
                    || (this.reserveStationEntry[FunctionalUnitType.MEMORY][j].FUPos !== this.aluMem[i].getLast())) {
                    j++;
                }

                this.reorderBuffer.elements[this.reserveStationEntry[FunctionalUnitType.MEMORY][j].ROB].address = this.reserveStationEntry[FunctionalUnitType.MEMORY][j].Vk + this.reserveStationEntry[FunctionalUnitType.MEMORY][j].A;
                this.reserveStationEntry[FunctionalUnitType.MEMORY][j].A = this.reorderBuffer.elements[this.reserveStationEntry[FunctionalUnitType.MEMORY][j].ROB].address;
                this.reserveStationEntry[FunctionalUnitType.MEMORY][j].FUNum = -1; // Vuelve a no tener una UF asociada
            }
            this.aluMem[i].tic();
        }
        // Step a of address calculation
        // Fil the ALU of address calculations related to this FU
        for (let i = 0; i < this.functionalUnitNumbers[FunctionalUnitType.MEMORY]; i++) {
            let j = 0;
            for (; j !== this.reserveStationEntry[FunctionalUnitType.MEMORY].length; j++) {
                // Operand value available AND address not calculated yet AND is being calculated right now
                if ((this.reserveStationEntry[FunctionalUnitType.MEMORY][j].Qk === -1)
                    && (this.reorderBuffer.elements[this.reserveStationEntry[FunctionalUnitType.MEMORY][j].ROB].address === -1)
                    && (this.reserveStationEntry[FunctionalUnitType.MEMORY][j].FUNum === -1)) {
                    break;
                }
            }
            if (j !== this.reserveStationEntry[FunctionalUnitType.MEMORY].length) {
                this.reserveStationEntry[FunctionalUnitType.MEMORY][j].FUNum = i + this.functionalUnitNumbers[FunctionalUnitType.MEMORY];  // Así las distingo de las UF de Memoria
                this.reserveStationEntry[FunctionalUnitType.MEMORY][j].FUPos = this.aluMem[i].fillFlow(this.reserveStationEntry[FunctionalUnitType.MEMORY][j].instruction);
                this.reorderBuffer.elements[this.reserveStationEntry[FunctionalUnitType.MEMORY][j].ROB].superStage = SuperStage.SUPER_EXECUTE;
            }
        }
    }

    writeInstruction(type: FunctionalUnitType, num: number) {
        let resul;
        let inst: Instruction = this.functionalUnit[type][num].getTopInstruction();
        if (inst != null) {
            let i = 0;
            while ((this.reserveStationEntry[type][i].FUNum !== num) ||
            (this.reserveStationEntry[type][i].FUPos !== this.functionalUnit[type][num].getLast())) {
                i++;
            }
            let opcode = inst.opcode;
            /* tslint:disable:ter-indent */
            switch (opcode) {
            case Opcodes.ADD:
            case Opcodes.ADDI:
            case Opcodes.ADDF:
                resul = this.reserveStationEntry[type][i].Vj + this.reserveStationEntry[type][i].Vk;
                break;
            case Opcodes.SUB:
            case Opcodes.SUBF:
                resul = this.reserveStationEntry[type][i].Vj - this.reserveStationEntry[type][i].Vk;
                break;
            case Opcodes.OR:
                resul = this.reserveStationEntry[type][i].Vj | this.reserveStationEntry[type][i].Vk;
                break;
            case Opcodes.AND:
                resul = this.reserveStationEntry[type][i].Vj & this.reserveStationEntry[type][i].Vk;
                break;
            case Opcodes.XOR:
                resul = this.reserveStationEntry[type][i].Vj ^ this.reserveStationEntry[type][i].Vk;
                break;
            case Opcodes.NOR:
                resul = ~(this.reserveStationEntry[type][i].Vj | this.reserveStationEntry[type][i].Vk);
                break;
            case Opcodes.SRLV:
                resul = this.reserveStationEntry[type][i].Vj >> this.reserveStationEntry[type][i].Vk;
                break;
            case Opcodes.SLLV:
                resul = this.reserveStationEntry[type][i].Vj << this.reserveStationEntry[type][i].Vk;
                break;
            case Opcodes.MULT:
            case Opcodes.MULTF:
                resul = this.reserveStationEntry[type][i].Vj * this.reserveStationEntry[type][i].Vk;
                break;
            // En esta fase no se hace nada con los STORES
            case Opcodes.LW:
            case Opcodes.LF:
                let a = this.memory.getDatum(this.reserveStationEntry[type][i].A);
                resul = a.datum;
                if (!a.got) {
                    this.functionalUnit[type][num].status.stall = this.memoryFailLatency - this.functionalUnit[type][num].latency;
                }
                break;
            case Opcodes.BEQ:
                resul = (this.reserveStationEntry[type][i].Vj === this.reserveStationEntry[type][i].Vk) ? 1 : 0;
                break;
            case Opcodes.BNE:
                resul = (this.reserveStationEntry[type][i].Vj !== this.reserveStationEntry[type][i].Vk) ? 1 : 0;
                break;
            case Opcodes.BGT:
                resul = (this.reserveStationEntry[type][i].Vj > this.reserveStationEntry[type][i].Vk) ? 1 : 0;
                break;
            /* tslint:enable:ter-indent */
            }
            // Finish the instruction execution
            if (this.functionalUnit[type][num].status.stall === 0) {
                if ((opcode !== Opcodes.BNE) && (opcode !== Opcodes.BEQ) && (opcode !== Opcodes.BGT)) {
                    // Update all the reserve stations
                    for (let j = 0; j < FUNCTIONALUNITTYPESQUANTITY; j++) {
                        for (let k = 0; k < this.reserveStationEntry[j].length; k++) {
                            if (this.reserveStationEntry[j][k].Qj === this.reserveStationEntry[type][i].ROB) {
                                this.reserveStationEntry[j][k].Vj = resul;
                                this.reserveStationEntry[j][k].Qj = -1;
                            }
                            if (this.reserveStationEntry[j][k].Qk === this.reserveStationEntry[type][i].ROB) {
                                this.reserveStationEntry[j][k].Vk = resul;
                                this.reserveStationEntry[j][k].Qk = -1;
                            }
                        }
                    }
                }

                this.reorderBuffer.elements[this.reserveStationEntry[type][i].ROB].value = resul;
                this.reorderBuffer.elements[this.reserveStationEntry[type][i].ROB].superStage = SuperStage.SUPER_WRITERESULT;
                this.reorderBuffer.elements[this.reserveStationEntry[type][i].ROB].ready = true;
                // Elimino la entrada de la ER
                this.reserveStationEntry[type].splice(i, 1);
            }
        }
    }

    ticWriteResult(): void {
        // First check for STORES that are ready
        let i = 0;
        while (i !== this.reserveStationEntry[FunctionalUnitType.MEMORY].length) {
            let opcode = this.reorderBuffer.elements[this.reserveStationEntry[FunctionalUnitType.MEMORY][i].ROB].instruction.opcode;
            if (((opcode === Opcodes.SW) || (opcode === Opcodes.SF))
            && (this.reserveStationEntry[FunctionalUnitType.MEMORY][i].Qj === -1)
            && (this.reorderBuffer.elements[this.reserveStationEntry[FunctionalUnitType.MEMORY][i].ROB].address !== -1)) {
                this.reorderBuffer.elements[this.reserveStationEntry[FunctionalUnitType.MEMORY][i].ROB].value = this.reserveStationEntry[FunctionalUnitType.MEMORY][i].Vj;
                this.reorderBuffer.elements[this.reserveStationEntry[FunctionalUnitType.MEMORY][i].ROB].superStage = SuperStage.SUPER_WRITERESULT;
                this.reorderBuffer.elements[this.reserveStationEntry[FunctionalUnitType.MEMORY][i].ROB].ready = true;
                // Remove the Reserve Station entry
                if (i === 0) {
                    this.reserveStationEntry[FunctionalUnitType.MEMORY].splice(i, 1);
                    i = 0;
                } else {
                    this.reserveStationEntry[FunctionalUnitType.MEMORY].splice(i, 1);
                }
            } else {
                i++;
            }
        }

        // Now it's time to retrieve all the results from the UF
        for (let i = 0; i < FUNCTIONALUNITTYPESQUANTITY; i++) {
            for (let j = 0; j < this.functionalUnitNumbers[i]; j++) {
                if (this.functionalUnit[i][j].status.stall === 0) {
                    this.writeInstruction(i, j);
                }
                // Update clocks of the uf
                this.functionalUnit[i][j].tic();
            }
        }
    }

    checkJump(rob: ReorderBufferEntry): boolean {
        // Check if the prediction was correct
        // Typescript does not support ^ operator for boolean
        if (+this.prediction(rob.instruction.id) ^ +(!!rob.value)) {
            this.changePrediction(rob.instruction.id, !!rob.value);
            // Change pc
            if (rob.value) {
                this.pc = this.code.getBasicBlockInstruction(rob.instruction.getOperand(2));
            } else {
                this.pc = rob.instruction.id + 1;
            }

            // Clean functional Units and Reserve Stations,
            // the total will help for clean the next objects
            let total = 0;
            for (let i = 0; i < FUNCTIONALUNITTYPESQUANTITY; i++) {
                for (let j = 0; j < this.functionalUnitNumbers[i]; j++) {
                    this.functionalUnit[i][j].clean();
                    this.reserveStationEntry[i] = new Array();
                }
                total += this.getReserveStationSize(i);
            }

            // Clean the alus for the address calculus
            for (let i = 0; i < this.functionalUnitNumbers[FunctionalUnitType.MEMORY]; i++) {
                this.aluMem[i].clean();
            }

            // Clean prefetch, decoder and reorder buffer, the simplest way is
            // to rebuild the objects
            this.prefetchUnit = new Queue<PrefetchEntry>();
            this.decoder = new Queue<DecoderEntry>();
            this.reorderBuffer = new Queue<ReorderBufferEntry>();
            this.reorderBuffer.init(total);
            this.decoder.init(this.issue);
            this.prefetchUnit.init(2 * this.issue);

            // Clean the structures related to the registers
            this.ROBGpr.fill(-1);
            this.ROBFpr.fill(-1);
            this._gpr.setAllBusy(false);
            this._fpr.setAllBusy(false);
            return false;
        }
        this.changePrediction(rob.instruction.id, !!rob.value);
        return true;
    }

    ticCommit(): CommitStatus {
        for (let i = 0; i < this.issue; i++) {
            if (this.reorderBuffer.isEmpty()) {
                return CommitStatus.SUPER_COMMITEND;
            } else if (!this.reorderBuffer.top().ready) {
                return CommitStatus.SUPER_COMMITNO;
            } else {
                let h = this.reorderBuffer.first;
                let aux: ReorderBufferEntry = this.reorderBuffer.remove();
                /* tslint:disable ter-indent */
                switch (aux.instruction.opcode) {
                    case Opcodes.SW:
                    case Opcodes.SF:
                        this.memory.setDatum(aux.address, aux.value);
                        break;
                    case Opcodes.BEQ:
                    case Opcodes.BNE:
                    case Opcodes.BGT:
                        if (!this.checkJump(aux)) {
                            return CommitStatus.SUPER_COMMITMISS;
                        }
                        break;
                    case Opcodes.ADD:
                    case Opcodes.ADDI:
                    case Opcodes.SUB:
                    case Opcodes.OR:
                    case Opcodes.AND:
                    case Opcodes.NOR:
                    case Opcodes.XOR:
                    case Opcodes.SLLV:
                    case Opcodes.SRLV:
                    case Opcodes.MULT:
                    case Opcodes.LW:
                        this._gpr.setContent(aux.destinyRegister, aux.value, false);
                        // R0 value is always 0
                        this._gpr.setContent(0, 0, false);
                        if (this.ROBGpr[aux.destinyRegister] === h) {
                            this._gpr.setBusy(aux.destinyRegister, false);
                        }
                        break;
                    case Opcodes.ADDF:
                    case Opcodes.MULTF:
                    case Opcodes.SUBF:
                    case Opcodes.LF:
                        this._fpr.setContent(aux.destinyRegister, aux.value, false);
                        if (this.ROBFpr[aux.destinyRegister] === h) {
                            this._fpr.setBusy(aux.destinyRegister, false);
                        }
                        break;
                    default:
                        break;
                }
                /* tslint:enable ter-indent */
            }
        }
        return CommitStatus.SUPER_COMMITOK;
    }

    tic(): SuperescalarStatus {
        this.status.cycle++;

        let commit = this.ticCommit();
        if (commit !== CommitStatus.SUPER_COMMITEND && commit !== CommitStatus.SUPER_COMMITMISS) {
            this.ticWriteResult();
            this.ticExecute();
        }

        let resultIssue = this.ticIssue();
        let resultDecoder = this.ticDecoder();
        let resultPrefetch = this.ticPrefetch();

        if ((resultIssue + resultDecoder + resultPrefetch === 0) &&
            (commit === CommitStatus.SUPER_COMMITEND)) {
            return SuperescalarStatus.SUPER_ENDEXE;
        }
        for (let i = this.prefetchUnit.first; i !== this.prefetchUnit.last; i = this.prefetchUnit.nextIterator(i)) {
            if (this.prefetchUnit.elements[i].instruction.breakPoint) {
                this.status.breakPoint = true;
                return SuperescalarStatus.SUPER_BREAKPOINT;
            }
        }
        return SuperescalarStatus.SUPER_OK;
    }

    changePrediction(address: number, result: boolean) {
        address = address % Superescalar.PREDTABLESIZE;
        /* tslint:disable ter-indent */
        switch (this.jumpPrediction[address]) {
            case 0: this.jumpPrediction[address] = (result) ? 1 : 0; break;
            case 1: this.jumpPrediction[address] = (result) ? 3 : 0; break;
            case 2: this.jumpPrediction[address] = (result) ? 3 : 0; break;
            case 3: this.jumpPrediction[address] = (result) ? 3 : 2; break;
            default: this.jumpPrediction[address] = 0; break;
        }
        /* tslint:enable ter-indent */
    }

    prediction(address: number): boolean {
        return (this.jumpPrediction[address % Superescalar.PREDTABLESIZE] >= 2);
    }

    public get code(): Code {
        return this._code;
    }

    public set code(value: Code) {
        this._code = value;
    }

    public get issue(): number {
        return this._issue;
    }

    public set issue(value: number) {
        this._issue = value;
    }

    public get ROBGpr(): number[] {
        return this._ROBGpr;
    }

    public set ROBGpr(value: number[]) {
        this._ROBGpr = value;
    }

    public get ROBFpr(): number[] {
        return this._ROBFpr;
    }

    public set ROBFpr(value: number[]) {
        this._ROBFpr = value;
    }

    public get reserveStationEntry(): ReserveStationEntry[][] {
        return this._reserveStationEntry;
    }

    public set reserveStationEntry(value: ReserveStationEntry[][]) {
        this._reserveStationEntry = value;
    }

    public get reorderBuffer(): Queue<ReorderBufferEntry> {
        return this._reorderBuffer;
    }

    public set reorderBuffer(value: Queue<ReorderBufferEntry>) {
        this._reorderBuffer = value;
    }

    public get prefetchUnit(): Queue<PrefetchEntry> {
        return this._prefetchUnit;
    }

    public set prefetchUnit(value: Queue<PrefetchEntry>) {
        this._prefetchUnit = value;
    }

    public get decoder(): Queue<DecoderEntry> {
        return this._decoder;
    }

    public set decoder(value: Queue<DecoderEntry>) {
        this._decoder = value;
    }

    public get aluMem(): FunctionalUnit[] {
        return this._aluMem;
    }

    public set aluMem(value: FunctionalUnit[]) {
        this._aluMem = value;
    }

    public get jumpPrediction(): number[] {
        return this._jumpPrediction;
    }

    public set jumpPrediction(value: number[]) {
        this._jumpPrediction = value;
    }

}
