import type { FunctionalUnitType } from "../Common/FunctionalUnit";
import { Instruction } from "../Common/Instruction";

export class VLIWOperation extends Instruction {
  private _functionalUnitType!: FunctionalUnitType;
  private _functionalUnitIndex!: number;
  private _predicate!: number;
  private _predicateTrue!: number;
  private _predicateFalse!: number;

  constructor(
    operation?: VLIWOperation,
    instruction?: Instruction,
    type?: FunctionalUnitType,
    functionalUnitIndex?: number,
  ) {
    if (operation) {
      super(operation);
      this.buildFromVLIWOperation(operation);
    } else if (instruction) {
      super(instruction);
      this.buildFromInstruction(instruction, type, functionalUnitIndex);
    } else {
      super();
      this._predicate = 0;
      this._predicateTrue = 0;
      this._predicateFalse = 0;
    }
  }

  buildFromVLIWOperation(operation: VLIWOperation) {
    this._functionalUnitType = operation._functionalUnitType;
    this._functionalUnitIndex = operation._functionalUnitIndex;
    this._predicate = operation._predicate;
    this._predicateTrue = operation._predicateTrue;
    this._predicateFalse = operation._predicateFalse;
  }

  buildFromInstruction(
    _instruction: Instruction,
    functionalUnitType: FunctionalUnitType | undefined,
    functionalUnitIndex: number | undefined,
  ) {
    this._functionalUnitType = functionalUnitType!;
    this._functionalUnitIndex = functionalUnitIndex ?? 0;
    this._predicate = 0;
    this._predicateTrue = 0;
    this._predicateFalse = 0;
  }

  // Getters
  public getFunctionalUnitType(): FunctionalUnitType {
    return this._functionalUnitType;
  }

  public getFunctionalUnitIndex(): number {
    return this._functionalUnitIndex;
  }

  public getPred(): number {
    return this._predicate;
  }

  public getPredTrue(): number {
    return this._predicateTrue;
  }

  public getPredFalse(): number {
    return this._predicateFalse;
  }

  // Setters
  public setFunctionalUnitType(t: FunctionalUnitType) {
    this._functionalUnitType = t;
  }

  public setFunctionalUnitNumber(n: number) {
    this._functionalUnitIndex = n;
  }

  public setPred(p: number) {
    this._predicate = p;
  }

  public setPredTrue(p: number) {
    this._predicateTrue = p;
  }

  public setPredFalse(p: number) {
    this._predicateFalse = p;
  }
}
