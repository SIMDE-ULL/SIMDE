import { Machine } from '../Common/Machine';
import { Code }    from '../Common/Code';
import { Opcodes } from '../Common/Opcodes';
import { type FunctionalUnit, type FunctionalUnitResult, FunctionalUnitType, FUNCTIONALUNITTYPESQUANTITY } from '../Common/FunctionalUnit';
import { InstructionFetch } from './InstructionFetch';
import { InstructionDecode } from './InstructionDecode';
import { Execution } from './Execution';
import { MemoryStage } from './MemoryStage';
import { WriteBack } from './WriteBack';

export class Pipelined extends Machine {

    private static NPR = 64;
    private _if   : InstructionFetch;
    private _id   : InstructionDecode;
    private _ex   : Execution;
    private _mem  : MemoryStage;
    private _wb   : WriteBack;
    private _code : Code;

    public get code(): Code {
      return this._code;
    }

    public set code(value: Code) {
      this._code = value;
    }

    public get functionalUnitNumbers(): number[] {
        const numbers: number[] = [];
        for (let i = 0; i < FUNCTIONALUNITTYPESQUANTITY; i++) {
            numbers.push(this.functionalUnit[i].length);
        }
        return numbers;
    }

    constructor() {
        super();
    }

    public tic() {
    }

    public init(reset: boolean) {
        super.init(reset);
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

        const isFloat = [Opcodes.BEQF, Opcodes.BNEF, Opcodes.BGTF].includes(operation.opcode);
        const registerFile = isFloat ? this._fpr : this._gpr;
        const val0 = registerFile.content[operation.getOperand(0)];
        const val1 = registerFile.content[operation.getOperand(1)];

        let conditionMet: boolean;
        switch (operation.opcode) {
            case Opcodes.BEQ:
            case Opcodes.BEQF:
                conditionMet = val0 === val1;
                break;
            case Opcodes.BNE:
            case Opcodes.BNEF:
                conditionMet = val0 !== val1;
                break;
            case Opcodes.BGT:
            case Opcodes.BGTF:
                conditionMet = val0 > val1;
                break;
            default:
                throw new Error("Invalid jump operation: " + operation.opcode);
        }

        if (conditionMet) {
            newPC = operation.getOperand(2);
        } else {
            //this._predR[operation.getPredFalse()] = true;
        }

        return newPC;
    }

    private checkDependencies(row: number, id: number) {
        const checkGPR: Check[] = new Array(Machine.NGP);
        const checkFPR: Check[] = new Array(Machine.NFP);

        for (let i = 0; i < Machine.NGP; i++) {
            checkGPR[i].latency = 0;
        }

        for (let i = 0; i < Machine.NFP; i++) {
            checkFPR[i].latency = 0;
        }

        for (row = 0; row < this._code.getLargeInstructionNumber(); row++) {
            const instruction = this._code.getLargeInstruction(row);
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

}
