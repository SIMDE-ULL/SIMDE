import { Machine } from '../Common/Machine';
import { Code } from '../Common/Code';
import { Opcodes } from '../Common/Opcodes';
import { TCodigoVLIW } from './TCodigoVLIW';
import { LargeInstruction } from './LargeInstruction';
import { FunctionalUnit } from '../Common/FunctionalUnit';
import { TOperacionVLIW } from './TOperacionVLIW';
import { TCheck } from './TCheck';
import { Exception } from './TExeption';

export class TMaquinaVLIW extends Machine {

  const static NPR = 64;
  private _predR[NPR]: boolean;
  private _NaTGP[NGP]: boolean;
  private _NaTFP[NFP]: boolean;
  private _code: Code;

  constructor() {
      super();
      //register int i
      _code = new TCodigoVLIW();
      this._predR = new Array(Machine.NPR);  // memset(predR, false, sizeof(bool) * NPR);
      this._predR.fill(-1);
      this._predR[0] = true;
      this._NaTGP = new Array(Machine.NGP);
      this._NaTGP.fill(-1);
      this._NaTFP = new Array(Machine.NFP);
      this._NaTFP.fill(-1);
  }

  private chkNaT(operation: TOperationVLIW): boolean {
      let result;
      switch(operation.opcode) {
          case Opcodes.ADD:
          case Opcodes.MULT:
            result = _NaTGP[operation.getOperand(1)] || _NaTGP[operation.getOperand(2)];
            break;
        case Opcodes.ADDI:
            result = _NaTGP[operation.getOperand(1)];
            break;
        case Opcodes.ADDF:
        case Opcodes.MULTF:
            result = _NaTFP[operation.getOperand(1)] || _NaTFP[operation.getOperand(2)];
            break;
        case Opcodes.SW:
            result = _NaTGP[operation.getOperand(0)] || _NaTGP[operation.getOperand(2)];
            break;
        case Opcodes.SF:
            result = _NaTFP[operation.getOperand(0)] || _NaTGP[operation.getOperand(2)];
            break;
        case Opcodes.LW:
        case Opcodes.LF:
            result = _NaTGP[operation.getOperand(2)];
            break;
        case Opcodes.BEQ:
        case Opcodes.BNE:
            result = _NaTGP[operation.getOperand(0)] || _NaTGP[operation.getOperand(1)];
            break;
        default:
            result = true;
            break;
      }
      return result;
  }

  private runOperation(operation: TOperationVLIW, uf: FunctionalUnit) {
      switch(operation.opcode) {
        case Opcodes.ADD:
            _gpr.setContent(operation.getOperand(0), _gpr.getContent(operation.getContent(1)) + _gpr.getContent(operation.getContent(2)), true);
            break;
        case Opcodes.MULT:
            _gpr.setContent(operation.getOperand(0), _gpr.getContent(operation.getContent(1)) * _gpr.getContent(operation.getContent(2)), true);
            break;
        case Opcodes.ADDI:
            _gpr.setContent(operation.getOperand(0), _gpr.getContent(operation.getContent(1)) + _gpr.getContent(operation.getContent(2)), true);
            break;
        case Opcodes.ADDF:
            _fpr.setContent(operation.getOperand(0), _fpr.getContent(operation.getContent(1)) + _fpr.getContent(operation.getContent(2)), true);
            break;
        case Opcodes.MULTF:
            _fpr.setContent(operation.getOperand(0), _fpr.getContent(operation.getContent(1)) * _fpr.getContent(operation.getContent(2)), true);
            break;
        case Opcodes.SW:
            _memory.setDatum(_gpr.getContent(operation.getOperand(2)) + operation.getOperand(1), _gpr.getOperand(operation.getOperand(0)));
            break;
        case Opcodes.SF:
            _memory.setDatum(_gpr.getContent(operation.getOperand(2)) + operation.getOperand(1), _fpr.getContent(operation.getOperand(0)));
            break;
        case Opcodes.LW:
            let datoI;
            if (!memory.getDatum(_gpr.getContent(operation.getOperand(2)) + operation.getOperand(1), datoI)) {
                FunctionalUnit._status.stall(latFalloMem - FunctionalUnit.latency());
            } else {
                _gpr.setContent(operation.getOperand(0), datoI, true);
                _NaTGP[operation.getOperand(0)] = false;
            }
            break;
        case Opcodes.LF:
            let datoF;
            if (!memory.getDatum(_gpr.getContent(operation.getOperand(2)) + operation.getOperand(1), datoF)) {
                FunctionalUnit._status.stall(latFalloMem - FunctionalUnit.latency());
            } else {
                _fpr.setContent(operation.getOperand(0), datoF, true);
                _NaTFP[operation.getOperand(0)] = false;
            }
            break;
        default:
            break;
      }
      _gpr.setContent(0, 0, true);
      _predR[0] = true;
  }

