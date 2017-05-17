import { Machine } from './Machine';
import { Opcodes, Code } from './Code';

import { ReorderBufferEntry } from './ReorderBufferEntry';
import { PrefetchEntry } from './PrefetchEntry';
import { DecoderEntry } from './DecoderEntry';
import { ReserveStationEntry } from './ReserveStationEntry';
import { FunctionalUnit, FunctionalUnitType, FUNCTIONALUNITTYPESQUANTITY } from './FunctionalUnit';
import { Queue } from './collections/Queue';
import { Instruction } from './Instruction';
import { CommitStatus, SuperStage, SuperescalarStatus } from './SuperescalarEnums';

export class Superescalar extends Machine {

   private static PREDBITS = 2;
   private static PREDTABLEBITS = 4;
   private static PREDTABLESIZE = 1 << Superescalar.PREDTABLEBITS;

   private static ISSUE_DEF = 4;
   private static ISSUE_MIN = 2;
   private static ISSUE_MAX = 16;

   private _issue: number;
   private _code: Code;

   private _ROBGpr: number[];
   private _ROBFpr: number[];
   private _reserveStationEntry: ReserveStationEntry[][];
   private _reorderBuffer: Queue<ReorderBufferEntry>;
   private _prefetchUnit: Queue<PrefetchEntry>;
   private _decoder: Queue<DecoderEntry>;
   private _aluMem: FunctionalUnit[];

   private jumpPrediction: number[];

   constructor() {
      super();
      this.issue = Superescalar.ISSUE_DEF;

      this.ROBFpr = new Array(Machine.NFP).fill(-1);
      this.ROBGpr = new Array(Machine.NGP).fill(-1);
      this.jumpPrediction = new Array(Superescalar.PREDTABLEBITS).fill(0);
      this.reserveStationEntry = new Array(FUNCTIONALUNITTYPESQUANTITY).fill(null);
      // Calculate total ROB size
      let total = 0;
      for (let i = 0; i < FUNCTIONALUNITTYPESQUANTITY; i++) {
         this.reserveStationEntry[i] = new Array();
         total += this.getReserveStationSize(i);
      }
      this.reorderBuffer = new Queue<ReorderBufferEntry>();
      this.prefetchUnit = new Queue<PrefetchEntry>();
      this.decoder = new Queue<DecoderEntry>();

      this.reorderBuffer.init(total);
      this.decoder.init(this.issue);
      this.prefetchUnit.init(2 * this.issue);
      this._code = null;

      this.aluMem = new Array(this.functionalUnitNumbers[FunctionalUnitType.MEMORY]);

      for (let j = 0; j < this.functionalUnitNumbers[FunctionalUnitType.MEMORY]; j++) {
         this.aluMem[j] = new FunctionalUnit();
         this.aluMem[j].type = FunctionalUnitType.INTEGERSUM;
         this.aluMem[j].latency = this.functionalUnitLatencies[FunctionalUnitType.INTEGERSUM];
      }
   }

   init(reset: boolean) {
      super.init(reset);
      // Clean Gpr, Fpr, predSalto
      this.ROBGpr.fill(-1);
      this.ROBFpr.fill(-1);
      this.jumpPrediction.fill(0);
      // Calculate ROB size
      let total = 0;

      for (let i = 0; i < FUNCTIONALUNITTYPESQUANTITY; i++) {
         this.reserveStationEntry[i] = new Array();
         total += this.getReserveStationSize(i);
      }
      this.reorderBuffer.init(total);
      this.decoder.init(this.issue);
      this.prefetchUnit.init(2 * this.issue);
      this._code = null;

      this.aluMem = new Array(this.functionalUnitNumbers[FunctionalUnitType.MEMORY]).fill(new FunctionalUnit());

      for (let j = 0; j < this.functionalUnitNumbers[FunctionalUnitType.MEMORY]; j++) {
         this.aluMem[j] = new FunctionalUnit();
         this.aluMem[j].type = FunctionalUnitType.INTEGERSUM;
         this.aluMem[j].latency = this.functionalUnitLatencies[FunctionalUnitType.INTEGERSUM];
      }
   }

