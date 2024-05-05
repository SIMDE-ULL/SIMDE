import { OpcodeMnemonic } from '../Common/Opcode';
import { VLIWOperation } from './VLIWOperation';
import { FunctionalUnitKind } from '../Common/FunctionalUnit';

export interface Check {
    latency: number;
    register: number;
}

export class DependencyChecker {

    public static checkTargetOperation(operation: VLIWOperation, checkGPR: Check[], checkFPR: Check[], functionalUnitLatencies: number[]) {
        switch (operation.opcode) {
            case OpcodeMnemonic.ADD:
            case OpcodeMnemonic.ADDI:
                if (checkGPR[operation.getOperand(0)].latency < functionalUnitLatencies[FunctionalUnitKind.INTEGERSUM]) {
                    checkGPR[operation.getOperand(0)].latency = functionalUnitLatencies[FunctionalUnitKind.INTEGERSUM];
                    checkGPR[operation.getOperand(0)].register = operation.id;
                }
                break;
            case OpcodeMnemonic.MULT:
                if (checkGPR[operation.getOperand(0)].latency < functionalUnitLatencies[FunctionalUnitKind.INTEGERMULTIPLY]) {
                    checkGPR[operation.getOperand(0)].latency = functionalUnitLatencies[FunctionalUnitKind.INTEGERMULTIPLY];
                    checkGPR[operation.getOperand(0)].register = operation.id;
                }
                break;
            case OpcodeMnemonic.ADDF:
                if (checkFPR[operation.getOperand(0)].latency < functionalUnitLatencies[FunctionalUnitKind.FLOATINGSUM]) {
                    checkFPR[operation.getOperand(0)].latency = functionalUnitLatencies[FunctionalUnitKind.FLOATINGSUM];
                    checkFPR[operation.getOperand(0)].register = operation.id;
                }
                break;
            case OpcodeMnemonic.MULTF:
                if (checkFPR[operation.getOperand(0)].latency < functionalUnitLatencies[FunctionalUnitKind.FLOATINGMULTIPLY]) {
                    checkFPR[operation.getOperand(0)].latency = functionalUnitLatencies[FunctionalUnitKind.FLOATINGMULTIPLY];
                    checkFPR[operation.getOperand(0)].register = operation.id;
                }
                break;
            case OpcodeMnemonic.LW:
                if (checkGPR[operation.getOperand(0)].latency < functionalUnitLatencies[FunctionalUnitKind.MEMORY]) {
                    checkGPR[operation.getOperand(0)].latency = functionalUnitLatencies[FunctionalUnitKind.MEMORY];
                    checkGPR[operation.getOperand(0)].register = operation.id;
                }
                break;
            case OpcodeMnemonic.LF:
                if (checkFPR[operation.getOperand(0)].latency < functionalUnitLatencies[FunctionalUnitKind.MEMORY]) {
                    checkFPR[operation.getOperand(0)].latency = functionalUnitLatencies[FunctionalUnitKind.MEMORY];
                    checkFPR[operation.getOperand(0)].register = operation.id;
                }
                break;
            case OpcodeMnemonic.SW:
            case OpcodeMnemonic.SF:
            case OpcodeMnemonic.BEQ:
            case OpcodeMnemonic.BNE:
            case OpcodeMnemonic.BGT:
                break;
            default:
                throw new Error("Error at checkTargetOperation, unknown opcode: " + OpcodeMnemonic[operation.opcode]);
        }
    }