  private runJump(operation: TOperationVLIW): number {
    let newPC = this.pc(); //let newPC = PC;
    if (operation.opcode == Opcode.BEQ) {
        if (_gpr.getContent(operation.getOperand(0)) == _gpr.getContent(operation.getOperand(1))) {
            newPC = operation.getOperand(2);
            _predR[operation.getPredTrue()] = true;
            _predR[operation.getPredFalse()] = false;
        } else {
            _predR[operation.getPredTrue()] = false;
            _predR[operation.getPredFalse()] = true;
        }
    } else if (operation.opcode == Opcode.BNE) {
        if (_gpr.getContent(operation.getOperand(0)) != _gpr.getContent(operation.getOperand(1))) {
            newPC = operation.getOperand(2);
            _predR[oper.getPredTrue()] = true;
            _predR[oper.getPredFalse()] = false;
        } else {
            _predR[oper.getPredTrue()] = false;
            _predR[oper.getPredFalse()] = true;
        }
    }
    return newPC;
  }
/****************************************************/
  private chkDependencies(row: number,id: number) {
    TCheck chkGPR[NGP];
    TCheck chkFPR[NFP];

    for (let i = 0; i < NGP; i++) {
        chkGPR[i].latency = 0;
    }

    for (let i = 0; i < NFP; i++) {
        chkFPR[i].latency = 0;
    }

    for (row = 0; row < _code.getNInst(); row++) {
        LargueInstruccion inst = _code.getLargueInstruction(row);
        for (let j = 0; j < inst.getNOper(); j++) {
            chkDestinoOp(inst.getOperacion(j), chkGPR, chkFPR);
        }
        for (let j = 0; j < inst.getNOper(); j++) {
            if (!chkFuenteOp(inst.getOperacion(j), chkGPR, chkFPR)) {
                id = inst->getOperacion(j).id();
                throw new Error(VLIWError.ERRRA); //VLIW_ERRRA;
            }
        }
        for (let i = 0; i < NGP; i++) {
            if (chkGPR[i].latency > 0)
                chkGPR[i].latency--;
        }
        for (let i = 0; i < NFP; i++) {
            if (chkFPR[i].latency > 0)
                chkFPR[i].latency--;
        }
    }
    throw new Error(VLIWError.ERRNO); //VLIW_ERRNO;
  }

  private chkPredicate(row: number, id: number) {
    TCheck chkPred[]; //list<TChequeo> chkPred;
    for (row = 0; row < _code.getNInst(); row++) {
        let index = 0;
        while (chkPred[index] != chkPred.length()) {
            if (chkPred[index]->latency == 1) {
                chkPred.splice(index, 1);
            } else {
                chkPred[index].latency--;
                index++;
            }
        }
        LargeInstruction inst = _code.getLargeInstruction(row);
        for (let j = 0; j < inst.getNOper(); j++)
            if (inst.getOperacion(j).getTipoUF() == JUMP) {
                TCheck chk1;
                TCheck chk2;
                chk1.latency = _functionalUnitLatencies[JUMP];
                chk2.latency = _functionalUnitLatencies[JUMP];
                chk1.register = inst.getOperacion(j).getPredTrue();
                chk2.register = inst.getOperacion(j).getPredFalse();
                chkPred.append(chk1);
                chkPred.append(chk2);
            }

        for (let j = 0; j < inst.getNOper(); j++)
            if (inst.getOperacion(j).getPred() != 0) {
                for (index = chkPred[0]; index != chkPred.length(); index++)
                    if (inst.getOperacion(j).getPred() == index.register)
                        break;
                if (index == chkPred.length()){
                    id = inst.getOperacion(j).id();
                    for(let i = 0; i < chkPred.length; i++) {
                      chkPred[i] == 0;
                    }
                    throw new Error(VLIWError.ERRPRED); //VLIW_ERRPRED;
                }
                else if (_functionalUnitLatencies[inst.getOperacion(j).getTipoUF()] < index.latency) {
                    id = inst.getOperacion(j).id();
                    for(let i = 0; i < chkPred.length; i++) {
                      chkPred[i] == 0;
                    }
                    throw new Error(VLIWError.ERRBRANCHDEP); //VLIW_ERRBRANCHDEP;
                }
            }
    }
    for(let i = 0; i < chkPred.length; i++) {
      chkPred[i] == 0;
    }
    throw new Error(VLIWError.ERRNO); //VLIW_ERRNO;
  }

  /********************************************************************/