   ticPrefetch(): number {
      while (!this.prefetchUnit.isFull() && (this.pc < this.code.lines)) {
         let aux: PrefetchEntry = new PrefetchEntry();
         // Importante: Hago una copia de la instrucción original para distinguir
         // las distintas apariciones de una misma inst.
         aux.instruction = new Instruction();
         aux.instruction.copy(this.code.instructions[this.pc]);
         if (((aux.instruction.opcode === Opcodes.BEQ || aux.instruction.opcode === Opcodes.BNE || aux.instruction.opcode === Opcodes.BGT) && this.jumpPrediction[this.pc])) {
            this.pc = this.code.getBasicBlockInstruction(aux.instruction.getOperand(2));
         } else {
            this.pc++;
         }
         this.prefetchUnit.add(aux);
      }
      return this.prefetchUnit.getCount();
   }

   getReserveStationSize(type: FunctionalUnitType): number {
      return this.functionalUnitNumbers[type] * (this._functionalUnitLatencies[type] + 1);
   }

   ticDecoder(): number {
      for (let i = this.prefetchUnit.first; !this.decoder.isFull() && i !== this.prefetchUnit.end(); i = this.prefetchUnit.nextIterator(i)) {
         let aux: PrefetchEntry = this.prefetchUnit.elements[i];
         this.prefetchUnit.remove(i);
         let newDecoderEntry = new DecoderEntry();
         newDecoderEntry.instruction = aux.instruction;
         this.decoder.add(newDecoderEntry);
      }
      return this.decoder.getCount();
   }

   checkRegister(register: number, fp: boolean, reserveStationEntry: ReserveStationEntry, j: boolean) {
      let q = -1;
      let v = 0;
      if (fp) {
         // El registro tiene su valor listo
         if (!this._fpr.busy[register]) {
            v = this._fpr.content[register];
         } else if (this.reorderBuffer.elements[this.ROBFpr[register]].ready) {
            v = this.reorderBuffer.elements[this.ROBFpr[register]].value;
         } else {
            // El valor aún está calculándose
            q = this.ROBFpr[register];
         }
      } else {
         if (!this._gpr.busy[register]) {
            v = this._gpr.content[register];
         } else if (this.reorderBuffer.elements[this.ROBGpr[register]].ready) {
            v = this.reorderBuffer.elements[this.ROBGpr[register]].value;
         } else {
            // El valor aún está calculándose
            q = this.ROBGpr[register];
         }
      }

      if (j) {
         reserveStationEntry.Qj = q;
         reserveStationEntry.Vj = v;
      } else {
         reserveStationEntry.Qk = q;
         reserveStationEntry.Vk = v;
      }
   }