    public static checkSourceOperands(operation: VLIWOperation, checkGPR: Check[], checkFPR: Check[]): boolean {
        let result = true;
        switch (operation.opcode) {
            case OpcodeMnemonic.ADD:
            case OpcodeMnemonic.MULT:
                if (((checkGPR[operation.getOperand(1)].latency > 0) && (checkGPR[operation.getOperand(1)].register < operation.id))
                    || ((checkGPR[operation.getOperand(2)].latency > 0) && (checkGPR[operation.getOperand(2)].register < operation.id))) {
                    result = false;
                }
                break;
            case OpcodeMnemonic.ADDI:
                if ((checkGPR[operation.getOperand(1)].latency > 0) && (checkGPR[operation.getOperand(1)].register < operation.id)) {
                    result = false;
                }
                break;
            case OpcodeMnemonic.ADDF:
            case OpcodeMnemonic.MULTF:
                if (((checkFPR[operation.getOperand(1)].latency > 0) && (checkFPR[operation.getOperand(1)].register < operation.id))
                    || ((checkFPR[operation.getOperand(2)].latency > 0) && (checkFPR[operation.getOperand(2)].register < operation.id))) {
                    result = false;
                }
                break;
            case OpcodeMnemonic.LW:
            case OpcodeMnemonic.LF:
                if ((checkGPR[operation.getOperand(2)].latency > 0) && (checkGPR[operation.getOperand(2)].register < operation.id)) {
                    result = false;
                }
                break;
            case OpcodeMnemonic.SW:
                if (((checkGPR[operation.getOperand(0)].latency > 0) && (checkGPR[operation.getOperand(0)].register < operation.id))
                    || ((checkGPR[operation.getOperand(2)].latency > 0) && (checkGPR[operation.getOperand(2)].register < operation.id))) {
                    result = false;
                }
                break;
            case OpcodeMnemonic.SF:
                if (((checkFPR[operation.getOperand(0)].latency > 0) && (checkFPR[operation.getOperand(0)].register < operation.id))
                    || ((checkGPR[operation.getOperand(2)].latency > 0) && (checkGPR[operation.getOperand(2)].register < operation.id))) {
                    result = false;
                }
                break;
            case OpcodeMnemonic.BEQ:
            case OpcodeMnemonic.BNE:
            case OpcodeMnemonic.BGT:
                if (((checkGPR[operation.getOperand(0)].latency > 0) && (checkGPR[operation.getOperand(0)].register < operation.id))
                    || ((checkGPR[operation.getOperand(1)].latency > 0) && (checkGPR[operation.getOperand(1)].register < operation.id))) {
                    result = false;
                }
                break;
            default:
                throw new Error("Error at checkSourceOperands, unknown opcode: " + OpcodeMnemonic[operation.opcode]);
        }
        return result;
    }

    public static checkNat(operation: VLIWOperation, NaTGP: boolean[], NaTFP: boolean[]): boolean {

        let result;
        switch (operation.opcode) {
            case OpcodeMnemonic.ADD:
            case OpcodeMnemonic.MULT:
                result = NaTGP[operation.getOperand(1)] || NaTGP[operation.getOperand(2)];
                break;
            case OpcodeMnemonic.ADDI:
                result = NaTGP[operation.getOperand(1)];
                break;
            case OpcodeMnemonic.ADDF:
            case OpcodeMnemonic.MULTF:
                result = NaTFP[operation.getOperand(1)] || NaTFP[operation.getOperand(2)];
                break;
            case OpcodeMnemonic.SW:
                result = NaTGP[operation.getOperand(0)] || NaTGP[operation.getOperand(2)];
                break;
            case OpcodeMnemonic.SF:
                result = NaTFP[operation.getOperand(0)] || NaTGP[operation.getOperand(2)];
                break;
            case OpcodeMnemonic.LW:
            case OpcodeMnemonic.LF:
                result = NaTGP[operation.getOperand(2)];
                break;
            case OpcodeMnemonic.BEQ:
            case OpcodeMnemonic.BNE:
            case OpcodeMnemonic.BGT:
                result = NaTGP[operation.getOperand(0)] || NaTGP[operation.getOperand(1)];
                break;
            default:
                throw new Error("Error at checkNat, unknown opcode: " + OpcodeMnemonic[operation.opcode]);
        }
        return result;
    }

}