  //Getters
  public getPredReg(ind: number): boolean { return predR[ind]; }
  public getNaTGP(ind: number): boolean { return NaTGP[ind]; }
  public getNaTFP(ind: number): boolean { return NaTFP[ind]; }
  public getPredReg(): boolean { return predR; }
  public getNTGP(): boolean { return NaTGP; }
  public getNaTFP(): boolean { return NaTFP; }
  public getCode(): TCodigoVLIW { return code; }

  // Setters
  public setPredReg(ind: number, p: boolean) { predR[ind] = p; }
  public setNaTGP(ind: number, n: boolean) { NaTGP[ind] = n; }
  public setNaTFP(ind: number, n: boolean) { NaTFP[ind] = n; }
  public setNUF(ind: number, n: number) {
    functionalUnitNumbers[ind] = ((FunctionalUnitType) ind == JUMP) ? 1 : n;
  }

  public chkCode() {
    for (let i = 0; i < _code.getNInst(); i++) {
        LargeInstruction inst = _code.getLargeInstruction(i);
        for (let j = 0; j < inst.getNOper(); j++) {
            TOperacionVLIW oper = inst.getOperacion(j);
            if (oper.getNumUF() >= nUF[oper.getTipoUF()])
                throw new Error(VLIWError.ERRHARD); //VLIW_ERRHARD;
        }
    }
    throw new Error(VLIWError.ERRNO); //VLIW_ERRNO;
  }

  public chkError(row: number, id: number) {
    try {
      chkDependencies(row, id);
    }
    catch(error) {
      if (error.number != VLIWError.ERRNO) {
        throw error;
      }
    }
    chkPredicate(row, id);
  }


/*
  public tic() {
    let i, j;
    //pendiente: boolean = false;
    //detenerFlujo: boolean = false;

    //status.ciclo++;
    if (UF[JUMP][0].instruccionesPendientes())
        pendiente = true;
    if (UF[JUMP][0].getStall() == 0) {
        TOperacionVLIW *oper = (TOperacionVLIW *)UF[JUMP][0].getTopInstruccion();
        if (operation != NULL) {
            if (predR[operation.getPred()])
                PC = ejecutarSalto(operation);
        }
    }
    UF[JUMP][0].tic();

    for (i = 0; i < NTIPOSUF - 1; i++)
        for (j = 0; j < nUF[i]; j++) {
            if (UF[i][j].instruccionesPendientes())
                pendiente = true;
            if (UF[i][j].getStall() == 0) {
                TOperacionVLIW *oper = (TOperacionVLIW *)UF[i][j].getTopInstruccion();
                if (oper != NULL) {
                    if (predR[oper->getPred()])
                        ejecutarOperacion(oper, UF[i][j]);
                }
            }

            UF[i][j].tic();
        }

    gpr.tic();
    fpr.tic();

    if (!detenerFlujo) {

        TInstruccionLarga *inst = codigo->getInstruccionLarga(PC);
        if (inst == NULL) {
            if (pendiente)
                return VLIW_PCOUTOFRANGE;

            return VLIW_ENDEXE;
        }
        for (i = 0; i < inst->getNOper(); i++) {
            TTipoUF tipo = inst->getOperacion(i)->getTipoUF();
            int num = inst->getOperacion(i)->getNumUF();
            if (!UF[tipo][num].estaLibre() || chkNaT(inst->getOperacion(i))) {
                detenerFlujo = true;
                break;
            }
        }
        if (!detenerFlujo) {
            for (i = 0; i < inst->getNOper(); i++) {
                TOperacionVLIW *oper = inst->getOperacion(i);
                UF[oper->getTipoUF()][oper->getNumUF()].rellenarCauce(oper);
                // Si son LOADS marco los registros destino como NaT
                if (oper->getOpcode() == TCodigo::LW)
                    NaTGP[oper->getOp(0)] = true;
                if (oper->getOpcode() == TCodigo::LF)
                    NaTFP[oper->getOp(0)] = true;
                    if (oper->getTipoUF() == SALTO) {
                    predR[oper->getPredTrue()] = false;
                    predR[oper->getPredFalse()] = false;
                }
            }
            PC++;
        }
        if (inst->getBreakPoint()) {
            status.breakPoint = true;
            return VLIW_BREAKPOINT;
        }
    }
    return VLIW_OK;
}*/
  public init(reset: boolean) {
    super().init; //TMaquina::init(reset);
    this._NaTGP = new Array(Machine.NGP);
    this._NaTGP.fill(-1);
    this._NaTFP = new Array(Machine.NFP);
    this._NaTFP.fill(-1);
    this._predR = new Array(Machine.NPR);
    this._predR.fill(-1);
    _predR[0] = true;
  }
}