   issueInstruction(instruction: Instruction, type: number, robIndex: number) {
      let actualReserveStation = this.reserveStationEntry[type];
      actualReserveStation[actualReserveStation.length - 1].instruction = instruction;
      actualReserveStation[actualReserveStation.length - 1].ROB = robIndex;
      actualReserveStation[actualReserveStation.length - 1].FUNum = -1;
      actualReserveStation[actualReserveStation.length - 1].A = -1;
      /* tslint:disable:ter-indent */
      switch (instruction.opcode) {
         case Opcodes.ADD:
         case Opcodes.SUB:
         case Opcodes.MULT:
         case Opcodes.OR:
         case Opcodes.AND:
         case Opcodes.NOR:
         case Opcodes.XOR:
         case Opcodes.SLLV:
         case Opcodes.SRLV:
            this.checkRegister(instruction.getOperand(1), false, actualReserveStation[actualReserveStation.length - 1], true);
            this.checkRegister(instruction.getOperand(2), false, actualReserveStation[actualReserveStation.length - 1], false);
            this.ROBGpr[instruction.getOperand(0)] = robIndex;
            this._gpr.setBusy(instruction.getOperand(0), true);
            this.reorderBuffer.elements[robIndex].destinyRegister = instruction.getOperand(0);
            break;
         case Opcodes.ADDI:
            this.checkRegister(instruction.getOperand(1), false, actualReserveStation[actualReserveStation.length - 1], true);
            actualReserveStation[actualReserveStation.length - 1].Qk = -1;
            actualReserveStation[actualReserveStation.length - 1].Vk = instruction.getOperand(2);
            this.ROBGpr[instruction.getOperand(0)] = robIndex;
            this._gpr.setBusy(instruction.getOperand(0), true);
            this.reorderBuffer.elements[robIndex].destinyRegister = instruction.getOperand(0);
            break;
         case Opcodes.ADDF:
         case Opcodes.SUBF:
         case Opcodes.MULTF:
            this.checkRegister(instruction.getOperand(1), true, actualReserveStation[actualReserveStation.length - 1], true);
            this.checkRegister(instruction.getOperand(2), true, actualReserveStation[actualReserveStation.length - 1], false);
            this.ROBFpr[instruction.getOperand(0)] = robIndex;
            this._fpr.setBusy(instruction.getOperand(0), true);
            this.reorderBuffer.elements[robIndex].destinyRegister = instruction.getOperand(0);
            break;
         case Opcodes.SW:
            this.checkRegister(instruction.getOperand(0), false, actualReserveStation[actualReserveStation.length - 1], true);
            this.checkRegister(instruction.getOperand(2), false, actualReserveStation[actualReserveStation.length - 1], false);
            actualReserveStation[actualReserveStation.length - 1].A = instruction.getOperand(1);
            this.reorderBuffer.elements[robIndex].address = -1;
            break;
         case Opcodes.SF:
            this.checkRegister(instruction.getOperand(0), true, actualReserveStation[actualReserveStation.length - 1], true);
            this.checkRegister(instruction.getOperand(2), false, actualReserveStation[actualReserveStation.length - 1], false);
            actualReserveStation[actualReserveStation.length - 1].A = instruction.getOperand(1);
            this.reorderBuffer.elements[robIndex].address = -1;
            break;
         case Opcodes.LW:
            this.checkRegister(instruction.getOperand(2), false, actualReserveStation[actualReserveStation.length - 1], false);
            actualReserveStation[actualReserveStation.length - 1].Qj = -1;
            actualReserveStation[actualReserveStation.length - 1].Vj = 0;
            actualReserveStation[actualReserveStation.length - 1].A = instruction.getOperand(1);
            this.ROBGpr[instruction.getOperand(0)] = robIndex;
            this._gpr.setBusy(instruction.getOperand(0), true);
            this.reorderBuffer.elements[robIndex].destinyRegister = instruction.getOperand(0);
            this.reorderBuffer.elements[robIndex].address = -1;
            break;
         case Opcodes.LF:
            this.checkRegister(instruction.getOperand(2), false, actualReserveStation[actualReserveStation.length - 1], false);
            actualReserveStation[actualReserveStation.length - 1].Qj = -1;
            actualReserveStation[actualReserveStation.length - 1].Vj = 0;
            actualReserveStation[actualReserveStation.length - 1].A = instruction.getOperand(1);
            this.ROBFpr[instruction.getOperand(0)] = robIndex;
            this._fpr.setBusy(instruction.getOperand(0), true);
            this.reorderBuffer.elements[robIndex].destinyRegister = instruction.getOperand(0);
            this.reorderBuffer.elements[robIndex].address = -1;
            break;
         case Opcodes.BEQ:
         case Opcodes.BNE:
         case Opcodes.BGT:
            this.checkRegister(instruction.getOperand(0), false, actualReserveStation[actualReserveStation.length - 1], true);
            this.checkRegister(instruction.getOperand(1), false, actualReserveStation[actualReserveStation.length - 1], false);
            actualReserveStation[actualReserveStation.length - 1].A = instruction.getOperand(2);
            break;
         default:
            break;
      }
      /* tslint:enable:ter-indent */
   }

   ticIssue(): number {
      let cont = 0;
      // TODO REVFISAR ESTE < QUE
      for (let i = this.decoder.first; i !== this.decoder.end();
         i = this.decoder.nextIterator(i), cont++) {
         // console.log('Tic Issue', this.decoder.first, this.decoder.last);
         // console.log('Decoder?', this.decoder.elements, i, this.decoder.first, this.decoder.last);
         // TODO ESTO NO SE YO NO SE YO.
         let instruction: Instruction = this.decoder.elements[i].instruction;
         if (this.reorderBuffer.isFull()) {
            break;
         }
         let fuType: FunctionalUnitType = Code.opcodeToFunctionalUnitType(instruction.opcode);
         if ((this.reserveStationEntry[fuType].length + 1) === this.getReserveStationSize(fuType)) {
            break;
         }
         let newROB: ReorderBufferEntry = new ReorderBufferEntry();
         newROB.value = 0.0;
         newROB.destinyRegister = -1;
         newROB.address = -1;
         let robPos = this.reorderBuffer.add(newROB);
         let newER: ReserveStationEntry = new ReserveStationEntry();
         this.reserveStationEntry[fuType].push(newER);
         this.issueInstruction(instruction, fuType, robPos);
         // console.log('ROB?', this.reorderBuffer.elements[robPos]);
         this.reorderBuffer.elements[robPos].instruction = instruction;
         this.reorderBuffer.elements[robPos].ready = false;
         this.reorderBuffer.elements[robPos].superStage = SuperStage.SUPER_ISSUE;
         this.decoder.remove(i);
      }

      return cont;
   }

