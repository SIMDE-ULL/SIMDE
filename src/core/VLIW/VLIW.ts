import { Machine } from '../Common/Machine';
import { Opcodes } from '../Common/Opcodes';
import { VLIWCode } from './VLIWCode';
import { FunctionalUnit, FunctionalUnitResult, FunctionalUnitType, FUNCTIONALUNITTYPESQUANTITY } from '../Common/FunctionalUnit';
import { DependencyChecker, Check } from './DependencyChecker';
import { VLIWError } from './VLIWError';
import { VLIWOperation } from './VLIWOperation';

export class VLIW extends Machine {

    private static NPR = 64;
    private _predR: boolean[] = new Array(VLIW.NPR);
    private _NaTGP: boolean[] = new Array(Machine.NGP);
    private _NaTFP: boolean[] = new Array(Machine.NFP);
    private _code: VLIWCode;

    public get functionalUnitNumbers(): number[] {
        let numbers: number[] = [];
        for (let i = 0; i < FUNCTIONALUNITTYPESQUANTITY; i++) {
            numbers.push(this.functionalUnit[i].length);
        }
        return numbers;
    }

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

    //TODO: These checks functions are never used
    public checkCode() {
        for (let i = 0; i < this._code.getLargeInstructionNumber(); i++) {
            let instruction = this._code.getLargeInstruction(i);
            for (let j = 0; j < instruction.getVLIWOperationsNumber(); j++) {
                let operation = instruction.getOperation(j);
                if (operation.getFunctionalUnitIndex() >= this.functionalUnit[operation.getFunctionalUnitType()].length) {
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
        this.status.cycle++;

        if (!this.functionalUnit[FunctionalUnitType.JUMP][0].isEmpty()) {
            pending = true;
        }

        if (!this.functionalUnit[FunctionalUnitType.JUMP][0].isStalled()) {

            let execution = this.functionalUnit[FunctionalUnitType.JUMP][0].executeReadyInstruction();
            let operation: any = (execution != null) ? execution.instruction : null;
            if (operation != null) {
                if (this._predR[operation.getPred()]) {
                    this.pc = this.runJump(operation);
                }
            }
        }

        this.functionalUnit[FunctionalUnitType.JUMP][0].tic();

        // check for stalled functional units
        let hasStalledFU = false;
        for (i = 0; i < FUNCTIONALUNITTYPESQUANTITY - 1; i++) {
            for (j = 0; j < this.functionalUnit[i].length; j++) {
                if (this.functionalUnit[i][j].isStalled()) {
                    hasStalledFU = true;
                    this.functionalUnit[i][j].tic();
                }
            }
        }

        // dont continue if there are stalled functional units
        if (hasStalledFU) {
            return VLIWError.OK;
        }


        for (i = 0; i < FUNCTIONALUNITTYPESQUANTITY - 1; i++) {
            for (j = 0; j < this.functionalUnit[i].length; j++) {
                if (!this.functionalUnit[i][j].isEmpty()) {
                    pending = true;
                }

                const instToExecute = this.functionalUnit[i][
                  j
                ].getReadyInstruction() as VLIWOperation;

                if (instToExecute && this._predR[instToExecute.getPred()]) {
                  const registerFile = instToExecute.isDestinyRegisterFloat()
                    ? this._fpr
                    : this._gpr;
                  const firstOperand =
                    registerFile.content[
                      instToExecute.getFirstOperandRegister()
                    ];
                  const secondOperand = instToExecute.hasImmediateOperand()
                    ? instToExecute.getImmediateOperand()
                    : registerFile.content[
                        instToExecute.getSecondOperandRegister()
                      ];
                  const execution = this.functionalUnit[i][
                    j
                  ].executeReadyInstruction(firstOperand, secondOperand);
                  this.runOperation(execution, this.functionalUnit[i][j]);
                }

                this.functionalUnit[i][j].tic();
            }
        }

        this._gpr.tic();
        this._fpr.tic();

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

            // Check if the functional unit exists or if this operation is out of bounds
            if (index >= this.functionalUnit[type].length) {
                //TODO: better handling of this error
                return VLIWError.ERRHARD; // VLIW_ERRHARD;
            }

            if (!this.functionalUnit[type][index].isFree() ||
                DependencyChecker.checkNat(instruction.getOperation(i), this._NaTGP, this._NaTFP)) {
                //TODO: This really fails when there is a RAW dependency?
                return VLIWError.ERRRAW; // VLIW_ERRRA;
            }
        }


        for (i = 0; i < instruction.getVLIWOperationsNumber(); i++) {
            let operation = instruction.getOperation(i);
            this.functionalUnit[operation.getFunctionalUnitType()][operation.getFunctionalUnitIndex()].addInstruction(operation);

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

        if (instruction.getBreakPoint()) {
            this.status.breakPoint = true;
            return VLIWError.BREAKPOINT;
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

    private runOperation(execution: FunctionalUnitResult, functionalUnit: FunctionalUnit) {
        const operation = execution.instruction;
        const registerFile = operation.isDestinyRegisterFloat()
          ? this._fpr
          : this._gpr;

        if (operation.isLoadInstruction()) {
          // load and stores are a special cases, because they need to access the memory
          const natFile = operation.isDestinyRegisterFloat()
            ? this._NaTFP
            : this._NaTGP;
          const datum = this._memory.getData(
            this._gpr.content[operation.getSecondOperandRegister()] +
              operation.getAddressOperand(),
          );

          //hack: as we dont have a well made error handling, intercept the error and just throw it
          if (datum instanceof Error) {
            throw datum;
          }

          if (this._cache && !this._cache.success) {
            functionalUnit.stall(
              this._memoryFailLatency - functionalUnit.latency,
            );
          }

          registerFile.setContent(operation.getDestinyRegister(), datum, true);
          natFile[operation.getDestinyRegister()] = false;
        } else if (operation.isStoreInstruction()) {
          this._memory.setData(
            this._gpr.content[operation.getSecondOperandRegister()] +
              operation.getAddressOperand(),
            registerFile.content[operation.getFirstOperandRegister()],
          );
        } else {
          // if the operation is not a load or store, then it is a register operation
          registerFile.setContent(
            operation.getDestinyRegister(),
            execution.result,
            true,
          );
        }

        // this is a old undocumented hack probably to avoid the 0 predication register to be set to false
        this._predR[0] = true;
    }

    private runJump(operation: VLIWOperation): number {

        let newPC = this.pc;
        if (operation.opcode === Opcodes.BEQ) {
            if (this._gpr.content[operation.getOperand(0)] === this._gpr.content[operation.getOperand(1)]) {
                newPC = operation.getOperand(2);
                this._predR[operation.getPredTrue()] = true;
                this._predR[operation.getPredFalse()] = false;
            } else {
                this._predR[operation.getPredTrue()] = false;
                this._predR[operation.getPredFalse()] = true;
            }
        } else if (operation.opcode === Opcodes.BNE) {
            if (this._gpr.content[operation.getOperand(0)] !== this._gpr.content[operation.getOperand(1)]) {
                newPC = operation.getOperand(2);
                this._predR[operation.getPredTrue()] = true;
                this._predR[operation.getPredFalse()] = false;
            } else {
                this._predR[operation.getPredTrue()] = false;
                this._predR[operation.getPredFalse()] = true;
            }
        } else if (operation.opcode === Opcodes.BGT) {
            if (this._gpr.content[operation.getOperand(0)] > this._gpr.content[operation.getOperand(1)]) {
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
                //TODO
                //DependencyChecker.checkTargetOperation(instruction.getOperation(j), checkGPR, checkFPR, this._functionalUnitLatencies);
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
                    check1.latency = this.functionalUnit[FunctionalUnitType.JUMP].length;
                    check2.latency = this.functionalUnit[FunctionalUnitType.JUMP].length;
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
                    } else if (this.functionalUnit[instruction.getOperation(j).getFunctionalUnitType()].length < controlCheckList[index].latency) {
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
