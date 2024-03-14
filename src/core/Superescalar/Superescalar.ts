import { Machine } from "../Common/Machine";
import { Code } from "../Common/Code";

import { ReorderBuffer } from "./ReorderBuffer";
import { PrefetchUnit } from "./PrefetchUnit";
import { ReserveStation } from "./ReserveStation";
import {
  FunctionalUnit,
  FunctionalUnitType,
  FunctionalUnitNumbers,
  FUNCTIONALUNITTYPESQUANTITY,
} from "../Common/FunctionalUnit";
import { JumpPredictor } from "./JumpPredictor";
import { Instruction } from "../Common/Instruction";
import {
  CommitStatus,
  SuperStage,
  SuperescalarStatus,
} from "./SuperescalarEnums";

export class Superescalar extends Machine {
  private static PREDTABLEBITS = 4;
  private static PREDTABLESIZE = 1 << Superescalar.PREDTABLEBITS;

  private static ISSUE_DEF = 4;

  private _issue: number;
  private _code: Code;

  private _reserveStations: Map<FunctionalUnitType, ReserveStation>;
  private _reorderBuffer: ReorderBuffer;
  private _prefetchUnit: PrefetchUnit;
  private _decoder: PrefetchUnit;
  private _aluMem: FunctionalUnit[];
  private _jumpPrediction: JumpPredictor;

  private _currentCommitedInstrs: number[];

  public get code(): Code {
    return this._code;
  }

  public set code(value: Code) {
    this._code = value;
  }

  public get issue(): number {
    return this._issue;
  }

  public set issue(value: number) {
    this._issue = value;
    this._prefetchUnit = new PrefetchUnit(this.issue * 2);
    this._decoder = new PrefetchUnit(this.issue);
  }

  public get reorderBuffer(): ReorderBuffer {
    return this._reorderBuffer;
  }

  public get prefetchUnit(): PrefetchUnit {
    return this._prefetchUnit;
  }

  public get decoder(): PrefetchUnit {
    return this._decoder;
  }

  public get aluMem(): FunctionalUnit[] {
    return this._aluMem;
  }

  public get jumpPrediction(): JumpPredictor {
    return this._jumpPrediction;
  }

  public get currentCommitedInstrs(): number[] {
    return this._currentCommitedInstrs;
  }

  constructor() {
    super();
    this.issue = Superescalar.ISSUE_DEF;

    this._jumpPrediction = new JumpPredictor(Superescalar.PREDTABLESIZE);
    this._reserveStations = new Map<FunctionalUnitType, ReserveStation>();
    let total = 0; //  total ROB size
    for (let i = 0; i < FUNCTIONALUNITTYPESQUANTITY; i++) {
      let size = this.getReserveStationSize(i);
      this._reserveStations[i] = new ReserveStation(size);
      total += size;
    }
    this._reorderBuffer = new ReorderBuffer(total);
    this._prefetchUnit = new PrefetchUnit(this.issue * 2);
    this._decoder = new PrefetchUnit(this.issue);

    this._code = null;

    this._aluMem = new Array(FunctionalUnitNumbers[FunctionalUnitType.MEMORY]);

    for (let j = 0; j < FunctionalUnitNumbers[FunctionalUnitType.MEMORY]; j++) {
      this.aluMem[j] = new FunctionalUnit(FunctionalUnitType.INTEGERSUM);
    }

    this._currentCommitedInstrs = new Array<number>();
  }

  public changeFunctionalUnitLatency(
    type: FunctionalUnitType,
    latency: number
  ) {
    super.changeFunctionalUnitLatency(type, latency);

    // Update the latency of the alu mem if the type is interger sum (same type of unit)
    if (type === FunctionalUnitType.INTEGERSUM) {
      for (let j = 0; j < this.aluMem.length; j++) {
        this.aluMem[j] = new FunctionalUnit(
          FunctionalUnitType.INTEGERSUM,
          latency
        );
      }
    }
  }

  public changeFunctionalUnitNumber(type: FunctionalUnitType, number: number) {
    super.changeFunctionalUnitNumber(type, number);

    // Update the number of alu mem units acortding to the number of memory units
    if (type === FunctionalUnitType.MEMORY) {
      let currentLatency = this.aluMem[0].latency;
      this._aluMem = new Array(number);
      for (let j = 0; j < number; j++) {
        this.aluMem[j] = new FunctionalUnit(
          FunctionalUnitType.INTEGERSUM,
          currentLatency
        );
      }
    }
  }

