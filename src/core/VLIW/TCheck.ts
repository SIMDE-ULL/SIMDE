import { Machine } from '../Common/Machine';
import { TOperacionVLIW } from './TOperacionVLIW';
import { FunctionalUnit } from '../Common/FunctionalUnit';


export interface Check {
    latency: number;
    register: number;
}

export class TCheck {

  private chkDestinoOp(operation: TOperationVLIW, chkGPR: Check, chkFPR: Check) {
      switch (operation.opcode) {
          case Opcodes.ADD:
          case Opcodes.ADDI:
              if (chkGPR[operation.getOperand(0)].latency < _functionalUnitLatencies[INTERGERSUM]) {
                  chkGPR[operation.getOperand(0)].latency = _functionalUnitLatencies[INTERGERSUM];
                  chkGPR[operation.getOperand(0)].register = operation.id();
              }
              break;
          case Opcodes.MULT:
              if (chkGPR[operation.getOperand(0)].latency < _functionalUnitLatencies[INTEGERMULTIPLY]) {
                  chkGPR[operation.getOperand(0)].latency = _functionalUnitLatencies[INTEGERMULTIPLY];
                  chkGPR[operation.getOperand(0)].register = operation.id();
              }
              break;
          case Opcodes.ADDF:
              if (chkFPR[operation.getOperand(0)].latency < _functionalUnitLatencies[FLOATINGSUM]) {
                  chkFPR[operation.getOperand(0)].latency = _functionalUnitLatencies[FLOATINGSUM];
                  chkFPR[operation.getOperand(0)].register = operation.id();
              }
              break;
          case Opcodes.MULTF:
              if (chkFPR[operation.getOperand(0)].latency < _functionalUnitLatencies[FLOATINGMULTIPLY]) {
                  chkFPR[operation.getOperand(0)].latency = _functionalUnitLatencies[FLOATINGMULTIPLY];
                  chkFPR[operation.getOperand(0)].register = operation.id();
              }
              break;
          case Opcodes.LW:
              if (chkGPR[operation.getOperand(0)].latency < _functionalUnitLatencies[MEMORY]) {
                  chkGPR[operation.getOperand(0)].latency =_functionalUnitLatencies[MEMORY];
                  chkGPR[operation.getOperand(0)].register = operation.id();
              }
              break;
          case Opcodes.LF:
              if (chkFPR[operation.getOperand(0)].latency < _functionalUnitLatencies[MEMORY]) {
                  chkFPR[operation.getOperand(0)].latency = _functionalUnitLatencies[MEMORY];
                  chkFPR[operation.getOperand(0)].register = operation.id();
              }
              break;
          case Opcodes.SW:
          case Opcodes.SF:
          case Opcodes.BEQ:
          case Opcodes.BNE:
          default:
              break;
      }
  }

  private chkFuenteOp(operation: TOperationVLIW, chkGPR: Check, chkFPR: Check): boolean {
      let result = true;
      switch (operation.opcode) {
        case Opcodes.ADD:
        case Opcodes.MULT:
            if (((chkGPR[operation.getOperand(1)].latency > 0) && (chkGPR[operation.getOperand(1)].register < operation.id()))
                || ((chkGPR[operation.getOperand(2)].latency > 0) && (chkGPR[operation.getOperand(2)].register < operation.id())))
                result = false;
            break;
        case Opcodes.ADDI:
            if ((chkGPR[operation.getOperand(1)].latency > 0) && (chkGPR[operation.getOperand(1)].register < operation.id()))
                result = false;
            break;
        case Opcodes.ADDF:
        case Opcodes.MULTF:
            if (((chkFPR[operation.getOperand(1)].latency > 0) && (chkFPR[operation.getOperand(1)].register < operation.id()))
            || ((chkFPR[operation.getOperand(2)].latency > 0) && (chkFPR[operation.getOperand(2)].register < operation.id())))
                result = false;
            break;
        case Opcodes.LW:
        case Opcodes.LF:
            if ((chkGPR[operation.getOperand(2)].latency > 0) && (chkGPR[operation.getOperand(2)].register < operation.id()))
                result = false;
            break;
        case Opcodes.SW:
            if (((chkGPR[operation.getOperand(0)].latency > 0) && (chkGPR[operation.getOperand(0)].register < operation.id()))
            || ((chkGPR[operation.getOperand(2)].latency > 0) && (chkGPR[operation.getOperand(2)].register < operation.id())))
                result = false;
            break;
        case Opcodes.SF:
            if (((chkFPR[operation.getOperand(0)].latency > 0) && (chkFPR[operation.getOperand(0)].register < operation.id()))
            || ((chkGPR[operation.getOperand(2)].latency > 0) && (chkGPR[operation.getOperand(2)].register < operation.id())))
                result = false;
            break;
        case Opcodes.BEQ:
        case Opcodes.BNE:
            if (((chkGPR[operation.getOperand(0)].latency > 0) && (chkGPR[operation.getOperand(0)].register < operation.id()))
            || ((chkGPR[operation.getOperand(1)].latency > 0) && (chkGPR[operation.getOperand(1)].register < operation.id())))
                result = false;
            break;
        default:
            result = true;
            break;
    }
    return result;
  }
}
