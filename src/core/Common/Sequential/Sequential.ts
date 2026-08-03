import { Machine } from "../Machine";
import { Code } from "../Code"
import { Opcodes } from "../Opcodes";
import { SequentialStatus } from "./SequentialEnums";
import { FUNCTIONALUNITTYPESQUANTITY } from "../FunctionalUnit"
import { debug } from "console";
import { threadId } from "worker_threads";

export class Sequential extends Machine {
  private _code: Code;

  constructor() {
    super();
    this.code = null;
  }
  public tic() : SequentialStatus {
    let instruction = this.code.instructions.at(this._pc);
    console.log("pc = ", this.pc);
    console.log("code lines = ", this.code.lines);
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
        result = this.functionalUnit[instruction.getFunctionalUnitType()][0].executeReadyInstruction(this.getGpr(instruction?.getFirstOperandRegister()), 
                                                                                                     this.getGpr(instruction?.getSecondOperandRegister())).result;
        if (result) {
          this.pc = instruction.getAddressOperand();
        } else {
          this.pc++;
        }
        break;
      case Opcodes.BEQF:
      case Opcodes.BGTF:
      case Opcodes.BNEF:
        result = this.functionalUnit[instruction.getFunctionalUnitType()][0].executeReadyInstruction(this.getFpr(instruction?.getFirstOperandRegister()), 
                                                                                                     this.getFpr(instruction?.getSecondOperandRegister())).result;
        if (result) {
          this.pc = instruction.getAddressOperand();
        } else {
          this.pc++;
        }
        break;
      case Opcodes.LF: 
        let address = instruction.getAddressOperand() + this.gpr.content[instruction.getSecondOperandRegister()];
        console.log("getaddressoperand = ", instruction.getAddressOperand());
        console.log("getsecondoperandregister = ",  instruction.getSecondOperandRegister());
        console.log("getsecondoperand = ",  this.gpr.content[instruction.getSecondOperandRegister()]);
        console.log("address = ", address);
        if (address !== -1 && address < this.memory.size) {
          let value = this.memory.getData(address);
          console.log("data loaded = %v", value);
          this._fpr.setContent(instruction.getDestinyRegister(), value, false);
        } else {
          console.log("error loading");
        }
        break;
      
      case Opcodes.LW: {
        let address = instruction.getAddressOperand() + this.getGpr(instruction?.getSecondOperandRegister());
        console.log("address = ", address);
        if (address !== -1 && address < this.memory.size) {
          let value = this.memory.getData(address);
          console.log("data loaded = %v", value);
          this._gpr.setContent(instruction.getDestinyRegister(), value, false);
        }        
        break;
      }
      case Opcodes.SF:
        this.memory.setData(instruction.getAddressOperand() + this.getGpr(instruction?.getSecondOperandRegister()), this.getFpr(instruction?.getFirstOperandRegister()));
        console.log("data stored = %v", this.getFpr(instruction?.getFirstOperandRegister()));
        break;
      case Opcodes.SW:
        this.memory.setData(instruction.getAddressOperand() + this.getGpr(instruction?.getSecondOperandRegister()), this.getGpr(instruction?.getFirstOperandRegister()));
        console.log("data stored = %v", this.getGpr(instruction?.getFirstOperandRegister()));
        break;
      case Opcodes.ADDI:
        result = this.functionalUnit[instruction.getFunctionalUnitType()][0].executeReadyInstruction(this.getGpr(instruction.getFirstOperandRegister()), 
                                                                                                     instruction?.getImmediateOperand()).result;
        console.log("result = %v", result);
        this.setGpr(instruction.getDestinyRegister(), result);
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
        result = this.functionalUnit[instruction.getFunctionalUnitType()][0].executeReadyInstruction(this.gpr.content[instruction?.getFirstOperandRegister()],
                                                                                                     this.gpr.content[instruction?.getSecondOperandRegister()]).result;
        console.log("result = %v", result);
        this._gpr.setContent(instruction.getDestinyRegister(), result, false);
        break;
      case Opcodes.ADDF:
      case Opcodes.MULTF:
      case Opcodes.SUBF:
        result = this.functionalUnit[instruction.getFunctionalUnitType()][0].executeReadyInstruction(this.getFpr(instruction.getFirstOperandRegister()), 
                                                                                                     this.getFpr(instruction?.getSecondOperandRegister())).result;
        this.setFpr(instruction.getDestinyRegister(), result);
        break;
      default:
        break;
    }
    if (!(instruction?.isJumpInstruction())) {
      this.pc++;
    }
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