  public getReserveStation(type: FunctionalUnitType): ReserveStation {
    return this._reserveStations[type];
  }

  public getReserveStationSize(type: FunctionalUnitType): number {
    return (
      this.functionalUnit[type].length *
      (this.functionalUnit[type][0].latency + 1)
    );
  }

  private getRegisterValueOrROBRef(
    register: number,
    floatingPoint: boolean
  ): [number, boolean] {
    let isROBRef = false;
    let result = 0; // Value or Rob index

    // Check if the value is available in the register file or ROB
    if (floatingPoint && !this._fpr.busy[register]) {
      result = this._fpr.content[register];
    } else if (!floatingPoint && !this._gpr.busy[register]) {
      result = this._gpr.content[register];
    } else if (
      this._reorderBuffer.isRegisterValueReady(register, floatingPoint)
    ) {
      result = this._reorderBuffer.getRegisterValue(register, floatingPoint);
    } else {
      // The value is still being calculated
      isROBRef = true;
      result = this._reorderBuffer.getRegisterMapping(register, floatingPoint);
    }

    return [result, isROBRef];
  }

  private checkJump(
    instruction: Instruction,
    executionResult: number
  ): boolean {
    // Check if the prediction was correct
    // Typescript does not support ^ operator for boolean
    if (
      +this._jumpPrediction.getPrediction(instruction.id) ^ +!!executionResult
    ) {
      this._jumpPrediction.updatePrediction(instruction.id, !!executionResult);
      // Change pc
      if (executionResult) {
        //this.pc = this.code.getBasicBlockInstruction(rob.instruction.getOperand(2));
        // The new parser just put the line number instead of the basic block, it is more simple
        this.pc = instruction.getOperand(2);
      } else {
        this.pc = instruction.id + 1;
      }

      // Clean functional Units and Reserve Stations,
      for (let i = 0; i < FUNCTIONALUNITTYPESQUANTITY; i++) {
        for (let j = 0; j < this.functionalUnit[i].length; j++) {
          this.functionalUnit[i][j] = new FunctionalUnit(
            this.functionalUnit[i][j].type,
            this.functionalUnit[i][j].latency
          );
          this._reserveStations[i] = new ReserveStation(
            this._reserveStations[i].size
          );
        }
      }

      // Clean the alus for the address calculus
      for (let i = 0; i < this.aluMem.length; i++) {
        this.aluMem[i] = new FunctionalUnit(
          this.aluMem[i].type,
          this.aluMem[i].latency
        );
      }

      // Clean prefetch, decoder and reorder buffer, the simplest way is
      // to rebuild the objects
      this._prefetchUnit = new PrefetchUnit(this._prefetchUnit.size);
      this._decoder = new PrefetchUnit(this._decoder.size);
      this._reorderBuffer = new ReorderBuffer(this._reorderBuffer.size);

      // Clean the structures related to the registers
      this._gpr.setAllBusy(false);
      this._fpr.setAllBusy(false);
      return false;
    }
    this._jumpPrediction.updatePrediction(instruction.id, !!executionResult);
    return true;
  }

  init(reset: boolean) {
    super.init(reset);
    // Clean Gpr, Fpr, predSalto
    this._jumpPrediction = new JumpPredictor(this._jumpPrediction.size);

    for (let i = 0; i < FUNCTIONALUNITTYPESQUANTITY; i++) {
      this._reserveStations[i] = new ReserveStation(
        this._reserveStations[i].size
      );
    }
    this._reorderBuffer = new ReorderBuffer(this._reorderBuffer.size);
    this._decoder = new PrefetchUnit(this._decoder.size);
    this._prefetchUnit = new PrefetchUnit(this._prefetchUnit.size);
    this._code = null;

    for (let j = 0; j < this.aluMem.length; j++) {
      this.aluMem[j] = new FunctionalUnit(
        this.aluMem[j].type,
        this.aluMem[j].latency
      );
    }

    this._currentCommitedInstrs = new Array<number>();
  }

  ticPrefetch() {
    let i = 0;
    while (!this._prefetchUnit.isFull() && this.pc < this.code.lines) {
      // Importante: Hago una copia de la instrucción original para distinguir
      // las distintas apariciones de una misma inst.
      let instruction = new Instruction(
        this.code.instructions[this.pc],
        this.status.cycle * 100 + i
      );
      if (
        instruction.isJumpInstruction() &&
        this._jumpPrediction.getPrediction(this.pc)
      ) {
        //this.pc = this.code.getBasicBlockInstruction(aux.instruction.getOperand(2));
        // The new parser just put the line number instead of the basic block, it is more simple
        this.pc = instruction.getOperand(2);
      } else {
        this.pc++;
      }
      this._prefetchUnit.add(instruction);
      i++;
    }
  }

