import { MACHINE_REGISTER_SIZE } from '../Constants';

export class Register {

    private static REGISTRY_NUMBER: number = MACHINE_REGISTER_SIZE;

    private _content: number[];
    private _bufferIn: number[];
    private _busy: boolean[];
    private _zeroWritable: boolean;

    constructor(zeroWritable: boolean = false) {
        this.busy = new Array(Register.REGISTRY_NUMBER);
        this.content = new Array(Register.REGISTRY_NUMBER);
        this.bufferIn = new Array(Register.REGISTRY_NUMBER);
        this._zeroWritable = zeroWritable;
    }

    public get content(): number[] {
        return this._content;
    }

    // TODO: dont expose this
    public set content(value: number[]) {
        this._content = value;
        // Don't allow to set R0 to a value different than 0 if zeroWritable is false
        if (!this._zeroWritable) {
            this._content[0] = 0;
        }
    }

    public get bufferIn(): number[] {
        return this._bufferIn;
    }

    public set bufferIn(value: number[]) {
        this._bufferIn = value;
    }

    public get busy(): boolean[] {
        return this._busy;
    }

    // TODO: dont expose this
    public set busy(value: boolean[]) {
        this._busy = value;
    }

    public setContent(index: number, value: number, useBuffer: boolean) {
        // Don't allow to set R0 to a value different than 0 if zeroWritable is false
        if (index > 0 || this._zeroWritable) {
            if (useBuffer) {
                this.bufferIn[index] = value;
                this.busy[index] = true;
            } else {

                this.content[index] = value;

            }
        }
    }

    public getContent(index: number): number {
        return this.content[index];
    }

    public getRegistryNumber() {
        return Register.REGISTRY_NUMBER;
    }

    public setBusy(index: number, value: boolean) {
        // Don't allow to set R0 as busy(as it will allow the ROB to redirect reads to R0 to instructions writing to R0) if zeroWritable is false
        if (index > 0 || this._zeroWritable) {
            this.busy[index] = value;
        }
    }

    public setAllBusy(value: boolean) {
        this.busy.fill(value);
        // Don't allow to set R0 as busy if zeroWritable is false
        if (!this._zeroWritable) {
            this.busy[0] = false;
        }
    }

    public setAllContent(value: number) {
        this.content.fill(value);
        this.setAllBusy(false);
        // Don't allow to set R0 to a value different than 0
        if (!this._zeroWritable) {
            this._content[0] = 0;
        }
    }

    tic() {
        for (let i = 0; i < Register.REGISTRY_NUMBER; i++) {
            if (this.busy[i]) {
                this.busy[i] = false;
                // Reuse setContent logic
                this.setContent(i, this.bufferIn[i], false);
            }
        }
    }
}
