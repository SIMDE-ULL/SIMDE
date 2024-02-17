export class Register {
  private _content: number[];
  private _bufferIn: number[];
  private _busy: boolean[];

  public get content(): number[] {
    return this._content;
  }

  public get busy(): boolean[] {
    return this._busy;
  }

  constructor(
    private _numberOfRegs: number,
    private _zeroWritable: boolean = false
  ) {
    this._busy = new Array(_numberOfRegs);
    this._content = new Array(_numberOfRegs);
    this._bufferIn = new Array(_numberOfRegs);
  }

  public setContent(index: number, value: number, useBuffer: boolean) {
    // Don't allow to set R0 to a value different than 0 if zeroWritable is false
    if (index > 0 || this._zeroWritable) {
      if (useBuffer) {
        this._bufferIn[index] = value;
        this.busy[index] = true;
      } else {
        this.content[index] = value;
      }
    }
  }

  public setBusy(index: number, value: boolean) {
    // Don't allow to set R0 as busy(as it will allow the ROB to redirect reads to R0 to instructions writing to R0) if zeroWritable is false
    if (index > 0 || this._zeroWritable) {
      this.busy[index] = value;
    }
  }

  public setAllBusy(value: boolean) {
    this._busy.fill(value);
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

  public tic() {
    for (let i = 0; i < this._numberOfRegs; i++) {
      if (this.busy[i]) {
        this._busy[i] = false;
        // Reuse setContent logic
        this.setContent(i, this._bufferIn[i], false);
      }
    }
  }
}
