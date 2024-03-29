export class JumpPredictor {
  _table: number[];

  public get size(): number {
    return this._size;
  }

  constructor(private _size: number) {
    this._table = new Array(_size);
    this._table.fill(0);
  }

  public getPrediction(address: number): boolean {
    return this._table[address % this._size] > 1;
  }

  public updatePrediction(address: number, taken: boolean) {
    const tableAddress = address % this._size;
    switch (this._table[tableAddress]) {
      case 0:
        this._table[tableAddress] = taken ? 1 : 0;
        break;
      case 1:
        this._table[tableAddress] = taken ? 3 : 0;
        break;
      case 2:
        this._table[tableAddress] = taken ? 3 : 0;
        break;
      case 3:
        this._table[tableAddress] = taken ? 3 : 2;
        break;
      default:
        this._table[tableAddress] = 0;
        break;
    }
  }

  public getVisualTable(): string[] {
    return this._table.map((value) => {
      switch (value) {
        case 0:
          return "F(00)";
        case 1:
          return "F(01)";
        case 2:
          return "V(10)";
        case 3:
          return "V(11)";
        default:
          return "---";
      }
    });
  }
}
