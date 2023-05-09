import { Machine } from '../Common/Machine';
import { Opcodes } from '../Common/Opcodes';
import { VLIWCode } from './VLIWCode';
import { FunctionalUnit, FunctionalUnitType, FUNCTIONALUNITTYPESQUANTITY } from '../Common/FunctionalUnit';
import { DependencyChecker, Check } from './DependencyChecker';
import { VLIWError } from './VLIWError';
import { Datum } from '../Common/Memory';
import { VLIWOperation } from './VLIWOperation';

export class VLIW extends Machine {

    private static NPR = 64;
    private _predR: boolean[] = new Array(VLIW.NPR);
    private _NaTGP: boolean[] = new Array(Machine.NGP);
    private _NaTFP: boolean[] = new Array(Machine.NFP);
    private _code: VLIWCode;

    constructor() {
        super();
        this._code = new VLIWCode();
        this._predR = new Array(VLIW.NPR);
        this._predR.fill(false);
        this._predR[0] = true;
        this._NaTGP = new Array(Machine.NGP);
        this._NaTGP.fill(false);
        this._NaTFP = new Array(Machine.NFP);
        this._NaTFP.fill(false);
    }

    public getPredReg(index?: number): boolean[] | boolean {
        return index ? this._predR[index] : this._predR;
    }
    public getNaTGP(index?: number): boolean[] | boolean {
        return index ? this._NaTGP[index] : this._NaTGP;
    }
    public getNaTFP(index?: number): boolean[] | boolean {
        return (index) ? this._NaTFP[index] : this._NaTFP;
    }

    public get code(): VLIWCode {
        return this._code;
    }

    public set code(code: VLIWCode) {
        this._code = code;
    }

    //  Setters
    public setPredReg(index: number, p: boolean) {
        this._predR[index] = p;
    }

    public setNaTGP(index: number, n: boolean) {
        this._NaTGP[index] = n;
    }

    public setNaTFP(index: number, n: boolean) {
        this._NaTFP[index] = n;
    }

    public setNUF(index: number, n: number) {
        this._functionalUnitNumbers[index] = (index === FunctionalUnitType.JUMP) ? 1 : n;
    }

    //TODO: These checks functions are never used
    public checkCode() {
        for (let i = 0; i < this._code.getLargeInstructionNumber(); i++) {
            let instruction = this._code.getLargeInstruction(i);
            for (let j = 0; j < instruction.getVLIWOperationsNumber(); j++) {
                let operation = instruction.getOperation(j);
                if (operation.getFunctionalUnitIndex() >= this.functionalUnitNumbers[operation.getFunctionalUnitType()]) {
                    throw VLIWError.ERRHARD; // VLIW_ERRHARD;
                }
            }
        }
        throw VLIWError.ERRNO; // VLIW_ERRNO;
    }

    public checkDependenciesError(row: number, id: number) {
        try {
            this.checkDependencies(row, id);
        } catch (error) {
            if (error !== VLIWError.ERRNO) {
                throw new Error('Dependencies Error: ' + error);
            } else {
                return VLIWError.ERRNO;
            }
        }
    }

    public checkPredicateError(row: number, id: number) {
        try {
            this.checkPredicate(row, id);
        } catch (error) {
            if (error !== VLIWError.ERRNO) {
                throw new Error('Predicate Error: ' + error);;
            } else {
                return VLIWError.ERRNO;
            }
        }     
    }

    public tic() {

        let i;
        let j;
        let pending: boolean = false;
        let stopFlow: boolean = false;
        this.status.cycle++;

        if (this.functionalUnit[FunctionalUnitType.JUMP][0].hasPendingInstruction()) {
            pending = true;
        }

        if (this.functionalUnit[FunctionalUnitType.JUMP][0].status.stall === 0) {

            let operation: any = this.functionalUnit[FunctionalUnitType.JUMP][0].getTopInstruction();
            if (operation != null) {
                if (this._predR[operation.getPred()]) {
                    this.pc = this.runJump(operation);
                }
            }
        }

        this.functionalUnit[FunctionalUnitType.JUMP][0].tic();

        for (i = 0; i < FUNCTIONALUNITTYPESQUANTITY - 1; i++) {
            for (j = 0; j < this._functionalUnitNumbers[i]; j++) {

                if (this.functionalUnit[i][j].hasPendingInstruction()) {
                    pending = true;
                }
                if (this._functionalUnit[i][j].status.stall === 0) {

                    let operation: any = this.functionalUnit[i][j].getTopInstruction();

                    if (operation != null) {
                        if (this._predR[operation.getPred()]) {
                            this.runOperation(operation, this.functionalUnit[i][j]);
                        }
                    }
                }
                this.functionalUnit[i][j].tic();
            }
        }

        this._gpr.tic();
        this._fpr.tic();

        if (!stopFlow) {

            let instruction = this._code.getLargeInstruction(this.pc);

            if (!instruction) {

                if (pending) {
                    return VLIWError.PCOUTOFRANGE;
                }

                return VLIWError.ENDEXE;
            }

            for (i = 0; i < instruction.getVLIWOperationsNumber(); i++) {

                let type = instruction.getOperation(i).getFunctionalUnitType();
                let index = instruction.getOperation(i).getFunctionalUnitIndex();

                if (!this.functionalUnit[type][index].isFree() ||
                    DependencyChecker.checkNat(instruction.getOperation(i), this._NaTGP, this._NaTFP)) {
                    //TODO: This really fails when there is a RAW dependency?
                    return VLIWError.ERRRAW; // VLIW_ERRRA;
                }
            }

            if (!stopFlow) {

                for (i = 0; i < instruction.getVLIWOperationsNumber(); i++) {

                    let operation = instruction.getOperation(i);
                    this.functionalUnit[operation.getFunctionalUnitType()][operation.getFunctionalUnitIndex()].fillFlow(operation);

                    if (operation.opcode === Opcodes.LW) {
                        this._NaTGP[operation.getOperand(0)] = true;
                    }

                    if (operation.opcode === Opcodes.LF) {
                        this._NaTFP[operation.getOperand(0)] = true;
                    }

                    if (operation.getFunctionalUnitType() === FunctionalUnitType.JUMP) {
                        this._predR[operation.getPredTrue()] = false;
                        this._predR[operation.getPredFalse()] = false;
                    }
                }
                this.pc++;
            }

            if (instruction.getBreakPoint()) {
                this.status.breakPoint = true;
                return VLIWError.BREAKPOINT;
            }
        }
        return VLIWError.OK;

    }

