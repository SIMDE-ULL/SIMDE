import { Opcodes } from '../Common/Opcodes';
import { VLIWOperation } from './VLIWOperation';
import { FunctionalUnitType } from '../Common/FunctionalUnit';


export interface Check {
    latency: number;
    register: number;
}

export class TCheck {

  public static checkTargetOperation(operation: VLIWOperation, chkGPR: Check[], chkFPR: Check[], functionalUnitLatencies: number[]) {
      switch (operation.opcode) {
          case Opcodes.ADD:
          case Opcodes.ADDI:
              if (chkGPR[operation.getOperand(0)].latency < functionalUnitLatencies[FunctionalUnitType.INTEGERSUM]) {
                  chkGPR[operation.getOperand(0)].latency = functionalUnitLatencies[FunctionalUnitType.INTEGERSUM];
                  chkGPR[operation.getOperand(0)].register = operation.id;
              }
              break;
          case Opcodes.MULT:
              if (chkGPR[operation.getOperand(0)].latency < functionalUnitLatencies[FunctionalUnitType.INTEGERMULTIPLY]) {
                  chkGPR[operation.getOperand(0)].latency = functionalUnitLatencies[FunctionalUnitType.INTEGERMULTIPLY];
                  chkGPR[operation.getOperand(0)].register = operation.id;
              }
              break;
          case Opcodes.ADDF:
              if (chkFPR[operation.getOperand(0)].latency < functionalUnitLatencies[FunctionalUnitType.FLOATINGSUM]) {
                  chkFPR[operation.getOperand(0)].latency = functionalUnitLatencies[FunctionalUnitType.FLOATINGSUM];
                  chkFPR[operation.getOperand(0)].register = operation.id;
              }
              break;
          case Opcodes.MULTF:
              if (chkFPR[operation.getOperand(0)].latency < functionalUnitLatencies[FunctionalUnitType.FLOATINGMULTIPLY]) {
                  chkFPR[operation.getOperand(0)].latency = functionalUnitLatencies[FunctionalUnitType.FLOATINGMULTIPLY];
                  chkFPR[operation.getOperand(0)].register = operation.id;
              }
              break;
          case Opcodes.LW:
              if (chkGPR[operation.getOperand(0)].latency < functionalUnitLatencies[FunctionalUnitType.MEMORY]) {
                  chkGPR[operation.getOperand(0)].latency =functionalUnitLatencies[FunctionalUnitType.MEMORY];
                  chkGPR[operation.getOperand(0)].register = operation.id;
              }
              break;
          case Opcodes.LF:
              if (chkFPR[operation.getOperand(0)].latency < functionalUnitLatencies[FunctionalUnitType.MEMORY]) {
                  chkFPR[operation.getOperand(0)].latency = functionalUnitLatencies[FunctionalUnitType.MEMORY];
                  chkFPR[operation.getOperand(0)].register = operation.id;
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

  public static checkSourceOperands(operation: VLIWOperation, chkGPR: Check[], chkFPR: Check[]): boolean {
      let result = true;
      switch (operation.opcode) {
        case Opcodes.ADD:
        case Opcodes.MULT:
            if (((chkGPR[operation.getOperand(1)].latency > 0) && (chkGPR[operation.getOperand(1)].register < operation.id))
                || ((chkGPR[operation.getOperand(2)].latency > 0) && (chkGPR[operation.getOperand(2)].register < operation.id)))
                result = false;
            break;
        case Opcodes.ADDI:
            if ((chkGPR[operation.getOperand(1)].latency > 0) && (chkGPR[operation.getOperand(1)].register < operation.id))
                result = false;
            break;
        case Opcodes.ADDF:
        case Opcodes.MULTF:
            if (((chkFPR[operation.getOperand(1)].latency > 0) && (chkFPR[operation.getOperand(1)].register < operation.id))
            || ((chkFPR[operation.getOperand(2)].latency > 0) && (chkFPR[operation.getOperand(2)].register < operation.id)))
                result = false;
            break;
        case Opcodes.LW:
        case Opcodes.LF:
            if ((chkGPR[operation.getOperand(2)].latency > 0) && (chkGPR[operation.getOperand(2)].register < operation.id))
                result = false;
            break;
        case Opcodes.SW:
            if (((chkGPR[operation.getOperand(0)].latency > 0) && (chkGPR[operation.getOperand(0)].register < operation.id))
            || ((chkGPR[operation.getOperand(2)].latency > 0) && (chkGPR[operation.getOperand(2)].register < operation.id)))
                result = false;
            break;
        case Opcodes.SF:
            if (((chkFPR[operation.getOperand(0)].latency > 0) && (chkFPR[operation.getOperand(0)].register < operation.id))
            || ((chkGPR[operation.getOperand(2)].latency > 0) && (chkGPR[operation.getOperand(2)].register < operation.id)))
                result = false;
            break;
        case Opcodes.BEQ:
        case Opcodes.BNE:
            if (((chkGPR[operation.getOperand(0)].latency > 0) && (chkGPR[operation.getOperand(0)].register < operation.id))
            || ((chkGPR[operation.getOperand(1)].latency > 0) && (chkGPR[operation.getOperand(1)].register < operation.id)))
                result = false;
            break;
        default:
            result = true;
            break;
    }
    return result;
  }

  public static checkNat(operation: VLIWOperation, NaTGP: boolean[], NaTFP: boolean[] ): boolean {
    let result;
    switch(operation.opcode) {
        case Opcodes.ADD:
        case Opcodes.MULT:
          result = NaTGP[operation.getOperand(1)] || NaTGP[operation.getOperand(2)];
          break;
      case Opcodes.ADDI:
          result = NaTGP[operation.getOperand(1)];
          break;
      case Opcodes.ADDF:
      case Opcodes.MULTF:
          result = NaTFP[operation.getOperand(1)] || NaTFP[operation.getOperand(2)];
          break;
      case Opcodes.SW:
          result = NaTGP[operation.getOperand(0)] || NaTGP[operation.getOperand(2)];
          break;
      case Opcodes.SF:
          result = NaTFP[operation.getOperand(0)] || NaTGP[operation.getOperand(2)];
          break;
      case Opcodes.LW:
      case Opcodes.LF:
          result = NaTGP[operation.getOperand(2)];
          break;
      case Opcodes.BEQ:
      case Opcodes.BNE:
          result = NaTGP[operation.getOperand(0)] || NaTGP[operation.getOperand(1)];
          break;
      default:
          result = true;
          break;
    }
    return result;
}

}
