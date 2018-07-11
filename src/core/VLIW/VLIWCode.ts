import { LargeInstruction } from '../LargeInstruction';
import { FunctionalUnit } from '../Common/FunctionalUnit';

export class VLIWCode {
    private _instructions: LargeInstruction[];
    private _nInst: number;

    TCodigoVLIW() {
        this._instructions = [];
        this._nInst = 0;
    }

    TCodigoVLIW(n: number) {
        this._instructions = new Array(n);
        this._instructions.fill(new LargeInstruction());
        this._nInst = 0;
    }

    //Getters
    public getInst(): number {
        return _nInst;
    }

    public getLargeInstruction(ind: number): LargeInstruction {
        if((ind < 0) || (ind >= this._nInst)) {
            return NULL;
        }
        return this._instructions[ind];
    }

    public getBreakPoint(n: number): boolean {
        return _instructions[ind].getBreakPoint();
    }

    //Setters
    public setNInst(n: number) {
        this._instructions = new LargeInstruction[n];
        this._nInst = n;
    }

    public setBreakPoint(ind: number, b: boolean) {
        this._instructions[ind].setBreakPoint(b);
    }

    public addOperacion(ind: number, oper: TOperacionVLIW) {
        this._instructions[ind].addOperacion(oper);
    }

    public clear() {
        this._instructions = NULL;
        this._nInst = 0;
    }

    public save(/*AnsiString nombre*/) {
      //ofstream out(nombre.c_str());
      //out << nInst << endl;
      for (let i = 0; i < nInst; i++) {
          let noper = _instructions[i].getNOper();
          //out << noper;
          for (let j = 0; j < noper; j++) {
              TOperationVLIW operation = _instructions[i].getOperation(j);
              //out << "\t" << oper->getId();
              //out << " " << oper->getTipoUF();
              //out << " " << oper->getNumUF();
              //out << " " << oper->getPred();
              if ((operation.opcode() == Opcodes.BNE) ||
                  (operation.opcode() == Opcodes.BEQ)) {
                  //out << " " << oper->getOp(2);
                  //out << " " << oper->getPredTrue();
                  //out << " " << oper->getPredFalse();
              }
          }
          //out << endl;
      }
    }

    public load(input: string, cod: TCodigo): boolean {
      let n, noper, ind, tipo, num;
      //ifstream in(nombre.c_str());
      //in >> n;
      _instructions = new LargeInstruction[n];
      nInst = n;
      for (let i = 0; i < nInst; i++) {
          //in >> noper;
          for (let j = 0; j < noper; j++) {
              let tipo, num, pred, predTrue = 0, predFalse = 0;
              //in >> ind;
              //in >> tipo;
              //in >> num;
              //in >> pred;
              //if (cod->getTipoUF(ind) != tipo) {
                  clear();
                  return false;
              //}
              //TOperacionVLIW *operation = new TOperacionVLIW(*cod->getInstruccion(ind), (TTipoUF)tipo, num);
              //oper->setPred(pred);
              if ((operation.opcode() == Opcodes.BNE) ||
                  (operation.opcode() == Opcodes.BEQ)) {
                  let destino, predTrue, predFalse;
                  //in >> destino;
                  //operation.setOp(2, destino);
                  //in >> predTrue;
                  //in >> predFalse;
                  operation.setPredTrue(predTrue);
                  operation.setPredFalse(predFalse);
              }
              _instructions[i].addOperacion(operation);
          }
      }
      return true;
    }
}