    public init(reset: boolean) {
        super.init(reset);
        this._NaTGP = new Array(Machine.NGP);
        this._NaTGP.fill(false);
        this._NaTFP = new Array(Machine.NFP);
        this._NaTFP.fill(false);
        this._predR = new Array(VLIW.NPR);
        this._predR.fill(false);
        this._predR[0] = true;
    }

    private runOperation(operation: VLIWOperation, functionalUnit: FunctionalUnit) {
        switch (operation.opcode) {
            case Opcodes.ADD:
                this._gpr.setContent(operation.getOperand(0), this._gpr.getContent(operation.getOperand(1)) + this._gpr.getContent(operation.getOperand(2)), true);
                break;
            case Opcodes.MULT:
                this._gpr.setContent(operation.getOperand(0), this._gpr.getContent(operation.getOperand(1)) * this._gpr.getContent(operation.getOperand(2)), true);
                break;
            case Opcodes.ADDI:
                this._gpr.setContent(operation.getOperand(0), this._gpr.getContent(operation.getOperand(1)) + operation.getOperand(2), true);
                break;
            case Opcodes.ADDF:
                this._fpr.setContent(operation.getOperand(0), this._fpr.getContent(operation.getOperand(1)) + this._fpr.getContent(operation.getOperand(2)), true);
                break;
            case Opcodes.MULTF:
                this._fpr.setContent(operation.getOperand(0), this._fpr.getContent(operation.getOperand(1)) * this._fpr.getContent(operation.getOperand(2)), true);
                break;
            case Opcodes.SW:
                this._memory.setDatum(this._gpr.getContent(operation.getOperand(2)) + operation.getOperand(1), this._gpr.getContent(operation.getOperand(0)));
                break;
            case Opcodes.SF:
                this._memory.setDatum(this._gpr.getContent(operation.getOperand(2)) + operation.getOperand(1), this._fpr.getContent(operation.getOperand(0)));
                break;
            case Opcodes.LW:
                let datumInteger: Datum = this._memory.getDatum(this._gpr.getContent(operation.getOperand(2)) + operation.getOperand(1));
                if (!datumInteger.got) {
                    functionalUnit.status.stall = this._memoryFailLatency - functionalUnit.latency;
                } else {
                    this._gpr.setContent(operation.getOperand(0), datumInteger.datum, true);
                    this._NaTGP[operation.getOperand(0)] = false;
                }
                break;
            case Opcodes.LF:
                let datumFloat: Datum = this._memory.getDatum(this._gpr.getContent(operation.getOperand(2)) + operation.getOperand(1));
                if (!datumFloat.got) {
                    functionalUnit.status.stall = this._memoryFailLatency - functionalUnit.latency;
                } else {
                    this._fpr.setContent(operation.getOperand(0), datumFloat.datum, true);
                    this._NaTFP[operation.getOperand(0)] = false;
                }
                break;
            default:
                break;
        }
        this._gpr.setContent(0, 0, true);
        this._predR[0] = true;
    }