  ticDecoder() {
    while (!this._decoder.isFull() && !this._prefetchUnit.isEmpty()) {
      let instruction = this._prefetchUnit.get();
      this._decoder.add(instruction);
    }
  }

  issueInstructionToReserveStation(instruction: Instruction, type: number) {
    let instrUid = instruction.uid;
    this._reserveStations[type].issueInstruction(instruction);

    // check were the value of the first operand is
    let firstOperandReg = instruction.getFirstOperandRegister();
    if (firstOperandReg !== -1) {
      let [value, isROBRef] = this.getRegisterValueOrROBRef(
        firstOperandReg,
        instruction.isFirstOperandFloat()
      );
      if (isROBRef) {
        this._reserveStations[type].setFirstOperandReference(instrUid, value);
      } else {
        this._reserveStations[type].setFirstOperandValue(instrUid, value);
      }
    } else if (instruction.hasImmediateOperand()) {
      // move the value of the immediate to the reserve station, if it has one
      this._reserveStations[type].setFirstOperandValue(
        instrUid,
        instruction.getImmediateOperand()
      );
    } else {
      // set the value of the first operand to 0
      this._reserveStations[type].setFirstOperandValue(instrUid, 0);
    }

    // check were the value of the second operand is
    let secondOperandReg = instruction.getSecondOperandRegister();
    if (secondOperandReg !== -1) {
      let [value, isROBRef] = this.getRegisterValueOrROBRef(
        secondOperandReg,
        instruction.isSecondOperandFloat()
      );
      if (isROBRef) {
        this._reserveStations[type].setSecondOperandReference(instrUid, value);
      } else {
        this._reserveStations[type].setSecondOperandValue(instrUid, value);
      }
    } else if (instruction.hasImmediateOperand()) {
      // move the value of the immediate to the reserve station, if it has one
      this._reserveStations[type].setSecondOperandValue(
        instrUid,
        instruction.getImmediateOperand()
      );
    } else {
      // set the value of the second operand to 0
      this._reserveStations[type].setSecondOperandValue(instrUid, 0);
    }

    // move the value of the address to the reserve station, if it has one
    if (instruction.getAddressOperand() !== -1) {
      this._reserveStations[type].setAddressOperand(
        instrUid,
        instruction.getAddressOperand()
      );
    }

    // set the destination register as busy, if it has one
    if (instruction.getDestinyRegister() !== -1) {
      if (instruction.isDestinyRegisterFloat()) {
        this._fpr.setBusy(instruction.getDestinyRegister(), true);
      } else {
        this._gpr.setBusy(instruction.getDestinyRegister(), true);
      }
    }
  }

  ticIssue() {
    while (!this._decoder.isEmpty()) {
      let fuType: FunctionalUnitType = this.code.getFunctionalUnitType(
        this._decoder.getId()
      );

      // Check if there is space in the reorder buffer and the reserve station
      if (this._reorderBuffer.isFull()) {
        break;
      }
      if (this._reserveStations[fuType].isFull()) {
        break;
      }

      let instruction: Instruction = this._decoder.get();
      let reserveStationPos = this.issueInstructionToReserveStation(
        instruction,
        fuType
      );
      // This is a hack, because putting the instruction in the reorder buffer before that in the reserve station will cause a circular dependency on instructions that reads and writes the same register, but the reserve station entry needs the rob index
      this._reorderBuffer.issueInstruction(instruction);
    }
  }

  executeInstruction(type: FunctionalUnitType, num: number) {
    let readyInstsRefs = this._reserveStations[type].getReadyInstructions();
    for (let instrUID of readyInstsRefs) {
      let instruction = this._reorderBuffer.getInstruction(instrUID);

      // Check if the instruction is a store and skip it
      // TODO: dont do this?
      if (instruction.isStoreInstruction()) {
        continue;
      }

      // if it is a load check that is really ready
      // this is because the load can be ready but the memory address is not calculated yet
      // or there is an store pending on that address
      if (instruction.isLoadInstruction()) {
        if (!this._reorderBuffer.hasResultAddress(instrUID)) {
          continue;
        }
        if (this._reorderBuffer.hasPreviousStores(instrUID)) {
          continue;
        }
      }

      // move the instruction to the functional unit,
      // associate it with the reserve station entry
      // and set the instruction as executing in the reorder buffer
      this.functionalUnit[type][num].addInstruction(instruction);
      this._reserveStations[type].associateFU(instrUID, num);
      this._reorderBuffer.executeInstruction(instrUID);
      break; // only execute one instruction per cycle
    }
  }

