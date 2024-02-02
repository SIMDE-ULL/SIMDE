import { SuperStage, stageToString } from './SuperescalarEnums';
import { Instruction } from '../Common/Instruction';

export interface VisualReorderBufferEntry {
    instruction: {
        id: string,
        value: string,
    },
    destinyRegister: string,
    value: string,
    address: string,
    superStage: string
}

interface ReorderBufferEntry {
    instruction: Instruction;
    ready: boolean;
    value: number;
    destinyRegister: number;
    address: number;
    superStage: SuperStage;
}

// TODO: dont use rob entry pos as a reference to the instruction, use an instruction uid instead?
export class ReorderBuffer {
    _queue: ReorderBufferEntry[];
    _GprMapping: { [reg: number]: number };
    _FprMapping: { [reg: number]: number };
    _size: number;

    constructor(size: number) {
        this._queue = [];
        this._size = size;
    }

    /**
     * isFull - this method checks if the reorder buffer is full
     */
    public isFull(): boolean {
        return this._queue.length >= this._size;
    }

    /**
     * isEmpty - this method checks if the reorder buffer is empty
     */
    public isEmpty(): boolean {
        return this._queue.length === 0;
    }

    /**
     * clear - this method clears the reorder buffer, it is called when the machine is reseted
     */
    public clear() {
        this._queue = [];
        this._FprMapping = {};
        this._GprMapping = {};
    }

    /**
     * isRegisterValueReady - this method checks if the rob entry wich will write in that register has already the new value
     */
    public isRegisterValueReady(register: number, isFloatRegister: boolean): boolean {
        let mapping = isFloatRegister ? this._FprMapping : this._GprMapping;
        if (mapping[register] === undefined) {
            // error
            throw new Error("Register not found in mapping");
        }
        let entry = this._queue[mapping[register]];
        return entry.ready;

    }

    /**
     * getRegisterValue - this method returns the new value of a register wich still has not been written to the register file
     */
    public getRegisterValue(register: number, isFloatRegister: boolean): number {
        let mapping = isFloatRegister ? this._FprMapping : this._GprMapping;
        if (mapping[register] === undefined) {
            // error
            throw new Error("Register not found in mapping");
        }
        let entry = this._queue[mapping[register]];
        return entry.value;

    }

    /**
     * getRegisterMapping - this method returns the rob entry number wich will write in that register.
     */
    public getRegisterMapping(register: number, isFloatRegister: boolean): number {
        let mapping = isFloatRegister ? this._FprMapping : this._GprMapping;
        if (mapping[register] === undefined) {
            // error
            throw new Error("Register not found in mapping");
        }
        return mapping[register];

    }

    /**
     * canCommitStoreInstruction - this checks that the next instruction is an instruction that writes to a memory region and if it is ready to be commited
     */
    public canCommitStoreInstruction(): boolean {
        let entry = this._queue[0];
        return entry != undefined && entry.ready && entry.instruction.isStoreInstruction();
    }

    /**
     * canCommitJumpInstruction - this checks that the next instruction to be commited is a jump instruction and if it is ready to be commited
     */
    public canCommitJumpInstruction(): boolean {
        let entry = this._queue[0];
        return entry != undefined && entry.ready && entry.instruction.isJumpInstruction();
    }

    /**
     * canCommitRegisterInstruction - this checks that the next instruction to be commited is an instruction that writes to a register and if it is ready to be commited
     */
    public canCommitRegisterInstruction(): boolean {
        let entry = this._queue[0];
        return entry != undefined && entry.ready && entry.instruction.isRegisterInstruction();
    }

    /**
     * commitInstruction - this method commits an instruction from the reorder buffer
     */
    public commitInstruction() {
        this._queue.shift();

        // update all references to the rob entries in the mappings
        for (let key in this._GprMapping) {
            if (this._GprMapping[key] > 0) {
                this._GprMapping[key]--;
            }
        }
        for (let key in this._FprMapping) {
            if (this._FprMapping[key] > 0) {
                this._FprMapping[key]--;
            }
        }
    }

    /**
     * purgeCommitMapping - this method removes the mapping of the register of the instruction that is going to be commited. Returns true if no more instructions have a mapping to that register
     */
    public purgeCommitMapping(): boolean {
        let mapping = this._queue[0].instruction.isDestinyRegisterFloat() ? this._FprMapping : this._GprMapping;
        let register = this._queue[0].destinyRegister;

        if (mapping[register] === 0) {
            delete mapping[register];
            return true;
        }
        return false;
    }