   checkStore(robIndex: number, address: number): boolean {
      // Compruebo que no haya algún store anterior...
      let i;
      for (i = this.reorderBuffer.first; i !== robIndex; i++) {
         let opcode: number = this.reorderBuffer.elements[i].instruction.opcode;
         if ((opcode === Opcodes.SW) || (opcode === Opcodes.SF)) {
            // ... sin la dir. calculada...
            if (this.reorderBuffer.elements[i].address === -1) {
               break;
               // ...o con la misma dir.
            } else if (this.reorderBuffer.elements[i].address === address) {
               break;
            }
         }
      }
      return i === robIndex;
   }

   executeInstruction(type: FunctionalUnitType, num: number) {
      let i = 0;
      /* tslint:disable:ter-indent */
      switch (type) {
         case FunctionalUnitType.INTEGERSUM:
         case FunctionalUnitType.INTEGERMULTIPLY:
         case FunctionalUnitType.FLOATINGSUM:
         case FunctionalUnitType.FLOATINGMULTIPLY:
         case FunctionalUnitType.JUMP:
            // Operandos disponibles
            while (i !== this.reserveStationEntry[type].length &&
               !((this.reserveStationEntry[type][i].Qj === -1)
                  && (this.reserveStationEntry[type][i].Qk === -1) &&
                  (this.reserveStationEntry[type][i].FUNum === -1))) {
               i++;
            }
            if (i !== this.reserveStationEntry[type].length) {
               this.reserveStationEntry[type][i].FUNum = num;
               this.reserveStationEntry[type][i].FUPos = this.functionalUnit[type][num].fillFlow(this.reserveStationEntry[type][i].instruction);
               this.reorderBuffer.elements[this.reserveStationEntry[type][i].ROB].superStage = SuperStage.SUPER_EXECUTE;
            }
            break;
         case FunctionalUnitType.MEMORY:
            // Fase 2 (Sólo los LOAD): Poner a ejecutar
            for (; i !== this.reserveStationEntry[type].length; i++) {
               let opcode = this.reserveStationEntry[type][i].instruction.opcode;
               if ((opcode === Opcodes.LW || opcode === Opcodes.LF)
                  && (this.reserveStationEntry[type][i].FUNum === -1)
                  && this.reorderBuffer.elements[this.reserveStationEntry[type][i].ROB].address !== 1
                  && this.checkStore(this.reserveStationEntry[type][i].ROB, this.reorderBuffer.elements[this.reserveStationEntry[type][i].ROB].address)) {
                  break;
               }
            }
            if (i !== this.reserveStationEntry[type].length) {
               this.reserveStationEntry[type][i].FUNum = num;
               this.reserveStationEntry[type][i].FUPos = this.functionalUnit[type][num].fillFlow(this.reserveStationEntry[type][i].instruction);
            }
            break;
         default:
            break;
      }
      /* tslint:enable:ter-indent */
   }