  ticExecute(): void {
    // Go through all the Functional Unit
    for (let i = 0; i < FUNCTIONALUNITTYPESQUANTITY; i++) {
      for (let j = 0; j < this.functionalUnit[i].length; j++) {
        if (this.functionalUnit[i][j].isFree()) {
          this.executeInstruction(i, j);
        }
      }
    }

    // Go through all the Address ALU and execute the address calculus
    for (let i = 0; i < this.aluMem.length; i++) {
      let execution = this.aluMem[i].executeReadyInstruction();
      if (execution != null) {
        // if an instruction is ready, write the result address to the reorder buffer and reserve station
        let instrUid = execution.instruction.uid;
        let baseAddress =
          this._reserveStations[FunctionalUnitType.MEMORY].getAddressOperand(
            instrUid
          );
        let offset =
          this._reserveStations[
            FunctionalUnitType.MEMORY
          ].getSecondOperandValue(instrUid);
        let address = baseAddress + offset;

        this._reorderBuffer.writeResultAddress(instrUid, address);
        this._reserveStations[FunctionalUnitType.MEMORY].setAddressOperand(
          instrUid,
          address
        );
      }

      this.aluMem[i].tic();
    }

    // Go again through all the memory reserve stations but this time sending the instructions to the address ALU
    for (let i = 0; i < this.aluMem.length; i++) {
      let readyInstsRefs =
        this._reserveStations[FunctionalUnitType.MEMORY].getReadyInstructions(
          true
        ); // we dont need the first operand ready, as we are only calculating the address
      for (let instrUID of readyInstsRefs) {
        let instruction = this._reorderBuffer.getInstruction(instrUID);

        if (
          instruction.isStoreInstruction() ||
          instruction.isLoadInstruction()
        ) {
          if (!this._reorderBuffer.hasResultAddress(instrUID)) {
            // assosiate the instruction with the address ALU,
            // so their address can be calculated
            this.aluMem[i].addInstruction(instruction);
            this._reserveStations[
              FunctionalUnitType.MEMORY
            ].associateAddressALU(instrUID, i);
            this._reorderBuffer.executeInstruction(instrUID);
            break;
          }
        }
      }
    }
  }

  writeInstruction(type: FunctionalUnitType, num: number) {
    let resul;
    let instUid = this.functionalUnit[type][num].getReadyInstructionUid();
    if (instUid !== -1) {
      let inst = this._reorderBuffer.getInstruction(instUid);
      let firstValue =
        this._reserveStations[type].getFirstOperandValue(instUid);
      let secondValue =
        this._reserveStations[type].getSecondOperandValue(instUid);

      // execute it
      let execution = this.functionalUnit[type][num].executeReadyInstruction(
        firstValue,
        secondValue
      );

      // load and stores are a special cases, because they need to access the memory
      if (inst.isLoadInstruction()) {
        let a = this.memory.getFaultyDatum(
          this._reserveStations[type].getAddressOperand(instUid)
        );

        //hack: as we dont have a well made error handling, intercept the error and just throw it
        if (a instanceof Error) {
          throw a;
        }

        resul = a.value;
        if (!a.got) {
          this.functionalUnit[type][num].stall(
            this.memoryFailLatency - this.functionalUnit[type][num].latency
          );
        }
      } else if (inst.isStoreInstruction()) {
        // we dont do anything at this stage with stores
        // in fact, stores cant enter a functional unit
      } else {
        resul = execution.result;
      }

      // Finish the instruction execution

      // Update all the reserve stations values that are waiting for this result
      // (jumps dont return a value for instructions, so we skip them)
      if (!inst.isJumpInstruction()) {
        for (let j = 0; j < FUNCTIONALUNITTYPESQUANTITY; j++) {
          this._reserveStations[j].setROBValue(instUid, resul);
        }
      }

      // update the reorder buffer with the result
      this._reorderBuffer.writeResultValue(instUid, resul);

      // Remove the instruction entry from the reserve station
      this._reserveStations[type].removeInstruction(instUid);
    }
  }

