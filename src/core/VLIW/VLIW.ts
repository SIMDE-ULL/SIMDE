import { Machine } from '../Common/Machine';
import { Opcodes } from '../Common/Opcodes';
import { VLIWCode } from './VLIWCode';
import { FunctionalUnit, FunctionalUnitType, FUNCTIONALUNITTYPESQUANTITY } from '../Common/FunctionalUnit';
import { TCheck } from './TCheck';
import { Check } from './TCheck';
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

  private runOperation(operation: VLIWOperation, functionalUnit: FunctionalUnit) {
      switch(operation.opcode) {
        case Opcodes.ADD:
            this._gpr.setContent(operation.getOperand(0), this._gpr.getContent(operation.getOperand(1)) + this._gpr.getContent(operation.getOperand(2)), true);
            break;
        case Opcodes.MULT:
            this._gpr.setContent(operation.getOperand(0), this._gpr.getContent(operation.getOperand(1)) * this._gpr.getContent(operation.getOperand(2)), true);
            break;
        case Opcodes.ADDI:
            this._gpr.setContent(operation.getOperand(0), this._gpr.getContent(operation.getOperand(1)) + this._gpr.getContent(operation.getOperand(2)), true);
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
    if (this.status.cycle == 212) {
        console.log('Voy a saltar a ', this.pc, operation.opcode);
    }

    let newPC = this.pc;
    if (operation.opcode == Opcodes.BEQ) {
        if (this._gpr.getContent(operation.getOperand(0)) == this._gpr.getContent(operation.getOperand(1))) {
            newPC = operation.getOperand(2);
            this._predR[operation.getPredTrue()] = true;
            this._predR[operation.getPredFalse()] = false;
        } else {
            this._predR[operation.getPredTrue()] = false;
            this._predR[operation.getPredFalse()] = true;
        }
    } else if (operation.opcode == Opcodes.BNE) {
        if (this._gpr.getContent(operation.getOperand(0)) != this._gpr.getContent(operation.getOperand(1))) {
            newPC = operation.getOperand(2);
            this._predR[operation.getPredTrue()] = true;
            this._predR[operation.getPredFalse()] = false;
        } else {
            this._predR[operation.getPredTrue()] = false;
            this._predR[operation.getPredFalse()] = true;
        }
    }
    return newPC;
  }
/**********************************************************/
  private checkDependencies(row: number,id: number) {
    let chkGPR: Check[] = new Array(Machine.NGP);
    let chkFPR: Check[] = new Array(Machine.NFP);

    for (let i = 0; i < Machine.NGP; i++) {
        chkGPR[i].latency = 0;
    }

    for (let i = 0; i < Machine.NFP; i++) {
        chkFPR[i].latency = 0;
    }

    for (row = 0; row < this._code.getInstructionNumber(); row++) {
        let instruction = this._code.getLargeInstruction(row);
        for (let j = 0; j < instruction.getNOper(); j++) {
            TCheck.checkTargetOperation(instruction.getOperation(j), chkGPR, chkFPR, this._functionalUnitLatencies);
        }
        for (let j = 0; j < instruction.getNOper(); j++) {
            if (!TCheck.checkSourceOperands(instruction.getOperation(j), chkGPR, chkFPR)) {
                id = instruction.getOperation(j).id;
                throw VLIWError.ERRRAW; //VLIW_ERRRA;
            }
        }
        for (let i = 0; i < VLIW.NGP; i++) {
            if (chkGPR[i].latency > 0)
                chkGPR[i].latency--;
        }
        for (let i = 0; i < VLIW.NFP; i++) {
            if (chkFPR[i].latency > 0)
                chkFPR[i].latency--;
        }
    }
    throw VLIWError.ERRNO; //VLIW_ERRNO;
  }

  private checkPredicate(row: number, id: number) {
    let controlCheckList: Check[]; //list<TChequeo> checkPredicate;
    for (row = 0; row < this._code.getInstructionNumber(); row++) {
        let index = 0;
        while (index < controlCheckList.length) {
            if (controlCheckList[index].latency == 1) {
                controlCheckList.splice(index, 1);
            } else {
                controlCheckList[index].latency--;
                index++;
            }
        }
        let instruction = this._code.getLargeInstruction(row);
        for (let j = 0; j < instruction.getNOper(); j++)
            if (instruction.getOperation(j).getTipoUF() == FunctionalUnitType.JUMP) {
                let chk1: Check;
                let chk2: Check;
                chk1.latency = this._functionalUnitLatencies[FunctionalUnitType.JUMP];
                chk2.latency = this._functionalUnitLatencies[FunctionalUnitType.JUMP];
                chk1.register = instruction.getOperation(j).getPredTrue();
                chk2.register = instruction.getOperation(j).getPredFalse();
                controlCheckList.push(chk1);
                controlCheckList.push(chk2);
            }

        for (let j = 0; j < instruction.getNOper(); j++)
            if (instruction.getOperation(j).getPred() != 0) {
                // TODO quizas index no es 0?
                for (index = 0; index < controlCheckList.length; index++)
                    if (instruction.getOperation(j).getPred() == controlCheckList[index].register)
                        break;
                if (index == controlCheckList.length){
                    id = instruction.getOperation(j).id;
                    for(let i = 0; i < controlCheckList.length; i++) {
                        controlCheckList[i].latency = 0;
                        controlCheckList[i].register = 0;

                    }
                    throw VLIWError.ERRPRED; //VLIW_ERRPRED;
                }
                else if (this._functionalUnitLatencies[instruction.getOperation(j).getTipoUF()] < controlCheckList[index].latency) {
                    id = instruction.getOperation(j).id;
                    for(let i = 0; i < controlCheckList.length; i++) {
                        controlCheckList[i].latency = 0;
                        controlCheckList[i].register = 0;
                    }
                    throw VLIWError.ERRBRANCHDEP; //VLIW_ERRBRANCHDEP;
                }
            }
    }
    for(let i = 0; i < controlCheckList.length; i++) {
        controlCheckList[i].latency = 0;
        controlCheckList[i].register = 0;
    }
    throw VLIWError.ERRNO; //VLIW_ERRNO;
  }

  //Getters
    public getPredReg(index?: number): boolean[] {
        if (index) 
        {
            this._predR[index];
        }
        return this._predR; 
    }
    public getNaTGP(index?: number): boolean[] {
        if (index) 
        {
            this._NaTGP[index];
        }
        return this._NaTGP; 
    }
    public getNaTFP(index?: number): boolean[] {
        if (index) 
        {
            this._NaTFP[index];
        }
        return this._NaTFP; 
    }

    public get code(): VLIWCode { 
        return this._code;
    }

    public set code(code: VLIWCode) {
        this._code = code;
    }

    // Setters
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
        this._functionalUnitNumbers[index] = (index == FunctionalUnitType.JUMP) ? 1 : n;
    }

    public chkCode() {
        for (let i = 0; i < this._code.getInstructionNumber(); i++) {
            let instruction = this._code.getLargeInstruction(i);
            for (let j = 0; j < instruction.getNOper(); j++) {
                let operation = instruction.getOperation(j);
                if (operation.getNumUF() >= this.functionalUnitNumbers[operation.getTipoUF()])
                    throw VLIWError.ERRHARD; //VLIW_ERRHARD;
            }
        }
        throw VLIWError.ERRNO; //VLIW_ERRNO;
    }

    public checkError(row: number, id: number) {
        try {
        this.checkDependencies(row, id);
        }
        catch(error) {
        if (error != VLIWError.ERRNO) {
            throw error;
        }
        }
        this.checkPredicate(row, id);
    }

    public tic() {

        let i, j;
        let pending: boolean = false;
        let stopFlow: boolean = false;
        this.status.cycle++;
         

        // TODO remove
        if (this.status.cycle > 212) {
            throw 0;
        }

        if (this.functionalUnit[FunctionalUnitType.JUMP][0].hasPendingInstruction()) {
            pending = true;
        }

        if (this.status.cycle == 212) {
            console.log('Stall de la uf de salto', this.functionalUnit[FunctionalUnitType.JUMP][0].status.stall);
        }
    
        if (this.functionalUnit[FunctionalUnitType.JUMP][0].status.stall == 0) {
        
            let operation = this.functionalUnit[FunctionalUnitType.JUMP][0].getTopInstruction();
            
            
            if (this.status.cycle == 212) {
                console.log('Operation from uf salto', operation);
            }

            if (operation != null) {

                const vliwOperation = new VLIWOperation(null, 
                    operation, 
                    FunctionalUnitType.JUMP, 
                    0); // TODO: revisar si esto aqui es un 0 o hay que poner this._functionalUnitNumbers[FunctionalUnitType.JUMP]
        
                    if (this._predR[vliwOperation.getPred()]) {
                        this.pc = this.runJump(vliwOperation);
                    }   
            }
        }

        this.functionalUnit[FunctionalUnitType.JUMP][0].tic();

        for (i = 0; i < FUNCTIONALUNITTYPESQUANTITY - 1; i++) {

            if (this.status.cycle == 212) {
                console.log('This functional unit number', this._functionalUnitNumbers);
            }

            for (j = 0; j < this._functionalUnitNumbers[i]; j++) {

                
                if (this.status.cycle == 212) {
                    console.log(this.functionalUnit[i][j].hasPendingInstruction());
                    console.log(this.functionalUnit[i][j]);
                }

                if (this.functionalUnit[i][j].hasPendingInstruction()) {
                    pending = true;
                }

                if (this._functionalUnit[i][j].status.stall == 0) {
                    let operation = this.functionalUnit[i][j].getTopInstruction();

                    if (operation != null) {
                        const vliwOperation = new VLIWOperation(null, 
                            operation, 
                            FunctionalUnitType.JUMP, 
                            0); // TODO: revisar si esto aqui es un 0 o hay que poner this._functionalUnitNumbers[FunctionalUnitType.JUMP]

                        if (this._predR[vliwOperation.getPred()]) {
                            this.runOperation(vliwOperation, this.functionalUnit[i][j]);
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

            if (instruction == null) {

                if (pending) {
                    return VLIWError.PCOUTOFRANGE;
                }

                return VLIWError.ENDEXE;
            }

            for (i = 0; i < instruction.getNOper(); i++) {

                let type = instruction.getOperation(i).getTipoUF();
                let number = instruction.getOperation(i).getNumUF();

                if (!this.functionalUnit[type][number].isFree() || TCheck.checkNat(instruction.getOperation(i), this._NaTGP, this._NaTFP)) {
                    stopFlow = true;
                    break;
                }
            }

            if (!stopFlow) {

                for (i = 0; i < instruction.getNOper(); i++) {

                    let operation = instruction.getOperation(i);
                    this.functionalUnit[operation.getTipoUF()][operation.getNumUF()].fillFlow(operation);

                    if (operation.opcode == Opcodes.LW) {
                        this._NaTGP[operation.getOperand(0)] = true;
                    }

                    if (operation.opcode == Opcodes.LF) {
                        this._NaTFP[operation.getOperand(0)] = true;
                    }

                    if (operation.getTipoUF() == FunctionalUnitType.JUMP) {
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
}

