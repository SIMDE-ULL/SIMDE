import { Machine } from '../Common/Machine';
import { Code } from '../Common/Code';
import { Opcodes } from '../Common/Opcodes';
import { TCodigoVLIW } from './TCodigoVLIW';
import { LargeInstruction } from './LargeInstruction';
import { FunctionalUnit } from '../Common/FunctionalUnit';
import { TOperacionVLIW } from './TOperacionVLIW';

export class TMaquinaVLIW extends Machine {
/*
// Definici�n de valores de error
typedef enum {VLIW_PCOUTOFRANGE = -3, VLIW_ENDEXE = -2, VLIW_BREAKPOINT = -1, VLIW_OK = 0} TVLIWStatus;
typedef enum {VLIW_ERRRAW = -4, VLIW_ERRHARD = -3, VLIW_ERRBRANCHDEP = -2, VLIW_ERRPRED = -1, VLIW_ERRNO = 0} TVLIWError;
*/
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
                FunctionalUnit._status.stall(latFalloMem - FunctionalUnit.latency()); //uf.setStall(latFalloMem - uf.getLatencia());
            } else {
                _gpr.setContent(operation.getOperand(0), datoI, true);
                _NaTGP[operation.getOperand(0)] = false;
            }
            break;
        case Opcodes.LF:
            let datoF;
            if (!memory.getDatum(_gpr.getContent(operation.getOperand(2)) + operation.getOperand(1), datoF)) {
                FunctionalUnit._status.stall(latFalloMem - FunctionalUnit.latency()); //uf.setStall(latFalloMem - uf.getLatencia());
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

  /* TVLIWError __fastcall chkDependencias(int &fila, int &id) {
  TChequeo chkGPR[NGP];
    TChequeo chkFPR[NFP];

    // Inicializaci�n de los arrays de control
    for (int i = 0; i < NGP; i++)
        chkGPR[i].lat = 0;
    for (int i = 0; i < NFP; i++)
        chkFPR[i].lat = 0;
    // Comprobaci�n de dependencias verdaderas
    for (fila = 0; fila < codigo->getNInst(); fila++) {
        TInstruccionLarga *inst = codigo->getInstruccionLarga(fila);
        // Primero compruebo los registros destino de operaciones
        for (int j = 0; j < inst->getNOper(); j++)
            chkDestinoOp(inst->getOperacion(j), chkGPR, chkFPR);
        // Compruebo los registros fuente de operaciones
        for (int j = 0; j < inst->getNOper(); j++)
            if (!chkFuenteOp(inst->getOperacion(j), chkGPR, chkFPR)) {
                id = inst->getOperacion(j)->getId();
                return VLIW_ERRRAW;
            }
        // Decremento los contadores de los registros
        for (int i = 0; i < NGP; i++)
            if (chkGPR[i].lat > 0)
                chkGPR[i].lat--;
        for (int i = 0; i < NFP; i++)
            if (chkFPR[i].lat > 0)
                chkFPR[i].lat--;
    }
    return VLIW_ERRNO;
}
    TVLIWError __fastcall chkPredicados(int &fila, int &id) {
    list<TChequeo> chkPred;
    // Comprobaci�n de saltos con predicaciones incorrectas
    for (fila = 0; fila < codigo->getNInst(); fila++) {
        // Se controla la lista de control
        list<TChequeo>::iterator it = chkPred.begin();
        while (it != chkPred.end()) {
            if (it->lat == 1)
                it = chkPred.erase(it);
            else {
                it->lat--;
                it++;
            }
        }
        TInstruccionLarga *inst = codigo->getInstruccionLarga(fila);
        // Busco si hay alguna instrucci�n de salto
        for (int j = 0; j < inst->getNOper(); j++)
            if (inst->getOperacion(j)->getTipoUF() == SALTO) {
                TChequeo chk1;
                TChequeo chk2;
                chk1.lat = latenciaUF[SALTO];
                chk2.lat = latenciaUF[SALTO];
                chk1.reg = inst->getOperacion(j)->getPredTrue();
                chk2.reg = inst->getOperacion(j)->getPredFalse();
                chkPred.push_back(chk1);
                chkPred.push_back(chk2);
            }
        // Compruebo las dependencias
        for (int j = 0; j < inst->getNOper(); j++)
            if (inst->getOperacion(j)->getPred() != 0) {
                for (it = chkPred.begin(); it != chkPred.end(); it++)
                    if (inst->getOperacion(j)->getPred() == it->reg)
                        break;
                if (it == chkPred.end()) {
                    id = inst->getOperacion(j)->getId();
                    chkPred.clear();
                    return VLIW_ERRPRED;
                }
                else if (latenciaUF[inst->getOperacion(j)->getTipoUF()] < it->lat) {
                    id = inst->getOperacion(j)->getId();
                    chkPred.clear();
                    return VLIW_ERRBRANCHDEP;
                }
            }
    }
    chkPred.clear();
    return VLIW_ERRNO;
  }*/

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
        //nUF[ind] = ((TTipoUF) ind == SALTO) ? 1 : n;
  }
  /*TVLIWError __fastcall chkCodigo() {
    for (int i = 0; i < codigo->getNInst(); i++) {
        TInstruccionLarga *inst = codigo->getInstruccionLarga(i);
        for (int j = 0; j < inst->getNOper(); j++) {
            TOperacionVLIW *oper = inst->getOperacion(j);
            if (oper->getNumUF() >= nUF[oper->getTipoUF()])
                return VLIW_ERRHARD;
        }
    }
    return VLIW_ERRNO;
}*/
  /*TVLIWError __fastcall chkErrores(int &fila, int &id){
  TVLIWError resul = chkDependencias(fila, id);
    if (resul != VLIW_ERRNO)
        return resul;
    return chkPredicados(fila, id);
}*/
  /*TVLIWStatus __fastcall tic() {
  int i, j;
  bool pendiente = false;
  bool detenerFlujo = false;

  status.ciclo++;
  if (UF[SALTO][0].instruccionesPendientes())
      pendiente = true;
  if (UF[SALTO][0].getStall() == 0) {
      TOperacionVLIW *oper = (TOperacionVLIW *)UF[SALTO][0].getTopInstruccion();
      if (oper != NULL) {
          if (predR[oper->getPred()])
              PC = ejecutarSalto(oper);
      }
  }
  UF[SALTO][0].tic();

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
