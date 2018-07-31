import { Instruction } from '../Common/Instruction';
import { FunctionalUnitType } from '../Common/FunctionalUnit';
import { Opcodes } from '../Common/Opcodes';

export class VLIWOperation extends Instruction {

    private _functionalUnitType: FunctionalUnitType;
    private _functionalUnitNumber: number;
    private _predicate: number;
    private _predicateTrue: number;
    private _predicateFalse: number;

    constructor(operation?: VLIWOperation, instruction? : Instruction , type?: FunctionalUnitType, n?: number ) {
        super();
        if(operation) {
            this.buildFromVLIWOperation(operation);
        } else if(instruction) {
            this.buildFromInstruction(instruction, type, n);
        } else {
            this._predicate = 0;
            this._predicateTrue = 0;
            this._predicateFalse = 0;
        }
    }

    buildFromVLIWOperation(operation: VLIWOperation) {
        this._functionalUnitType = operation._functionalUnitType;
        this._functionalUnitNumber = operation._functionalUnitNumber;
        this._predicate= operation._predicate
        this._predicateTrue = operation._predicateTrue;
        this._predicateFalse = operation._predicateFalse;
    }

    buildFromInstruction(instruction: Instruction , t: FunctionalUnitType, n: number) {
        this.copy(instruction);
        this._functionalUnitType = t;
        this._functionalUnitNumber = n;
        this._predicate= 0;
        this._predicateTrue = 0;
        this._predicateFalse = 0;
    }

    //Getters
    public getTipoUF(): FunctionalUnitType {
        return this._functionalUnitType;
    }

    public getNumUF(): number {
        return this._functionalUnitNumber;
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
    public setTipoUF(t: FunctionalUnitType) {
        this._functionalUnitType = t;
    }

    public setNumUF(n: number) {
        this._functionalUnitNumber = n;
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
