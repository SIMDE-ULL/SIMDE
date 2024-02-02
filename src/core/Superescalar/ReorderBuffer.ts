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
        let entry = this._queue[this.getInstructionPos(mapping[register])];
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
        let entry = this._queue[this.getInstructionPos(mapping[register])];
        return entry.value;

    }

    /**
     * getRegisterMapping - this method returns the rob instr uuid wich will write in that register.
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
    }

    /**
     * purgeCommitMapping - this method removes the mapping of the register of the instruction that is going to be commited. Returns true if no more instructions have a mapping to that register
     */
    public purgeCommitMapping(): boolean {
        let mapping = this._queue[0].instruction.isDestinyRegisterFloat() ? this._FprMapping : this._GprMapping;
        let register = this._queue[0].destinyRegister;
        let uuid = this._queue[0].instruction.uuid;

        if (mapping[register] === uuid) {
            delete mapping[register];
            return true;
        }
        return false;
    }

    /**
     * issueInstruction - this method issues an instruction to the reorder buffer
     */
    public issueInstruction(instruction: Instruction) {
        let newEntry = { instruction: instruction, ready: false, value: 0.0, destinyRegister: instruction.getDestinyRegister(), address: -1, superStage: SuperStage.SUPER_ISSUE };
        let pos = this._queue.push(newEntry) - 1;

        if (instruction.getDestinyRegister() !== -1) {
            if (instruction.isDestinyRegisterFloat()) {
                this._FprMapping[instruction.getDestinyRegister()] = instruction.uuid;
            } else {
                this._GprMapping[instruction.getDestinyRegister()] = instruction.uuid;
            }
        }
    }

    public getInstructionPos(uuid: number): number {
        for (let i = 0; i < this._queue.length; i++) {
            if (this._queue[i].instruction.uuid === uuid) {
                return i;
            }
        }
        return -1;
    }

    /**
     * executeInstruction - this method executes an instruction from the reorder buffer
     */
    public executeInstruction(uuid: number) {
        this._queue[this.getInstructionPos(uuid)].superStage = SuperStage.SUPER_EXECUTE;
    }

    /**
     * writeResultValue - this method writes the result value of an instruction to the reorder buffer
     */
    public writeResultValue(uuid: number, value: number) {
        let pos = this.getInstructionPos(uuid);
        this._queue[pos].value = value;
        this._queue[pos].ready = true;
        this._queue[pos].superStage = SuperStage.SUPER_WRITERESULT;
    }

    public getInstruction(uuid: number = -1): Instruction {
        let pos = (uuid === -1) ? 0 : this.getInstructionPos(uuid);
        return this._queue[pos].instruction;
    }

    /**
     * writeResultAddress - this method writes the result address of an instruction to the reorder buffer
     */
    public writeResultAddress(uuid: number, address: number) {
        let pos = this.getInstructionPos(uuid);
        this._queue[pos].address = address;
    }

    /**
     * hasResultValue - this method checks if an instruction has already the result value
     */
    public hasResultValue(uuid: number): boolean {
        let pos = this.getInstructionPos(uuid);
        return this._queue[pos].ready;
    }

    /**
     * getResultValue - this method returns the result value of the top instruction
     */
    public getResultValue(): number {
        return this._queue[0].value;
    }

    /**
     * hasResultAddress - this method checks if an instruction has already the result address
     */
    public hasResultAddress(uuid: number): boolean {
        let pos = this.getInstructionPos(uuid);
        return this._queue[pos].address !== -1;
    }

    /**
     * getResultAddress - this method returns the result address of the top instruction
     */
    public getResultAddress(): number {
        return this._queue[0].address;
    }

    /**
     * hasPreviousStores - this method checks if there are previous store instructions that write to the same address
     */
    public hasPreviousStores(uuid: number): boolean {
        let pos = this.getInstructionPos(uuid);
        let address = this._queue[pos].address;
        for (let i = 0; i < pos; i++) {
            // check if it is a store instruction and if it the address is the same or if it doesn't have a result address yet
            if (this._queue[i].instruction.isStoreInstruction() && (this._queue[pos].address === -1 || this._queue[i].address === address)) {
                return true;
            }
        }
        return false;

    }

    public getVisualData(): VisualReorderBufferEntry[] {
        return this._queue.map(entry => {
            if (entry != null) {
                let aux = {
                    instruction: { id: '', uuid: '', value: '' },
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
                    aux.instruction.uuid = '' + entry.instruction.uuid;
                    aux.instruction.value = entry.instruction.toString();
                }
                return aux;
            }
            return {
                instruction: { id: '', uuid: '', value: '' },
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
            visualMap[(isFloat ? "F" : "R") + key] = this.getInstructionPos(mapping[key]);
        }
        return visualMap;
    }

    public getVisualInstructionMap(): { [uuid: number]: number } {
        let visualMap: { [uuid: string]: number } = {};
        for (let i = 0; i < this._queue.length; i++) {
            visualMap[this._queue[i].instruction.uuid] = i;
        }
        return visualMap;
    }
}