   ticExecute(): void {

      for (let i = 0; i < FUNCTIONALUNITTYPESQUANTITY; i++) {
         for (let j = 0; j < this.functionalUnitNumbers[i]; j++) {
            if (this.functionalUnit[i][j].isFree()) {
               this.executeInstruction(i, j);
            }
         }
      }
      // Después de pasar por todas las UF me encargo de las UF de cálculo de dir.
      // Fase 1b: Cálculo de la dirección
      // Primero termino la ejecución del cálculo de dir. en la ALU
      for (let i = 0; i < this.functionalUnitNumbers[FunctionalUnitType.MEMORY]; i++) {
         if (this.aluMem[i].getTopInstruction() != null) {
            // Busco la entrada de la ER que coincide con esa instrucción
            // TEstacionReserva::iterator it = ER[FunctionalUnitType.MEMORY].begin();
            let j = 0;
            while ((this.reserveStationEntry[FunctionalUnitType.MEMORY][j].FUNum !== this.functionalUnitNumbers[FunctionalUnitType.MEMORY] + i)
               || (this.reserveStationEntry[FunctionalUnitType.MEMORY][j].FUPos !== this.aluMem[i].getLast())) {
               j++;
            }

            this.reorderBuffer.elements[this.reserveStationEntry[FunctionalUnitType.MEMORY][j].ROB].address = this.reserveStationEntry[FunctionalUnitType.MEMORY][j].Vk + this.reserveStationEntry[FunctionalUnitType.MEMORY][j].A;
            this.reserveStationEntry[FunctionalUnitType.MEMORY][j].A = this.reorderBuffer.elements[this.reserveStationEntry[FunctionalUnitType.MEMORY][i].ROB].address;
            this.reserveStationEntry[FunctionalUnitType.MEMORY][j].FUNum = -1; // Vuelve a no tener una UF asociada
         }
         this.aluMem[i].tic();
      }
      // Fase 1a: Cálculo de la dirección
      // Relleno la ALU de cálculo de direcciones asociagda a esta UF
      for (let i = 0; i < this.functionalUnitNumbers[FunctionalUnitType.MEMORY]; i++) {
         // TEstacionReserva::iterator it = ER[FunctionalUnitType.MEMORY].begin();
         let j = 0;
         for (; j !== this.reserveStationEntry[FunctionalUnitType.MEMORY].length; j++) {
            // Operand value available AND address not calculated yet AND is being calculated right now
            if ((this.reserveStationEntry[FunctionalUnitType.MEMORY][j].Qk === -1)
               && (this.reorderBuffer.elements[this.reserveStationEntry[FunctionalUnitType.MEMORY][j].ROB].address === -1)
               && (this.reserveStationEntry[FunctionalUnitType.MEMORY][j].FUNum === -1)) {
               break;
            }
         }
         if (j !== this.reserveStationEntry[FunctionalUnitType.MEMORY].length) {
            this.reserveStationEntry[FunctionalUnitType.MEMORY][j].FUNum = i + this.functionalUnitNumbers[FunctionalUnitType.MEMORY];  // Así las distingo de las UF de Memoria
            this.reserveStationEntry[FunctionalUnitType.MEMORY][j].FUPos = this.aluMem[i].fillFlow(this.reserveStationEntry[FunctionalUnitType.MEMORY][j].instruction);
            this.reorderBuffer.elements[this.reserveStationEntry[FunctionalUnitType.MEMORY][j].ROB].superStage = SuperStage.SUPER_EXECUTE;
         }
      }
   }