  ticWriteResult(): void {
    // First check for all STORES that are ready and write them
    //TODO: this is a really bad way to do this, as stores skips the execution stage and go directly to the write result stage
    // so here we are doing the execution stage of the stores. And also, we are writing the result of all the stores at the same time with no limits
    // why? because potatos
    let readyLoadsRefs =
      this._reserveStations[FunctionalUnitType.MEMORY].getReadyInstructions();
    let refsToRemove = new Array<number>();
    for (let instrUID of readyLoadsRefs) {
      let instruction = this._reorderBuffer.getInstruction(instrUID);

      if (instruction.isStoreInstruction()) {
        // check that is really ready, as the memory address can be not calculated yet
        if (!this._reorderBuffer.hasResultAddress(instrUID)) {
          continue;
        }

        // write the result to the ROB and remove the instruction from the reserve station
        this._reorderBuffer.writeResultValue(
          instrUID,
          this._reserveStations[FunctionalUnitType.MEMORY].getFirstOperandValue(
            instrUID
          )
        );
        //this._reserveStations[FunctionalUnitType.MEMORY].removeInstruction(instrRef);
        refsToRemove.push(instrUID);
      }
    }
    for (let instrRef of refsToRemove) {
      this._reserveStations[FunctionalUnitType.MEMORY].removeInstruction(
        instrRef
      );
    }

    // Now it's time to retrieve all the results from the UFs
    for (let i = 0; i < FUNCTIONALUNITTYPESQUANTITY; i++) {
      for (let j = 0; j < this.functionalUnit[i].length; j++) {
        if (!this.functionalUnit[i][j].isStalled()) {
          this.writeInstruction(i, j);
        }
        // Update clocks of the uf
        this.functionalUnit[i][j].tic();
      }
    }
  }

  ticCommit(): CommitStatus {
    this._currentCommitedInstrs = new Array<number>();
    for (let i = 0; i < this.issue; i++) {
      if (this._reorderBuffer.canCommitStoreInstruction()) {
        this.memory.setDatum(
          this._reorderBuffer.getResultAddress(),
          this._reorderBuffer.getResultValue()
        );
      } else if (this._reorderBuffer.canCommitJumpInstruction()) {
        if (
          !this.checkJump(
            this._reorderBuffer.getInstruction(),
            this._reorderBuffer.getResultValue()
          )
        ) {
          let instUid = this._reorderBuffer.commitInstruction();
          if (instUid !== -1) {
            this._currentCommitedInstrs.push(instUid);
          }
          // the jump was mispredicted
          return CommitStatus.SUPER_COMMITMISS;
        }
      } else if (this._reorderBuffer.canCommitRegisterInstruction()) {
        let instruction = this._reorderBuffer.getInstruction();
        let isFloat = instruction.isDestinyRegisterFloat();
        if (!isFloat) {
          this._gpr.setContent(
            instruction.getDestinyRegister(),
            this._reorderBuffer.getResultValue(),
            false
          );
        } else {
          this._fpr.setContent(
            instruction.getDestinyRegister(),
            this._reorderBuffer.getResultValue(),
            false
          );
        }

        if (this._reorderBuffer.purgeCommitMapping()) {
          if (!isFloat) {
            this._gpr.setBusy(instruction.getDestinyRegister(), false);
          } else {
            this._fpr.setBusy(instruction.getDestinyRegister(), false);
          }
        }
      } else if (this._reorderBuffer.isEmpty()) {
        return CommitStatus.SUPER_COMMITEND;
      } else {
        return CommitStatus.SUPER_COMMITNO;
      }

      let instUid = this._reorderBuffer.commitInstruction();
      if (instUid !== -1) {
        this._currentCommitedInstrs.push(instUid);
      }
    }
    return CommitStatus.SUPER_COMMITOK;
  }

  public tic(): SuperescalarStatus {
    this.status.cycle++;

    let commit = this.ticCommit();
    if (
      commit !== CommitStatus.SUPER_COMMITEND &&
      commit !== CommitStatus.SUPER_COMMITMISS
    ) {
      this.ticWriteResult();
      this.ticExecute();
    }

    this.ticIssue();
    this.ticDecoder();
    this.ticPrefetch();

    if (
      this.decoder.isEmpty() &&
      this.prefetchUnit.isEmpty() &&
      this.reorderBuffer.isEmpty() &&
      commit === CommitStatus.SUPER_COMMITEND
    ) {
      return SuperescalarStatus.SUPER_ENDEXE;
    }

    if (this._prefetchUnit.hasBreakpoint()) {
      this.status.breakPoint = true;
      return SuperescalarStatus.SUPER_BREAKPOINT;
    }
    return SuperescalarStatus.SUPER_OK;
  }
}