    /**
     * issueInstruction - this method issues an instruction to the reorder buffer
     */
    public issueInstruction(instruction: Instruction): number {
        let newEntry = { instruction: instruction, ready: false, value: 0.0, destinyRegister: instruction.getDestinyRegister(), address: -1, superStage: SuperStage.SUPER_ISSUE };
        let pos = this._queue.push(newEntry) - 1;

        if (instruction.getDestinyRegister() !== -1) {
            if (instruction.isDestinyRegisterFloat()) {
                this._FprMapping[instruction.getDestinyRegister()] = pos;
            } else {
                this._GprMapping[instruction.getDestinyRegister()] = pos;
            }
        }
        return pos;
    }

    /**
     * executeInstruction - this method executes an instruction from the reorder buffer
     */
    public executeInstruction(pos: number) {
        this._queue[pos].superStage = SuperStage.SUPER_EXECUTE;
    }

    /**
     * writeResultValue - this method writes the result value of an instruction to the reorder buffer
     */
    public writeResultValue(pos: number, value: number) {
        this._queue[pos].value = value;
        this._queue[pos].ready = true;
        this._queue[pos].superStage = SuperStage.SUPER_WRITERESULT;
    }

    public getInstruction(pos: number = 0): Instruction {
        return this._queue[pos].instruction;
    }

    /**
     * writeResultAddress - this method writes the result address of an instruction to the reorder buffer
     */
    public writeResultAddress(pos: number, address: number) {
        this._queue[pos].address = address;
    }

    /**
     * hasResultValue - this method checks if an instruction has already the result value
     */
    public hasResultValue(pos: number): boolean {
        return this._queue[pos].ready;
    }

    /**
     * getResultValue - this method returns the result value of an instruction
     */
    public getResultValue(pos: number = 0): number {
        return this._queue[pos].value;
    }

    /**
     * hasResultAddress - this method checks if an instruction has already the result address
     */
    public hasResultAddress(pos: number): boolean {
        return this._queue[pos].address !== -1;
    }

    /**
     * getResultAddress - this method returns the result address of an instruction
     */
    public getResultAddress(pos: number = 0): number {
        return this._queue[pos].address;
    }

    /**
     * hasPreviousStores - this method checks if there are previous store instructions that write to the same address
     */
    public hasPreviousStores(pos: number): boolean {
        let address = this._queue[pos].address;
        for (let i = 0; i < pos; i++) {
            // check if it is a store instruction and if it the address is the same or if it doesn't have a result address yet
            if (this._queue[i].instruction.isStoreInstruction() && (!this.hasResultAddress(i) || this._queue[i].address === address)) {
                return true;
            }
        }
        return false;

    }

    public getVisualData(): VisualReorderBufferEntry[] {
        return this._queue.map(entry => {
            if (entry != null) {
                let aux = {
                    instruction: { id: '', value: ''},
                    destinyRegister: (entry.destinyRegister !== -1) ? '' + entry.destinyRegister : '-',
                    value: '' + entry.value,
                    address: (entry.address !== -1) ? '@' + entry.address : '-',
                    superStage: stageToString(entry.superStage)
                };
                if (entry.instruction != null) {
                    if (entry.destinyRegister !== -1) {
                        if (entry.instruction.isDestinyRegisterFloat()) {
                            aux.destinyRegister = 'F' + aux.destinyRegister;
                        } else {
                            aux.destinyRegister = 'R' + aux.destinyRegister;
                        }
                    }
                    aux.instruction.id = '' + entry.instruction.id;
                    aux.instruction.value = entry.instruction.toString();
                }
                return aux;
            }
            return {
                instruction: { id: '', value: '' },
                destinyRegister: '',
                value: '',
                address: '',
                superStage: ''
            };
        });
    }

    public getVisualRegisterMap(isFloat: boolean): { [reg: string]: number } {
        let mapping = isFloat ? this._FprMapping : this._GprMapping;

        let visualMap: { [reg: string]: number } = {};
        for (let key in mapping) {
            visualMap[(isFloat ? "F" : "R") + key] = mapping[key];
        }
        return visualMap;
    }
}