   writeInstruction(type: FunctionalUnitType, num: number) {
      let resul;
      let inst: Instruction = this.functionalUnit[type][num].getTopInstruction();
      // console.log('Write instruction', inst);
      if (inst != null) {
         let i = 0;
         // TEstacionReserva::iterator it = ER[type].begin();
         while ((this.reserveStationEntry[type][i].FUNum !== num) ||
            (this.reserveStationEntry[type][i].FUPos !== this.functionalUnit[type][num].getLast())) {
            i++;   // NOTA: si esto no para es q la he cagao en algún paso anterior
         }
         let opcode = inst.opcode;
         /* tslint:disable:ter-indent */
         switch (opcode) {
            case Opcodes.ADD:
            case Opcodes.ADDI:
            case Opcodes.ADDF:
               resul = this.reserveStationEntry[type][i].Vj + this.reserveStationEntry[type][i].Vk;
               break;
            case Opcodes.SUB:
            case Opcodes.SUBF:
               resul = this.reserveStationEntry[type][i].Vj - this.reserveStationEntry[type][i].Vk;
               break;
            case Opcodes.OR:
               resul = this.reserveStationEntry[type][i].Vj | this.reserveStationEntry[type][i].Vk;
               break;
            case Opcodes.AND:
               resul = this.reserveStationEntry[type][i].Vj & this.reserveStationEntry[type][i].Vk;
               break;
            case Opcodes.XOR:
               resul = this.reserveStationEntry[type][i].Vj ^ this.reserveStationEntry[type][i].Vk;
               break;
            case Opcodes.NOR:
               resul = ~(this.reserveStationEntry[type][i].Vj | this.reserveStationEntry[type][i].Vk);
               break;
            case Opcodes.SRLV:
               resul = this.reserveStationEntry[type][i].Vj >> this.reserveStationEntry[type][i].Vk;
               break;
            case Opcodes.SLLV:
               resul = this.reserveStationEntry[type][i].Vj << this.reserveStationEntry[type][i].Vk;
               break;
            case Opcodes.MULT:
            case Opcodes.MULTF:
               resul = this.reserveStationEntry[type][i].Vj * this.reserveStationEntry[type][i].Vk;
               break;
            // En esta fase no se hace nada con los STORES
            case Opcodes.LW:
            case Opcodes.LF:
               let a = this.memory.getDatum(this.reserveStationEntry[type][i].A);
               resul = a.datum;
               if (!a.got) {
                  this.functionalUnit[type][num].status.stall = this.memoryFailLatency - this.functionalUnit[type][num].latency;
               }
               break;
            case Opcodes.BEQ:
               resul = (this.reserveStationEntry[type][i].Vj === this.reserveStationEntry[type][i].Vk) ? 1 : 0;
               break;
            case Opcodes.BNE:
               // console.log('Llega la instruccion de salto!');
               resul = (this.reserveStationEntry[type][i].Vj !== this.reserveStationEntry[type][i].Vk) ? 1 : 0;
               break;
            case Opcodes.BGT:
               resul = (this.reserveStationEntry[type][i].Vj > this.reserveStationEntry[type][i].Vk) ? 1 : 0;
               break;
            /* tslint:enable:ter-indent */
         }
         // Finalizó la ejecución de la instrucción
         if (this.functionalUnit[type][num].status.stall === 0) {
            if ((opcode !== Opcodes.BNE) && (opcode !== Opcodes.BEQ) && (opcode !== Opcodes.BGT)) {
               // Actualizo todas las ER
               // console.log(this.reserveStationEntry[type]);
               // console.log('No era un salto :c');
               for (let j = 0; j < FUNCTIONALUNITTYPESQUANTITY; j++) {
                  // TEstacionReserva::iterator itER = ER[i].begin();
                  for (let k = 0; k < this.reserveStationEntry[j].length; k++) {
                     // console.log(type, i, this.reserveStationEntry[type][i]);
                     if (this.reserveStationEntry[j][k].Qj === this.reserveStationEntry[type][i].ROB) {
                        this.reserveStationEntry[j][k].Vj = resul;
                        this.reserveStationEntry[j][k].Qj = -1;
                     }
                     if (this.reserveStationEntry[j][k].Qk === this.reserveStationEntry[type][i].ROB) {
                        this.reserveStationEntry[j][k].Vk = resul;
                        this.reserveStationEntry[j][k].Qk = -1;
                     }
                  }
               }
            }
            // console.log(i, type);
            // console.log(this.reserveStationEntry[type][i]);
            this.reorderBuffer.elements[this.reserveStationEntry[type][i].ROB].value = resul;
            this.reorderBuffer.elements[this.reserveStationEntry[type][i].ROB].superStage = SuperStage.SUPER_WRITERESULT;
            this.reorderBuffer.elements[this.reserveStationEntry[type][i].ROB].ready = true;
            // Elimino la entrada de la ER
            this.reserveStationEntry[type].splice(i, 1);
         }
      }
   }

   ticWriteResult(): void {
      // En primer lugar compruebo si hay STORES listos
      // let i = this.reserveStationEntry[FunctionalUnitType.MEMORY].begin();
      let i = 0;
      while (i !== this.reserveStationEntry[FunctionalUnitType.MEMORY].length) {
         let opcode = this.reorderBuffer.elements[this.reserveStationEntry[FunctionalUnitType.MEMORY][i].ROB].instruction.opcode;
         if (((opcode === Opcodes.SW) || (opcode === Opcodes.SF))
            && (this.reserveStationEntry[FunctionalUnitType.MEMORY][i].Qj === -1)
            && (this.reorderBuffer.elements[this.reserveStationEntry[FunctionalUnitType.MEMORY][i].ROB].address !== -1)) {
            this.reorderBuffer.elements[this.reserveStationEntry[FunctionalUnitType.MEMORY][i].ROB].value = this.reserveStationEntry[FunctionalUnitType.MEMORY][i].Vj;
            // NOTA: Lo pongo o no?
            this.reorderBuffer.elements[this.reserveStationEntry[FunctionalUnitType.MEMORY][i].ROB].superStage = SuperStage.SUPER_WRITERESULT;
            this.reorderBuffer.elements[this.reserveStationEntry[FunctionalUnitType.MEMORY][i].ROB].ready = true;
            // Elimino la entrada de la ER
            if (i === 0) {
               // TODO BEGIN
               this.reserveStationEntry[FunctionalUnitType.MEMORY].splice(i, 1);
               i = 0;
            } else {
               // TODO FIX THIS
               let j = i;
               i--;
               this.reserveStationEntry[FunctionalUnitType.MEMORY].splice(i, 1);
               i++;
            }
         } else {
            i++;
         }
      }

      // Después recorro todas las UF para recoger los resultados
      for (let i = 0; i < FUNCTIONALUNITTYPESQUANTITY; i++) {
         for (let j = 0; j < this.functionalUnitNumbers[i]; j++) {
            // TODO REMOVE THIS
            if (i === 5) {
               // console.log('JUMP instruction ready for jump', this.functionalUnit[i][j].status.stall);
            }
            if (this.functionalUnit[i][j].status.stall === 0) {
               this.writeInstruction(i, j);
            }
            // Avanzo el reloj de esa UF
            this.functionalUnit[i][j].tic();
         }
      }
   }

