import { Opcodes } from '../Common/Opcodes';
import { VLIWOperation } from './VLIWOperation';
import { FunctionalUnitType } from '../Common/FunctionalUnit';

export interface Check {
    latency: number;
    register: number;
}

export class DependencyChecker {

    public static checkTargetOperation(operation: VLIWOperation, checkGPR: Check[], checkFPR: Check[], functionalUnitLatencies: number[]) {
        switch (operation.opcode) {
            case Opcodes.ADD:
            case Opcodes.ADDI:
                if (checkGPR[operation.getOperand(0)].latency < functionalUnitLatencies[FunctionalUnitType.INTEGERSUM]) {
                    checkGPR[operation.getOperand(0)].latency = functionalUnitLatencies[FunctionalUnitType.INTEGERSUM];
                    checkGPR[operation.getOperand(0)].register = operation.id;
                }
                break;
            case Opcodes.MULT:
                if (checkGPR[operation.getOperand(0)].latency < functionalUnitLatencies[FunctionalUnitType.INTEGERMULTIPLY]) {
                    checkGPR[operation.getOperand(0)].latency = functionalUnitLatencies[FunctionalUnitType.INTEGERMULTIPLY];
                    checkGPR[operation.getOperand(0)].register = operation.id;
                }
                break;
            case Opcodes.ADDF:
                if (checkFPR[operation.getOperand(0)].latency < functionalUnitLatencies[FunctionalUnitType.FLOATINGSUM]) {
                    checkFPR[operation.getOperand(0)].latency = functionalUnitLatencies[FunctionalUnitType.FLOATINGSUM];
                    checkFPR[operation.getOperand(0)].register = operation.id;
                }
                break;
            case Opcodes.MULTF:
                if (checkFPR[operation.getOperand(0)].latency < functionalUnitLatencies[FunctionalUnitType.FLOATINGMULTIPLY]) {
                    checkFPR[operation.getOperand(0)].latency = functionalUnitLatencies[FunctionalUnitType.FLOATINGMULTIPLY];
                    checkFPR[operation.getOperand(0)].register = operation.id;
                }
                break;
            case Opcodes.LW:
                if (checkGPR[operation.getOperand(0)].latency < functionalUnitLatencies[FunctionalUnitType.MEMORY]) {
                    checkGPR[operation.getOperand(0)].latency = functionalUnitLatencies[FunctionalUnitType.MEMORY];
                    checkGPR[operation.getOperand(0)].register = operation.id;
                }
                break;
            case Opcodes.LF:
                if (checkFPR[operation.getOperand(0)].latency < functionalUnitLatencies[FunctionalUnitType.MEMORY]) {
                    checkFPR[operation.getOperand(0)].latency = functionalUnitLatencies[FunctionalUnitType.MEMORY];
                    checkFPR[operation.getOperand(0)].register = operation.id;
                }
                break;
            case Opcodes.SW:
            case Opcodes.SF:
            case Opcodes.BEQ:
            case Opcodes.BNE:
            case Opcodes.BGT:
                break;
            default:
                throw new Error("Error at checkTargetOperation, unknown opcode: " + Opcodes[operation.opcode]);
        }
    }

    public static checkSourceOperands(operation: VLIWOperation, checkGPR: Check[], checkFPR: Check[]): boolean {
        let result = true;
        switch (operation.opcode) {
            case Opcodes.ADD:
            case Opcodes.MULT:
                if (((checkGPR[operation.getOperand(1)].latency > 0) && (checkGPR[operation.getOperand(1)].register < operation.id))
                    || ((checkGPR[operation.getOperand(2)].latency > 0) && (checkGPR[operation.getOperand(2)].register < operation.id))) {
                    result = false;
                }
                break;
            case Opcodes.ADDI:
                if ((checkGPR[operation.getOperand(1)].latency > 0) && (checkGPR[operation.getOperand(1)].register < operation.id)) {
                    result = false;
                }
                break;
            case Opcodes.ADDF:
            case Opcodes.MULTF:
                if (((checkFPR[operation.getOperand(1)].latency > 0) && (checkFPR[operation.getOperand(1)].register < operation.id))
                || ((checkFPR[operation.getOperand(2)].latency > 0) && (checkFPR[operation.getOperand(2)].register < operation.id))) {
                    result = false;
                }
                break;
            case Opcodes.LW:
            case Opcodes.LF:
                if ((checkGPR[operation.getOperand(2)].latency > 0) && (checkGPR[operation.getOperand(2)].register < operation.id)) {
                    result = false;
                }
                break;
            case Opcodes.SW:
                if (((checkGPR[operation.getOperand(0)].latency > 0) && (checkGPR[operation.getOperand(0)].register < operation.id))
                || ((checkGPR[operation.getOperand(2)].latency > 0) && (checkGPR[operation.getOperand(2)].register < operation.id))) {
                    result = false;
                }
                break;
            case Opcodes.SF:
                if (((checkFPR[operation.getOperand(0)].latency > 0) && (checkFPR[operation.getOperand(0)].register < operation.id))
                || ((checkGPR[operation.getOperand(2)].latency > 0) && (checkGPR[operation.getOperand(2)].register < operation.id))) {
                    result = false;
                }
                break;
            case Opcodes.BEQ:
            case Opcodes.BNE:
            case Opcodes.BGT:
                if (((checkGPR[operation.getOperand(0)].latency > 0) && (checkGPR[operation.getOperand(0)].register < operation.id))
                || ((checkGPR[operation.getOperand(1)].latency > 0) && (checkGPR[operation.getOperand(1)].register < operation.id))) {
                    result = false;
                }
                break;
            default:
                throw new Error("Error at checkSourceOperands, unknown opcode: " + Opcodes[operation.opcode]);
        }
        return result;
    }

    public static checkNat(operation: VLIWOperation, NaTGP: boolean[], NaTFP: boolean[]): boolean {

        let result;
        switch (operation.opcode) {
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
            case Opcodes.BGT:
                result = NaTGP[operation.getOperand(0)] || NaTGP[operation.getOperand(1)];
                break;
            default:
                throw new Error("Error at checkNat, unknown opcode: " + Opcodes[operation.opcode]);
        }
        return result;
    }

}
