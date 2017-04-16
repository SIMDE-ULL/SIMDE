import { Instruction } from './Instruction';

export class ReorderBufferEntry {
    private instruction: Instruction;
    private ready: boolean;
    private value: number;
    private destinyRegister: number;
    private address: number;
    private superStage: struct;

}