   checkJump(rob: ReorderBufferEntry): boolean {
      // console.log('Comprobar salto');
      // Se comprueba si la predicción acertó
      // Typescript does not support ^ operator for boolean
      if (+this.prediction(rob.instruction.id) ^ +!!rob.value) {
         this.changePrediction(rob.instruction.id, !!rob.value);
         // Se cambia el PC
         if (rob.value) {
            this.pc = this.code.getBasicBlockInstruction(rob.instruction.getOperand(2));
         } else {
            this.pc = rob.instruction.id + 1;
         }
         // Se limpia el ROB
         // let i = 0;
         // TReorderBuffer::iterator itROB = ROB.begin();
         for (let i = 0; i !== this.reorderBuffer.end(); i++) {
            let aux: ReorderBufferEntry = this.reorderBuffer.remove(i);
         }
         // Se limpian las UF y ER
         for (let i = 0; i < FUNCTIONALUNITTYPESQUANTITY; i++) {
            for (let j = 0; j < this.functionalUnitNumbers[i]; j++) {
               this.functionalUnit[i][j].clean();
               this.reserveStationEntry[i].fill(null);
            }
         }
         // y las UF de cálculo de direcciones
         for (let i = 0; i < this.functionalUnitNumbers[FunctionalUnitType.MEMORY]; i++) {
            this.aluMem[i].clean();
         }
         // Se limpia el decoder
         // TDecoder::iterator itDec = decoder.begin();
         for (let i = 0; i !== this.decoder.end(); i++) {
            let aux: DecoderEntry = this.decoder.remove(i);
            // delete aux.instruction;
            // delete aux;
         }
         //        decoder.clear();
         // Se limpia la unidad de Prefetch
         // TPrefetchUnit::iterator itPre = prefetchUnit.begin();

         for (let i = 0; i !== this.prefetchUnit.end(); i++) {
            let aux: PrefetchEntry = this.prefetchUnit.remove(i);
            // delete aux.instruction;
            // delete aux;
         }
         //        prefetchUnit.clear();
         // Limpio también las estructuras asociadas a los registros
         this.ROBGpr.fill(-1);
         this.ROBFpr.fill(-1);
         this._gpr.setAllBusy(false);
         this._fpr.setAllBusy(false);
         // console.log('El salto dio false', false);
         return false;
      }
      // CHECK !! AS (BOOL CAST)
      // console.log('Cambiar la preddicion', true);
      this.changePrediction(rob.instruction.id, !!rob.value);
      return true;
   }

   ticCommit(): CommitStatus {
      for (let i = 0; i < this.issue; i++) {
         if (this.reorderBuffer.isEmpty()) {
            return CommitStatus.SUPER_COMMITEND;
         } else if (!this.reorderBuffer.top().ready) {
            return CommitStatus.SUPER_COMMITNO;
         } else {
            let h = this.reorderBuffer.first;
            let aux: ReorderBufferEntry = this.reorderBuffer.remove();
            /* tslint:disable ter-indent */
            switch (aux.instruction.opcode) {
               case Opcodes.SW:
               case Opcodes.SF:
                  this.memory.setDatum(aux.address, aux.value);
                  break;
               case Opcodes.BEQ:
               case Opcodes.BNE:
               case Opcodes.BGT:
                  // console.log('heeey saltito!');
                  if (!this.checkJump(aux)) {
                     return CommitStatus.SUPER_COMMITMISS;
                  }
                  break;
               case Opcodes.ADD:
               case Opcodes.ADDI:
               case Opcodes.SUB:
               case Opcodes.OR:
               case Opcodes.AND:
               case Opcodes.NOR:
               case Opcodes.XOR:
               case Opcodes.SLLV:
               case Opcodes.SRLV:
               case Opcodes.MULT:
               case Opcodes.LW:
                  this._gpr.setContent(aux.destinyRegister, aux.value, false);
                  // Pase lo que pase R0 vale 0
                  this._gpr.setContent(0, 0, false);
                  if (this.ROBGpr[aux.destinyRegister] === h) {
                     this._gpr.setBusy(aux.destinyRegister, false);
                  }
                  break;
               case Opcodes.ADDF:
               case Opcodes.MULTF:
               case Opcodes.SUBF:
               case Opcodes.LF:
                  this._fpr.setContent(aux.destinyRegister, aux.value, false);
                  if (this.ROBFpr[aux.destinyRegister] === h) {
                     this._fpr.setBusy(aux.destinyRegister, false);
                  }
                  break;
               default:
                  break;
            }
            /* tslint:enable ter-indent */
         }
      }
      return CommitStatus.SUPER_COMMITOK;
   }

