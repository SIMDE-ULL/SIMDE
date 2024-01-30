import { Instruction } from '../Common/Instruction';

export interface VisualReserveStationEntry {
    instruction: { id: string, value: string, color: string };
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
    ROB: number;
    FUNum: number;
    FUPos: number;
    FUIsAddALU: boolean;
}

export class ReserveStation {

    private _entries: ReserveStationEntry[];
    private _size: number;


    constructor(size: number) {
        this._entries = new Array();
        this._size = size;
    }

    /**
     * clear
     */
    public clear() {
        this._entries = new Array();
    }

    /**
     * isFull
     */
    public isFull(): boolean {
        return this._entries.length >= this._size;
    }

    /**
     * issueInstruction - issues an instruction to the reservation station and returns a reference to the entry
     */
    public issueInstruction(instruction: Instruction): number {
        let entry = {
            instruction: instruction,
            Qj: -1,
            Qk: -1,
            Vj: -1,
            Vk: -1,
            A: -1,
            ROB: -1,
            FUNum: -1,
            FUPos: -1,
            FUIsAddALU: false
        };
        return this._entries.push(entry) - 1;
    }

    /**
     * removeInstruction - removes an instruction from the reservation station
     */
    public removeInstruction(entryRef: number) {
        this._entries.splice(entryRef, 1);
    }

    /**
     * setFirstOperandValue - sets the value of the first operand of the instruction, this will remove the ROB reference to the value (Qj) and idicates that the value is ready 
     */
    public setFirstOperandValue(entryRef: number, value: number) {
        this._entries[entryRef].Vj = value;
        this._entries[entryRef].Qj = -1;
    }

    /**
     * setSecondOperandValue - sets the value of the second operand of the instruction, this will remove the ROB reference to the value (Qk) and idicates that the value is ready 
     */
    public setSecondOperandValue(entryRef: number, value: number) {
        this._entries[entryRef].Vk = value;
        this._entries[entryRef].Qk = -1;
    }

    /**
     * getFirstOperandValue - returns the value of the first operand of the instruction
     */
    public getFirstOperandValue(entryRef: number): number {
        return this._entries[entryRef].Vj;
    }

    /**
     * getSecondOperandValue - returns the value of the second operand of the instruction
     */
    public getSecondOperandValue(entryRef: number): number {
        return this._entries[entryRef].Vk;
    }

    /**
     * setFirstOperandReference - sets the ROB reference of the entry that will provide the value of the first operand, this will remove the value of the operand (Vj) and indicates that the value is not ready
     */
    public setFirstOperandReference(entryRef: number, robRef: number) {
        this._entries[entryRef].Qj = robRef;
        this._entries[entryRef].Vj = -1;
    }

    /**
     * setSecondOperandReference - sets the ROB reference of the entry that will provide the value of the second operand, this will remove the value of the operand (Vk) and indicates that the value is not ready
     */
    public setSecondOperandReference(entryRef: number, robRef: number) {
        this._entries[entryRef].Qk = robRef;
        this._entries[entryRef].Vk = -1;
    }

    /**
     * setAddressOperand - sets the address operand of the instruction, this will deasociate it from an Address ALU if it was associated
     */
    public setAddressOperand(entryRef: number, address: number) {
        this._entries[entryRef].A = address;

        if (this._entries[entryRef].FUIsAddALU) {
            this._entries[entryRef].FUNum = -1;
            this._entries[entryRef].FUPos = -1;
            this._entries[entryRef].FUIsAddALU = false;
        }
    }

    /**
     * getAddressOperand - returns the address operand of the instruction
     */
    public getAddressOperand(entryRef: number): number {
        return this._entries[entryRef].A;
    }

    /**
     * setROBReference - sets the ROB reference of the entry
     */
    public setROBReference(entryRef: number, robRef: number) {
        this._entries[entryRef].ROB = robRef;
    }

    /**
     * getROBReference - returns the ROB reference of the entry
     */
    public getROBReference(entryRef: number): number {
        return this._entries[entryRef].ROB;
    }

    /**
     * setROBValue - sets the value of the operands associated to the ROB reference
     */
    public setROBValue(ROBref: number, value: number) {
        for (let i = 0; i < this._entries.length; i++) {
            if (this._entries[i].Qj === ROBref) {
                this._entries[i].Vj = value;
                this._entries[i].Qj = -1;
            }

            if (this._entries[i].Qk === ROBref) {
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
            if (((!ignoreFirstOperand && this._entries[i].Qj === -1) || ignoreFirstOperand) && this._entries[i].Qk === -1 && this._entries[i].FUNum === -1) {
                readyInstructions.push(i);
            }
        }
        return readyInstructions;
    }

    /**
     * associateFU - associates a FU to the instruction
     */
    public associateFU(entryRef: number, fuNum: number, fuPos: number) {
        this._entries[entryRef].FUNum = fuNum;
        this._entries[entryRef].FUPos = fuPos;
    }

    /**
     * associateAddressALU - associates a FU to the instruction
     */
    public associateAddressALU(entryRef: number, fuNum: number, fuPos: number) {
        this._entries[entryRef].FUNum = fuNum;
        this._entries[entryRef].FUPos = fuPos;
        this._entries[entryRef].FUIsAddALU = true;
    }

    /**
     * getFUInstruction - returns the reference to the instruction that is associated to the FU
     */
    public getFUInstruction(fuNum: number, fuPos: number, isAddressALU: boolean = false): number {
        for (let i = 0; i < this._entries.length; i++) {
            if (this._entries[i].FUNum === fuNum && this._entries[i].FUPos === fuPos && ((isAddressALU && this._entries[i].FUIsAddALU) || (!isAddressALU && !this._entries[i].FUIsAddALU))) {
                return i;
            }
        }
        return -1;
    }

    /**
     * updateROBRefs - this method is called when an instruction is removed frome the ROB, so the ROB references now have to be updated
     */
    public updateROBRefs() {
        for (let i = 0; i < this._entries.length; i++) {
            let entry = this._entries[i];
            if (entry.ROB > 0) {
                entry.ROB--;
            }

            if (entry.Qj > 0) {
                entry.Qj--;
            }

            if (entry.Qk > 0) {
                entry.Qk--;
            }
        }
    }

    public getVisualData(): VisualReserveStationEntry[] {
        return this._entries.map(entry => {
            let toReturn: VisualReserveStationEntry = {
                instruction: { id: '', value: '', color: '' },
                Qj: '',
                Vj: '',
                Qk: '',
                Vk: '',
                A: '',
                ROB: ''
            };

            if (entry != null) {
                toReturn = {
                    instruction: { id: '', value: '', color: '' },
                    Qj: (entry.Qj !== -1) ? '[' + entry.Qj + ']' : '-',
                    Vj: (entry.Vj !== -1) ? '' + entry.Vj : '-',
                    Qk: (entry.Qk !== -1) ? '[' + entry.Qk + ']' : '-',
                    Vk: (entry.Vk !== -1) ? '' + entry.Vk : '-',
                    A: (entry.A !== -1) ? '@' + entry.A : '-',
                    ROB: '[' + entry.ROB + ']'
                };
                if (entry.instruction != null) {
                    toReturn.instruction.id = '' + entry.instruction.id;
                    toReturn.instruction.value = entry.instruction.toString();
                    toReturn.instruction.color = entry.instruction.color;
                }
            }

            return toReturn;
        });
    }
}