import { Instruction } from "../Common/Instruction";

export interface VisualReserveStationEntry {
  instruction: { id: string; uuid: number; value: string };
  Qj: string;
  Vj: string;
  Qk: string;
  Vk: string;
  A: string;
  ROB: string;
}

export interface ReserveStationEntry {
  instruction: Instruction;
  Qj: number;
  Qk: number;
  Vj: number;
  Vk: number;
  A: number;
  FUNum: number;
  FUIsAddALU: boolean;
}

export class ReserveStation {
  private _entries: ReserveStationEntry[] = new Array();

  public get size(): number {
    return this._size;
  }

  public get ocupation() {
    return this._entries.length / this._size;
  }

  constructor(private _size: number) {}

  private getInstrPos(uuid: number): number {
    for (let i = 0; i < this._entries.length; i++) {
      if (this._entries[i].instruction.uuid === uuid) {
        return i;
      }
    }
    return -1;
  }

  /**
   * isFull
   */
  public isFull(): boolean {
    return this._entries.length >= this._size;
  }

  /**
   * issueInstruction - issues an instruction to the reservation station
   */
  public issueInstruction(instruction: Instruction) {
    let entry = {
      instruction: instruction,
      Qj: -1,
      Qk: -1,
      Vj: -1,
      Vk: -1,
      A: -1,
      FUNum: -1,
      FUIsAddALU: false,
    };
    this._entries.push(entry) - 1;
  }

  /**
   * removeInstruction - removes an instruction from the reservation station
   */
  public removeInstruction(uuid: number) {
    let pos = this.getInstrPos(uuid);
    this._entries.splice(pos, 1);
  }

  /**
   * setFirstOperandValue - sets the value of the first operand of the instruction, this will remove the ROB reference to the value (Qj) and idicates that the value is ready
   */
  public setFirstOperandValue(uuid: number, value: number) {
    let pos = this.getInstrPos(uuid);
    this._entries[pos].Vj = value;
    this._entries[pos].Qj = -1;
  }

  /**
   * setSecondOperandValue - sets the value of the second operand of the instruction, this will remove the ROB reference to the value (Qk) and idicates that the value is ready
   */
  public setSecondOperandValue(uuid: number, value: number) {
    let pos = this.getInstrPos(uuid);
    this._entries[pos].Vk = value;
    this._entries[pos].Qk = -1;
  }

  /**
   * getFirstOperandValue - returns the value of the first operand of the instruction
   */
  public getFirstOperandValue(uuid: number): number {
    let pos = this.getInstrPos(uuid);
    return this._entries[pos].Vj;
  }

  /**
   * getSecondOperandValue - returns the value of the second operand of the instruction
   */
  public getSecondOperandValue(uuid: number): number {
    let pos = this.getInstrPos(uuid);
    return this._entries[pos].Vk;
  }

  /**
   * setFirstOperandReference - sets the ROB instruction uuid that will provide the value of the first operand, this will remove the value of the operand (Vj) and indicates that the value is not ready
   */
  public setFirstOperandReference(uuid: number, robInstrUuid: number) {
    let pos = this.getInstrPos(uuid);
    this._entries[pos].Qj = robInstrUuid;
    this._entries[pos].Vj = -1;
  }

  /**
   * setSecondOperandReference - sets the ROB instruction uuid that will provide the value of the second operand, this will remove the value of the operand (Vk) and indicates that the value is not ready
   */
  public setSecondOperandReference(uuid: number, robInstrUuid: number) {
    let pos = this.getInstrPos(uuid);
    this._entries[pos].Qk = robInstrUuid;
    this._entries[pos].Vk = -1;
  }

  /**
   * setAddressOperand - sets the address operand of the instruction, this will deasociate it from an Address ALU if it was associated
   */
  public setAddressOperand(uuid: number, address: number) {
    let pos = this.getInstrPos(uuid);
    this._entries[pos].A = address;

    if (this._entries[pos].FUIsAddALU) {
      this._entries[pos].FUNum = -1;
      this._entries[pos].FUIsAddALU = false;
    }
  }

  /**
   * getAddressOperand - returns the address operand of the instruction
   */
  public getAddressOperand(uuid: number): number {
    let pos = this.getInstrPos(uuid);
    return this._entries[pos].A;
  }

  /**
   * setROBValue - sets the value of the operands associated to the ROB reference
   */
  public setROBValue(robInstrUuid: number, value: number) {
    for (let i = 0; i < this._entries.length; i++) {
      if (this._entries[i].Qj === robInstrUuid) {
        this._entries[i].Vj = value;
        this._entries[i].Qj = -1;
      }

      if (this._entries[i].Qk === robInstrUuid) {
        this._entries[i].Vk = value;
        this._entries[i].Qk = -1;
      }
    }
  }

  /**
   * getReadyInstructions - returns the references to the instructions that are ready to be executed and has no FU associated
   */
  public getReadyInstructions(ignoreFirstOperand: boolean = false): number[] {
    let readyInstructions = new Array();
    for (let i = 0; i < this._entries.length; i++) {
      if (
        ((!ignoreFirstOperand && this._entries[i].Qj === -1) ||
          ignoreFirstOperand) &&
        this._entries[i].Qk === -1 &&
        this._entries[i].FUNum === -1
      ) {
        let uuid = this._entries[i].instruction.uuid;
        readyInstructions.push(uuid);
      }
    }
    return readyInstructions;
  }

  /**
   * associateFU - associates a FU to the instruction
   */
  public associateFU(uuid: number, fuNum: number) {
    let pos = this.getInstrPos(uuid);
    this._entries[pos].FUNum = fuNum;
  }

  /**
   * associateAddressALU - associates a FU to the instruction
   */
  public associateAddressALU(uuid: number, fuNum: number) {
    let pos = this.getInstrPos(uuid);
    this._entries[pos].FUNum = fuNum;
    this._entries[pos].FUIsAddALU = true;
  }

  public getVisualData(robMap: {
    [uuid: number]: number;
  }): VisualReserveStationEntry[] {
    return this._entries.map((entry) => {
      let toReturn: VisualReserveStationEntry = {
        instruction: { id: "", uuid: -1, value: "" },
        Qj: "",
        Vj: "",
        Qk: "",
        Vk: "",
        A: "",
        ROB: "",
      };

      if (entry != null) {
        toReturn = {
          instruction: { id: "", uuid: -1, value: "" },
          Qj: entry.Qj !== -1 ? "[" + robMap[entry.Qj] + "]" : "-",
          Vj: entry.Vj !== -1 ? "" + entry.Vj : "-",
          Qk: entry.Qk !== -1 ? "[" + robMap[entry.Qk] + "]" : "-",
          Vk: entry.Vk !== -1 ? "" + entry.Vk : "-",
          A: entry.A !== -1 ? "@" + entry.A : "-",
          ROB: "[" + robMap[entry.instruction.uuid] + "]",
        };
        if (entry.instruction != null) {
          toReturn.instruction.id = "" + entry.instruction.id;
          toReturn.instruction.uuid = entry.instruction.uuid;
          toReturn.instruction.value = entry.instruction.toString();
        }
      }

      return toReturn;
    });
  }
}