   tic(): SuperescalarStatus {
      this.status.cycle++;
      // COMMiT stage
      let commit = this.ticCommit();
      if (commit !== CommitStatus.SUPER_COMMITEND && commit !== CommitStatus.SUPER_COMMITMISS) {
         // WRITE RESULT STAGE
         this.ticWriteResult();
         // EXECUTE STAGE
         this.ticExecute();
      }

      // ISSUE STAGE
      let resultIssue = this.ticIssue();
      // DECODER STAGE
      let resultDecoder = this.ticDecoder();
      // PREFETCH STAGE
      let resultPrefetch = this.ticPrefetch();
      if ((resultIssue + resultDecoder + resultPrefetch === 0) && (commit === CommitStatus.SUPER_COMMITEND)) {
         return SuperescalarStatus.SUPER_ENDEXE;
      }
      for (let i = this.prefetchUnit.first; i !== this.prefetchUnit.last; i = this.prefetchUnit.nextIterator(i)) {
         if (this.prefetchUnit.elements[i].instruction.breakPoint) {
            this.status.breakPoint = true;
            return SuperescalarStatus.SUPER_BREAKPOINT;
         }
      }
      return SuperescalarStatus.SUPER_OK;
   }

   changePrediction(address: number, result: boolean) {
      address = address % Superescalar.PREDTABLESIZE;
      /* tslint:disable ter-indent */
      switch (this.jumpPrediction[address]) {
         case 0: this.jumpPrediction[address] = (result) ? 1 : 0; break;
         case 1: this.jumpPrediction[address] = (result) ? 3 : 0; break;
         case 2: this.jumpPrediction[address] = (result) ? 3 : 0; break;
         case 3: this.jumpPrediction[address] = (result) ? 3 : 2; break;
         default: this.jumpPrediction[address] = 0; break;
      }
      /* tslint:enable ter-indent */
   }

   prediction(address: number): boolean {
      return (this.jumpPrediction[address % Superescalar.PREDTABLESIZE] >= Superescalar.PREDBITS);
   }

   public get code(): Code {
      return this._code;
   }

   public set code(value: Code) {
      this._code = value;
   }

   public get issue(): number {
      return this._issue;
   }

   public set issue(value: number) {
      this._issue = value;
   }

   public get ROBGpr(): number[] {
      return this._ROBGpr;
   }

   public set ROBGpr(value: number[]) {
      this._ROBGpr = value;
   }

   public get ROBFpr(): number[] {
      return this._ROBFpr;
   }

   public set ROBFpr(value: number[]) {
      this._ROBFpr = value;
   }

   public get reserveStationEntry(): ReserveStationEntry[][] {
      return this._reserveStationEntry;
   }

   public set reserveStationEntry(value: ReserveStationEntry[][]) {
      this._reserveStationEntry = value;
   }

   public get reorderBuffer(): Queue<ReorderBufferEntry> {
      return this._reorderBuffer;
   }

   public set reorderBuffer(value: Queue<ReorderBufferEntry>) {
      this._reorderBuffer = value;
   }

   public get prefetchUnit(): Queue<PrefetchEntry> {
      return this._prefetchUnit;
   }

   public set prefetchUnit(value: Queue<PrefetchEntry>) {
      this._prefetchUnit = value;
   }

   public get decoder(): Queue<DecoderEntry> {
      return this._decoder;
   }

   public set decoder(value: Queue<DecoderEntry>) {
      this._decoder = value;
   }

   public get aluMem(): FunctionalUnit[] {
      return this._aluMem;
   }

   public set aluMem(value: FunctionalUnit[]) {
      this._aluMem = value;
   }

   public get $jumpPrediction(): number[] {
      return this.jumpPrediction;
   }

   public set $jumpPrediction(value: number[]) {
      this.jumpPrediction = value;
   }

}
