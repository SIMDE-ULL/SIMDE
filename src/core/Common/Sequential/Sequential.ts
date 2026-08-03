import { Machine } from "../Machine";
import { Code } from "../Code"
import { Opcodes } from "../Opcodes";
import { SequentialStatus } from "./SequentialEnums";
import { FUNCTIONALUNITTYPESQUANTITY } from "../FunctionalUnit"
import { debug } from "console";

export class Sequential extends Machine {
  private _code: Code;

  constructor() {
    super();
    this.code = null;
  }
  public tic() : SequentialStatus {
    let instruction = this.code.instructions.at(this._pc);
    this.functionalUnit[instruction.getFunctionalUnitType()][0].addInstruction(instruction);
    console.log("instruction: %i", instruction?.opcode);
    for (let i = 0; i < (this.functionalUnit[instruction?.getFunctionalUnitType()][0].latency - 1); i++) {
      this._status.cycle++;
      this.functionalUnit[instruction?.getFunctionalUnitType()][0].tic(); 
    }
    let result = null;
    this._status.cycle++;
    //TODO: Reuse code
    switch (instruction.opcode) {
      case Opcodes.BEQ:
      case Opcodes.BGT:
      case Opcodes.BNE:
      case Opcodes.BEQF:
      case Opcodes.BGTF:
      case Opcodes.BNEF:
        if (result) {
          this.pc = instruction.getAddressOperand();
        } else {
          this.pc++;
        }
          return SequentialStatus.SEQ_OK;
        break;
      case Opcodes.LF: {
        let address = instruction.getAddressOperand();
        if (address !== -1 && this.memory.getData(address)) {
          let value = this.memory.getData(address);
          this._fpr.setContent(instruction.getDestinyRegister(), value, false);
        }        
        break;
      }
      case Opcodes.LW: {
        let address = instruction.getAddressOperand();
        if (address !== -1 && this.memory.getData(address)) {
          let value = this.memory.getData(address);
          this._gpr.setContent(instruction.getDestinyRegister(), value, false);
        }        
        break;
      }
      case Opcodes.SF:
        this.memory.setData(instruction.getAddressOperand(), this.getFpr(instruction.getDestinyRegister()));
        break;
      case Opcodes.SW:
        this.memory.setData(instruction.getAddressOperand(), this.getGpr(instruction.getDestinyRegister()));
        break;
      case Opcodes.ADDI:
        result = this.functionalUnit[instruction.getFunctionalUnitType()][0].executeReadyInstruction(instruction.getFirstOperandRegister(), 
                                                                                                     instruction?.getImmediateOperand()).result;
        this._gpr.setContent(instruction.getDestinyRegister(), result, false);
        break;
      case Opcodes.ADD:
      case Opcodes.AND:
      case Opcodes.MULT:
      case Opcodes.NOR:
      case Opcodes.OR:
      case Opcodes.SLLV:
      case Opcodes.SRLV:
      case Opcodes.SUB:
      case Opcodes.XOR:
        result = this.functionalUnit[instruction.getFunctionalUnitType()][0].executeReadyInstruction(instruction.getFirstOperandRegister(), 
                                                                                                     instruction?.getSecondOperandRegister()).result;
        this._gpr.setContent(instruction.getDestinyRegister(), result, false);
        break;
      case Opcodes.ADDF:
      case Opcodes.MULTF:
      case Opcodes.SUBF:
        result = this.functionalUnit[instruction.getFunctionalUnitType()][0].executeReadyInstruction(instruction.getFirstOperandRegister(), 
                                                                                                     instruction?.getSecondOperandRegister()).result;
        this._fpr.setContent(instruction.getDestinyRegister(), result, false);
        break;
      default:
        break;
    }
    this.pc++;
    if (this.pc <= this.code.lines - 1) {
      return SequentialStatus.SEQ_OK;
    } else {
      return SequentialStatus.SEQ_ENDEXE;
    }
  }

  public get code(): Code {
    return this._code;
  }

  public set code(value: Code) {
    this._code = value;
  }
}