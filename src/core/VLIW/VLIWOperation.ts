import { Instruction } from '../Common/Instruction';
import { FunctionalUnitType } from '../Common/FunctionalUnit';
import { Opcodes } from '../Common/Opcodes';

export class VLIWOperation extends Instruction {

    private _functionalUnitType: FunctionalUnitType;
    private _functionalUnitIndex: number;
    private _predicate: number;
    private _predicateTrue: number;
    private _predicateFalse: number;

    constructor(operation?: VLIWOperation, instruction? : Instruction , type?: FunctionalUnitType, functionalUnitIndex?: number ) {
        super();
        if(operation) {
            this.buildFromVLIWOperation(operation);
        } else if(instruction) {
            this.buildFromInstruction(instruction, type, functionalUnitIndex);
        } else {
            this._predicate = 0;
            this._predicateTrue = 0;
            this._predicateFalse = 0;
        }
    }

    buildFromVLIWOperation(operation: VLIWOperation) {
        this.copy(operation);
        this._functionalUnitType = operation._functionalUnitType;
        this._functionalUnitIndex = operation._functionalUnitIndex;
        this._predicate= operation._predicate
        this._predicateTrue = operation._predicateTrue;
        this._predicateFalse = operation._predicateFalse;
    }

    buildFromInstruction(instruction: Instruction , functionalUnitType: FunctionalUnitType, functionalUnitIndex: number) {
        this.copy(instruction);
        this._functionalUnitType = functionalUnitType;
        this._functionalUnitIndex = functionalUnitIndex;
        this._predicate= 0;
        this._predicateTrue = 0;
        this._predicateFalse = 0;
    }

    //Getters
    public getFunctionalUnitType(): FunctionalUnitType {
        return this._functionalUnitType;
    }

    public getFunctionalUnitIndex(): number {
        return this._functionalUnitIndex;
    }

    public getPred(): number {
        return this._predicate
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
        this._predicate= p;
    }

    public setPredTrue(p: number) {
        this._predicateTrue = p;
    }

    public setPredFalse(p: number) {
        this._predicateFalse = p;
    }

    public isJump() {
        return (this._opcode === Opcodes.BEQ) || (this._opcode === Opcodes.BGT) || (this._opcode === Opcodes.BNE);
    }

}