    private runJump(operation: VLIWOperation): number {

        let newPC = this.pc;
        if (operation.opcode === Opcodes.BEQ) {
            if (this._gpr.getContent(operation.getOperand(0)) === this._gpr.getContent(operation.getOperand(1))) {
                newPC = operation.getOperand(2);
                this._predR[operation.getPredTrue()] = true;
                this._predR[operation.getPredFalse()] = false;
            } else {
                this._predR[operation.getPredTrue()] = false;
                this._predR[operation.getPredFalse()] = true;
            }
        } else if (operation.opcode === Opcodes.BNE) {
            if (this._gpr.getContent(operation.getOperand(0)) !== this._gpr.getContent(operation.getOperand(1))) {
                newPC = operation.getOperand(2);
                this._predR[operation.getPredTrue()] = true;
                this._predR[operation.getPredFalse()] = false;
            } else {
                this._predR[operation.getPredTrue()] = false;
                this._predR[operation.getPredFalse()] = true;
            }
        } else if (operation.opcode === Opcodes.BGT) {
            if (this._gpr.getContent(operation.getOperand(0)) > this._gpr.getContent(operation.getOperand(1))) {
                newPC = operation.getOperand(2);
                this._predR[operation.getPredTrue()] = true;
                this._predR[operation.getPredFalse()] = false;
            } else {
                this._predR[operation.getPredTrue()] = false;
                this._predR[operation.getPredFalse()] = true;
            }
        } else {
            throw new Error("Invalid jump operation: " + operation.opcode);
        }
        return newPC;
    }

    private checkDependencies(row: number, id: number) {
        let checkGPR: Check[] = new Array(Machine.NGP);
        let checkFPR: Check[] = new Array(Machine.NFP);

        for (let i = 0; i < Machine.NGP; i++) {
            checkGPR[i].latency = 0;
        }

        for (let i = 0; i < Machine.NFP; i++) {
            checkFPR[i].latency = 0;
        }

        for (row = 0; row < this._code.getLargeInstructionNumber(); row++) {
            let instruction = this._code.getLargeInstruction(row);
            for (let j = 0; j < instruction.getVLIWOperationsNumber(); j++) {
                DependencyChecker.checkTargetOperation(instruction.getOperation(j), checkGPR, checkFPR, this._functionalUnitLatencies);
            }
            for (let j = 0; j < instruction.getVLIWOperationsNumber(); j++) {
                if (!DependencyChecker.checkSourceOperands(instruction.getOperation(j), checkGPR, checkFPR)) {
                    id = instruction.getOperation(j).id;
                    throw VLIWError.ERRRAW; // VLIW_ERRRA;
                }
            }
            for (let i = 0; i < VLIW.NGP; i++) {
                if (checkGPR[i].latency > 0) {
                    checkGPR[i].latency--;
                }
            }
            for (let i = 0; i < VLIW.NFP; i++) {
                if (checkFPR[i].latency > 0) {
                    checkFPR[i].latency--;
                }
            }
        }
        throw VLIWError.ERRNO; // VLIW_ERRNO;
    }

    private checkPredicate(row: number, id: number) {
        let controlCheckList: Check[]; // list<TChequeo> checkPredicate;
        for (row = 0; row < this._code.getLargeInstructionNumber(); row++) {
            let index = 0;
            while (index < controlCheckList.length) {
                if (controlCheckList[index].latency === 1) {
                    controlCheckList.splice(index, 1);
                } else {
                    controlCheckList[index].latency--;
                    index++;
                }
            }
            let instruction = this._code.getLargeInstruction(row);
            for (let j = 0; j < instruction.getVLIWOperationsNumber(); j++) {
                if (instruction.getOperation(j).getFunctionalUnitType() === FunctionalUnitType.JUMP) {
                    let check1: Check;
                    let check2: Check;
                    check1.latency = this._functionalUnitLatencies[FunctionalUnitType.JUMP];
                    check2.latency = this._functionalUnitLatencies[FunctionalUnitType.JUMP];
                    check1.register = instruction.getOperation(j).getPredTrue();
                    check2.register = instruction.getOperation(j).getPredFalse();
                    controlCheckList.push(check1);
                    controlCheckList.push(check2);
                }
            }
            for (let j = 0; j < instruction.getVLIWOperationsNumber(); j++) {
                if (instruction.getOperation(j).getPred() !== 0) {
                    for (index = 0; index < controlCheckList.length; index++) {
                        if (instruction.getOperation(j).getPred() === controlCheckList[index].register) {
                            break;
                        }
                    }
                    if (index === controlCheckList.length) {
                        id = instruction.getOperation(j).id;
                        for (let i = 0; i < controlCheckList.length; i++) {
                            controlCheckList[i].latency = 0;
                            controlCheckList[i].register = 0;
                        }
                        throw VLIWError.ERRPRED; // VLIW_ERRPRED;
                    } else if (this._functionalUnitLatencies[instruction.getOperation(j).getFunctionalUnitType()] < controlCheckList[index].latency) {
                        id = instruction.getOperation(j).id;
                        for (let i = 0; i < controlCheckList.length; i++) {
                            controlCheckList[i].latency = 0;
                            controlCheckList[i].register = 0;
                        }
                        throw VLIWError.ERRBRANCHDEP; // VLIW_ERRBRANCHDEP;
                    }
                }
            }
        }
        for (let i = 0; i < controlCheckList.length; i++) {
            controlCheckList[i].latency = 0;
            controlCheckList[i].register = 0;
        }
        throw VLIWError.ERRNO; // VLIW_ERRNO;
    }

}
