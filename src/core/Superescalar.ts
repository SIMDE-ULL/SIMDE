import { Machine } from './Machine';
import { Opcodes, Code } from './Code';

import { ReorderBufferEntry } from './ReorderBufferEntry';
import { PrefetchEntry } from './PrefetchEntry';
import { DecoderEntry } from './DecoderEntry';
import { ReserveStationEntry } from './ReserveStationEntry';
import { FunctionalUnit, FunctionalUnitType, FUNCTIONALUNITTYPESQUANTITY } from './FunctionalUnit';
import { Tail } from './Tail';
import { Instruction } from './Instruction';

export enum CommitStatus {
    SUPER_COMMITOK = 0,
    SUPER_COMMITEND,
    SUPER_COMMITMISS,
    SUPER_COMMITNO
}

export enum SuperStage {
    SUPER_ISSUE = 0,
    SUPER_EXECUTE,
    SUPER_WRITERESULT,
    SUPER_COMMIT
}

export enum SuperescalarStatus {
    SUPER_ENDEXE = -2,
    SUPER_BREAKPOINT = -1,
    SUPER_OK = 0
}


export class Superescalar extends Machine {

    private static const NBITSPRED = 2;
    private static const NBITSTABLAPRED = 4;
    private static const TAMANOTABLAPRED = 1 << 4;

    private static const ISSUE_DEF = 4;
    private static const ISSUE_MIN = 2;
    private static const ISSUE_MAX = 16;

    private issue: number;
    private code: Code;

    private ROBGpr: number[];
    private ROBFpr: number[];
    private reserveStationEntry: ReserveStationEntry[];
    private reorderBuffer: Tail;
    private prefetchUnit: Tail;
    private decoder: Tail;
    private aluMem: FunctionalUnit[];

    private jumpPrediction: number[];

    constructor() {
        super();
        this.issue = Superescalar.ISSUE_DEF;

        this.ROBFpr = new Array(Machine.NFP).fill(-1);
        this.ROBGpr = new Array(Machine.NGP).fill(-1);
        this.jumpPrediction = new Array(Superescalar.NBITSTABLAPRED).fill(0);

        // Calculate total ROB size
        let total = 0;

        // TODO Can I remove this piece of code?

        for (let i = 0; i < FUNCTIONALUNITTYPESQUANTITY; i++) {
            // Wtf es esto, ¿Y este metodo?
            this.reserveStationEntry[i] = new ReserveStationEntry();
            // total += this.getReserveStationEntrySize(i);
        }
        this.reorderBuffer = new Tail();
        this.prefetchUnit = new Tail();
        this.decoder = new Tail();

        this.reorderBuffer.init(total);
        this.decoder.init(this.issue);
        this.prefetchUnit.init(2 * this.issue);
        this.code = null;

        this.aluMem = new Array(this.functionalUnitNumbers[FunctionalUnitType.MEMORY]).fill(new FunctionalUnit());

        for (let j = 0; j < this.functionalUnitNumbers[FunctionalUnitType.MEMORY]; j++) {
            this.aluMem[j].type = FunctionalUnitType.INTEGERSUM;
            this.aluMem[j].latency = this.functionalUnitLatencies[FunctionalUnitType.INTEGERSUM];
        }
    }

    init(reset: boolean) {
        super.init(reset);
        // Clean Gpr, Fpr, predSalto
        this.ROBFpr.fill(-1);
        this.ROBFpr.fill(-1);
        this.jumpPrediction.fill(0);
        // Calculate ROB size
        let total = 0;

        for (let i = 0; i < FUNCTIONALUNITTYPESQUANTITY; i++) {
            this.reserveStationEntry[i] = new ReserveStationEntry();
            // total += this.getReserveStationEntrySize(i);           
        }
        this.reorderBuffer.init(total);
        this.decoder.init(this.issue);
        this.prefetchUnit.init(2 * this.issue);
        this.code = null;

        this.aluMem = new Array(this.functionalUnitNumbers[FunctionalUnitType.MEMORY]).fill(new FunctionalUnit());

        for (let j = 0; j < this.functionalUnitNumbers[FunctionalUnitType.MEMORY]; j++) {
            this.aluMem[j].type = FunctionalUnitType.INTEGERSUM;
            this.aluMem[j].latency = this.functionalUnitLatencies[FunctionalUnitType.INTEGERSUM];
        }
    }

    ticPrefetch(): number {
        while (!this.prefetchUnit.isFull() && (this.pc < this.code.lines)) {
            let aux: PrefetchEntry = new PrefetchEntry();
            // Importante: Hago una copia de la instrucción original para distinguir
            // las distintas apariciones de una misma inst.
            aux.instruction = Object.assign({}, this.code[this.pc]);
            // TODO Opcode constant??
            if (((aux.instruction.opcode === Opcodes.BEQ || aux.instruction.opcode === Opcodes.BNE) && this.jumpPrediction[this.pc])) {
                this.pc = this.code.getBasicBlockInstruction(aux.instruction.getOperand(2));
            } else {
                this.pc++;
            }
            this.prefetchUnit.add(aux);
        }
        return this.prefetchUnit.getCount();
    }

    ticDecoder(): number {
        for (let i = this.prefetchUnit.first; !this.decoder.isFull() && i != this.prefetchUnit.end(); i++) {
            let aux: PrefetchEntry = this.prefetchUnit.elements[i];
            this.prefetchUnit.remove(i);
            let newDecoderEntry = new DecoderEntry();
            newDecoderEntry.instruction = aux.instruction;
            this.decoder.add(newDecoderEntry);
        }
        return this.decoder.getCount();
    }

    checkRegister(register: number, fp: boolean, v: number, q: number) {
        q = -1;
        v = 0;

        if (fp) {
            // El registro tiene su valor listo
            if (!this.fpr.busy[register]) {
                v = this.fpr.content[register];
            } else if (ROB[ROBFpr[reg]] ->listo) {

            } else {

            }
        // El registro no está listo pero el valor ya está en el ROB
        else if 
            v = ROB[ROBFpr[reg]] ->valor;
            // El valor aún está calculándose
            else
                q = ROBFpr[reg];
        }
        else {
            if (!gpr.getBusy(reg))
                v = gpr.getReg(reg);
            else if (ROB[ROBGpr[reg]] ->listo)
                v = ROB[ROBGpr[reg]] ->valor;
            else
                q = ROBGpr[reg];
        }
    }
}
// /******************************************************************************
//  * emitirInstruccion: Resuelve la etapa de emisión para una instrucción
//  * Parámetros:
//  *  - inst: Instrucción a emitir
//  *  - tipo: Tipo de UF/ER
//  *  - indER: Posición de la ER
//  *  - indROB: Posición del ROB
//  ******************************************************************************/
// void TMaquinaSuper::emitirInstruccion(TInstruccion * inst, int tipo, int indROB) {
//     ER[tipo].back().instruccion = inst;
//     ER[tipo].back().ROB = indROB;
//     ER[tipo].back().numUF = -1;
//     ER[tipo].back().A = -1;
//     switch (inst ->getOpcode()) {
//         case TCodigo::ADD:
//         case TCodigo::MULT:
//             chkRegistro(inst ->getOp(1), false, ER[tipo].back().Vj, ER[tipo].back().Qj);
//             chkRegistro(inst ->getOp(2), false, ER[tipo].back().Vk, ER[tipo].back().Qk);
//             ROBGpr[inst ->getOp(0)] = indROB;
//             gpr.setBusy(inst ->getOp(0), true);
//             ROB[indROB] ->destino = inst ->getOp(0);
//             break;
//         case TCodigo::ADDI:
//             chkRegistro(inst ->getOp(1), false, ER[tipo].back().Vj, ER[tipo].back().Qj);
//             ER[tipo].back().Qk = -1;
//             ER[tipo].back().Vk = inst ->getOp(2);
//             ROBGpr[inst ->getOp(0)] = indROB;
//             gpr.setBusy(inst ->getOp(0), true);
//             ROB[indROB] ->destino = inst ->getOp(0);
//             break;
//         case TCodigo::ADDF:
//         case TCodigo::MULTF:
//             chkRegistro(inst ->getOp(1), true, ER[tipo].back().Vj, ER[tipo].back().Qj);
//             chkRegistro(inst ->getOp(2), true, ER[tipo].back().Vk, ER[tipo].back().Qk);
//             ROBFpr[inst ->getOp(0)] = indROB;
//             fpr.setBusy(inst ->getOp(0), true);
//             ROB[indROB] ->destino = inst ->getOp(0);
//             break;
//         case TCodigo::SW:
//             chkRegistro(inst ->getOp(0), false, ER[tipo].back().Vj, ER[tipo].back().Qj);
//             chkRegistro(inst ->getOp(2), false, ER[tipo].back().Vk, ER[tipo].back().Qk);
//             ER[tipo].back().A = inst ->getOp(1);
//             ROB[indROB] ->direccion = -1;
//             break;
//         case TCodigo::SF:
//             chkRegistro(inst ->getOp(0), true, ER[tipo].back().Vj, ER[tipo].back().Qj);
//             chkRegistro(inst ->getOp(2), false, ER[tipo].back().Vk, ER[tipo].back().Qk);
//             ER[tipo].back().A = inst ->getOp(1);
//             ROB[indROB] ->direccion = -1;
//             break;
//         case TCodigo::LW:
//             chkRegistro(inst ->getOp(2), false, ER[tipo].back().Vk, ER[tipo].back().Qk);
//             ER[tipo].back().Qj = -1;
//             ER[tipo].back().Vj = 0;
//             ER[tipo].back().A = inst ->getOp(1);
//             ROBGpr[inst ->getOp(0)] = indROB;
//             gpr.setBusy(inst ->getOp(0), true);
//             ROB[indROB] ->destino = inst ->getOp(0);
//             ROB[indROB] ->direccion = -1;
//             break;
//         case TCodigo::LF:
//             chkRegistro(inst ->getOp(2), false, ER[tipo].back().Vk, ER[tipo].back().Qk);
//             ER[tipo].back().Qj = -1;
//             ER[tipo].back().Vj = 0;
//             ER[tipo].back().A = inst ->getOp(1);
//             ROBFpr[inst ->getOp(0)] = indROB;
//             fpr.setBusy(inst ->getOp(0), true);
//             ROB[indROB] ->destino = inst ->getOp(0);
//             ROB[indROB] ->direccion = -1;
//             break;
//         case TCodigo::BEQ:
//         case TCodigo::BNE:
//             chkRegistro(inst ->getOp(0), false, ER[tipo].back().Vj, ER[tipo].back().Qj);
//             chkRegistro(inst ->getOp(1), false, ER[tipo].back().Vk, ER[tipo].back().Qk);
//             ER[tipo].back().A = inst ->getOp(2);
//             break;
//         default:
//             break;
//     }
// }
// /******************************************************************************
//  * ticIssue: Simula la etapa de "Issue" (emisión), con la que las instrucciones
//  * pasan del decodificador a las estaciones de reserva y el ROB.
//  * Devuelve: El número de instrucciones que pudieron emitirse
//  ******************************************************************************/
// int TMaquinaSuper::ticIssue() {
//     int cont = 0;
//     TDecoder::iterator it = decoder.begin();
//     for (; it != decoder.end(); it++ , cont++) {
//         TInstruccion * inst = it ->instruccion;
//         if (ROB.isFull())
//             break;
//         TTipoUF tipoUF = TCodigo::op2UF(inst ->getOpcode());
//         if (ER[tipoUF].size() == getTamER(tipoUF))
//             break;
//         TEntradaROB * nuevaROB = new TEntradaROB;
//         nuevaROB ->valor = 0.0;
//         nuevaROB ->destino = -1;
//         nuevaROB ->direccion = -1;
//         int posROB = ROB.add(nuevaROB);
//         TEntradaER nuevaER;
//         ER[tipoUF].push_back(nuevaER);
//         emitirInstruccion(inst, tipoUF, posROB);
//         ROB[posROB] ->instruccion = inst;
//         ROB[posROB] ->listo = false;
//         ROB[posROB] ->etapa = SUPER_ISSUE;
//         TEntradaDecoder * auxDec = it.remove();
//         delete auxDec;
//     }
//     return cont;
// }

// /******************************************************************************
//  * chkStore: Comprueba que no haya ningún store anterior en el cauce del ROB que
//  * no tenga calculada su dirección destino o tenga la misma dirección que la
//  * pasada por param.
//  * Parámetros:
//  *  - indROB: Indice en el ROB de la instrucción con la que se compara
//  *  - dir: Dirección con la que se compara
//  ******************************************************************************/
// bool TMaquinaSuper::chkStore(int indROB, int dir) {
//     // Compruebo que no haya algún store anterior...
//     TReorderBuffer::iterator itROB = ROB.begin();
//     for (; itROB != ROB.position(indROB); itROB++) {
//         int opcode = itROB ->instruccion ->getOpcode();
//         if ((opcode == TCodigo::SW) || (opcode == TCodigo::SF)) {
//             //... sin la dir. calculada...
//             if (itROB ->direccion == -1)
//                 break;
//             // ...o con la misma dir.
//             else if (itROB ->direccion == dir)
//                 break;
//         }
//     }
//     return (itROB == ROB.position(indROB));
// }
// /******************************************************************************
//  * ejecutarInstruccion: Comprueba si una instrucción está lista para ser
//  * ejecutada
//  * Parámetros:
//  *  - tipo: Tipo de UF
//  *  - num: Número de UF de ese tipo libre
//  * Comentarios: Lo que se hace es comprobar si los operandos están disponibles.
//  ******************************************************************************/
// void TMaquinaSuper::ejecutarInstruccion(TTipoUF tipo, int num) {
//     TEstacionReserva::iterator it = ER[tipo].begin();

//     switch (tipo) {
//         case SUMAENT:
//         case MULTENT:
//         case SUMAFLOT:
//         case MULTFLOT:
//         case SALTO:
//             // Operandos disponibles
//             while (it != ER[tipo].end() && !((it ->Qj == -1) && (it ->Qk == -1) && (it ->numUF == -1)))
//                 ++it;
//             if (it != ER[tipo].end()) {
//                 it ->numUF = num;
//                 it ->posUF = UF[tipo][num].rellenarCauce(it ->instruccion);
//                 ROB[it ->ROB] ->etapa = SUPER_EXECUTE;
//             }
//             break;
//         case MEM:
//             // Fase 2 (Sólo los LOAD): Poner a ejecutar
//             for (; it != ER[tipo].end(); it++) {
//                 int opcode = it ->instruccion ->getOpcode();
//                 if (((opcode == TCodigo::LW) || (opcode == TCodigo::LF)) // Es un LOAD
//                     && ((it ->numUF == -1)   // No se está ejecutando
//                     && (ROB[it ->ROB] ->direccion != -1))    // Dir. ya calculada
//                     && chkStore(it ->ROB, ROB[it ->ROB] ->direccion))  // Comprobación de orden
//                 break;
//             }
//             if (it != ER[tipo].end()) {
//                 it ->numUF = num;
//                 it ->posUF = UF[tipo][num].rellenarCauce(it ->instruccion);
//             }
//             break;
//         default:
//             break;
//     }
// }
// /******************************************************************************
//  * ticExecute: Solamente marca aquellas instrucciones que están listas para ser
//  * ejecutadas
//  * Comentarios: En esta parte del código realmente NO se ejecuta nada
//  ******************************************************************************/
// int TMaquinaSuper::ticExecute() {

//     for (int i = 0; i < NTIPOSUF; i++)
//     for (int j = 0; j < nUF[i]; j++)
//     if (UF[i][j].estaLibre())
//         ejecutarInstruccion(i, j);

//     // Después de pasar por todas las UF me encargo de las UF de cálculo de dir.
//     // Fase 1b: Cálculo de la dirección
//     // Primero termino la ejecución del cálculo de dir. en la ALU
//     for (int i = 0; i < nUF[MEM]; i++) {
//         if (aluMem[i].getTopInstruccion() != NULL) {
//             // Busco la entrada de la ER que coincide con esa instrucción
//             TEstacionReserva::iterator it = ER[MEM].begin();
//             while ((it ->numUF != nUF[MEM] + i) || (it ->posUF != aluMem[i].getUltima()))
//                 it++;
//             ROB[it ->ROB] ->direccion = it ->Vk + it ->A;
//             it ->A = ROB[it ->ROB] ->direccion;
//             it ->numUF = -1; // Vuelve a no tener una UF asociada
//         }
//         aluMem[i].tic();
//     }
//     // Fase 1a: Cálculo de la dirección
//     // Relleno la ALU de cálculo de direcciones asociada a esta UF
//     for (int i = 0; i < nUF[MEM]; i++) {
//         TEstacionReserva::iterator it = ER[MEM].begin();
//         for (; it != ER[MEM].end(); it++)
//             if ((it ->Qk == -1) // Valor del operando disponible
//                 && (ROB[it ->ROB] ->direccion == -1)  // Dirección todavía no calculada...
//                 && (it ->numUF == -1))    // ...y no está calculándose ahora mismo
//                 break;
//         if (it != ER[MEM].end()) {
//             it ->numUF = i + nUF[MEM];  // Así las distingo de las UF de Memoria
//             it ->posUF = aluMem[i].rellenarCauce(it ->instruccion);
//             ROB[it ->ROB] ->etapa = SUPER_EXECUTE;
//         }
//     }
// }

// /******************************************************************************
//  * escribirInstruccion: Resuelve la etapa de escritura de resultados de una
//  * instrucción.
//  * Parámetros:
//  *  - tipo: Tipo de UF
//  *  - num: Número de UF de ese tipo
//  * Comentarios: Lo único que se hace es recoger el resultado de la instrucción
//  * (si hay una instrucción lista en esa UF) y difundirlo entre todas las ER que
//  * lo requieran como resultado.
//  ******************************************************************************/
// void TMaquinaSuper::escribirInstruccion(TTipoUF tipo, int num) {
//     float resul;
//     TInstruccion * inst = UF[tipo][num].getTopInstruccion();
//     if (inst != NULL) {
//         TEstacionReserva::iterator it = ER[tipo].begin();
//         while ((it ->numUF != num) || (it ->posUF != UF[tipo][num].getUltima()))
//             it++;   // NOTA: si esto no para es q la he cagao en algún paso anterior
//         int opcode = inst ->getOpcode();
//         switch (opcode) {
//             case TCodigo::ADD:
//             case TCodigo::ADDI:
//             case TCodigo::ADDF:
//                 resul = it ->Vj + it ->Vk;
//                 break;
//             case TCodigo::MULT:
//             case TCodigo::MULTF:
//                 resul = it ->Vj * it ->Vk;
//                 break;
//             // En esta fase no se hace nada con los STORES
//             case TCodigo::LW:
//             case TCodigo::LF:
//                 if (!memoria.getDato(it ->A, resul))
//                     UF[tipo][num].setStall(latFalloMem - UF[tipo][num].getLatencia());
//                 break;
//             case TCodigo::BEQ:
//                 resul = (it ->Vj == it ->Vk) ? 1 : 0;
//                 break;
//             case TCodigo::BNE:
//                 resul = (it ->Vj != it ->Vk) ? 1 : 0;
//                 break;
//         }

//         // Finalizó la ejecución de la instrucción
//         if (UF[tipo][num].getStall() == 0) {
//             if ((opcode != TCodigo::BNE) && (opcode != TCodigo::BEQ)) {
//                 // Actualizo todas las ER
//                 for (int i = 0; i < NTIPOSUF; i++) {
//                     TEstacionReserva::iterator itER = ER[i].begin();
//                     for (; itER != ER[i].end(); itER++) {
//                         if (itER ->Qj == it ->ROB) {
//                             itER ->Vj = resul;
//                             itER ->Qj = -1;
//                         }
//                         if (itER ->Qk == it ->ROB) {
//                             itER ->Vk = resul;
//                             itER ->Qk = -1;
//                         }
//                     }
//                 }
//             }
//             ROB[it ->ROB] ->valor = resul;
//             ROB[it ->ROB] ->etapa = SUPER_WRITERESULT;
//             ROB[it ->ROB] ->listo = true;
//             // Elimino la entrada de la ER
//             ER[tipo].erase(it);
//         }
//     }
// }

// /******************************************************************************
//  * ticWriteResult: Coge las instrucciones marcadas como ejecutadas y actualiza
//  * su resultado
//  * Comentarios: En esta parte del código es donde se efectúa realmente la
//  * ejecución
//  ******************************************************************************/
// int TMaquinaSuper::ticWriteResult() {
//     // En primer lugar compruebo si hay STORES listos
//     TEstacionReserva::iterator it = ER[MEM].begin();
//     while (it != ER[MEM].end()) {
//         int opcode = ROB[it ->ROB] ->instruccion ->getOpcode();
//         if (((opcode == TCodigo::SW) || (opcode == TCodigo::SF)) && (it ->Qj == -1) && (ROB[it ->ROB] ->direccion != -1)) {
//             ROB[it ->ROB] ->valor = it ->Vj;
//             // NOTA: Lo pongo o no?
//             ROB[it ->ROB] ->etapa = SUPER_WRITERESULT;
//             ROB[it ->ROB] ->listo = true;
//             // Elimino la entrada de la ER
//             if (it == ER[MEM].begin()) {
//                 ER[MEM].erase(it);
//                 it = ER[MEM].begin();
//             }
//             else {
//                 TEstacionReserva::iterator itAux = it;
//                 it--;
//                 ER[MEM].erase(itAux);
//                 it++;
//             }
//         }
//         else
//         it++;
//     }

//     // Después recorro todas las UF para recoger los resultados
//     for (int i = 0; i < NTIPOSUF; i++)
//     for (int j = 0; j < nUF[i]; j++) {
//         if (UF[i][j].getStall() == 0)
//             escribirInstruccion(i, j);
//         // Avanzo el reloj de esa UF
//         UF[i][j].tic();
//     }
// }

// /******************************************************************************
//  * chkSalto: Comprueba si la especulación en la ejecución realizada a partir de
//  * una instrucción de salto fue correcta o no en el momento de graduarla.
//  * Parámetros:
//  *  - rob: Entrada del ROB que contiene la instrucción de salto
//  * Comentarios: En caso de ser una predicción correcta se deja todo como está.
//  * En caso contrario, hay que vaciar todo el flujo de ejecución.
//  * En cualquiera de los casos hay que actualizar el valor de la tabla de
//  * predicción de saltos.
//  ******************************************************************************/
// checkSalto(ReorderBufferEntry rob): boolean {
//     // Se comprueba si la predicción acertó
//     if (prediccion(rob ->instruccion ->getId()) ^ (bool) rob->valor) {
//         cambiarPrediccion(rob ->instruccion ->getId(), (bool) rob->valor);
//         // Se cambia el PC
//         if ((bool) rob->valor)
//         PC = codigo ->getInstruccionBB(rob ->instruccion ->getOp(2));
//         else
//         PC = rob ->instruccion ->getId() + 1;
//         // Se limpia el ROB
//         TReorderBuffer::iterator itROB = ROB.begin();
//         for (; itROB != ROB.end(); itROB++) {
//             TEntradaROB * aux = itROB.remove();
//             delete aux ->instruccion;
//             delete aux;
//         }
//         //        ROB.clear();
//         // Y libero la memoria de la entrada del ROB q contenía el salto
//         delete rob ->instruccion;
//         delete rob;
//         // Se limpian las UF y ER
//         for (int i = 0; i < NTIPOSUF; i++)
//         for (int j = 0; j < nUF[i]; j++) {
//             UF[i][j].limpiar();
//             ER[i].clear();
//         }
//         // y las UF de cálculo de direcciones
//         for (int i = 0; i < nUF[MEM]; i++)
//         aluMem[i].limpiar();
//         // Se limpia el decoder
//         TDecoder::iterator itDec = decoder.begin();
//         for (; itDec != decoder.end(); itDec++) {
//             TEntradaDecoder * aux = itDec.remove();
//             delete aux ->instruccion;
//             delete aux;
//         }
//         //        decoder.clear();
//         // Se limpia la unidad de Prefetch
//         TPrefetchUnit::iterator itPre = prefetchUnit.begin();
//         for (; itPre != prefetchUnit.end(); itPre++) {
//             TEntradaPrefetch * aux = itPre.remove();
//             delete aux ->instruccion;
//             delete aux;
//         }
//         //        prefetchUnit.clear();
//         // Limpio también las estructuras asociadas a los registros
//         memset(ROBGpr, -1, sizeof(int) * NGP);
//         memset(ROBFpr, -1, sizeof(int) * NFP);
//         gpr.setBusy(false);
//         fpr.setBusy(false);
//         return false;
//     }
//     cambiarPrediccion(rob ->instruccion ->getId(), (bool) rob->valor);
//     return true;
// }
// /******************************************************************************
//  * ticCommit: Simula la etapa de "Commit" (graduación)
//  * Devuelve:
//  *  - SUPER_COMMITOK: Se pudieron graduar las "emision" instrucciones
//  *  - SUPER_COMMITNO: Faltaron algunas instruciones por graduar porque aún no
//  *    estaban listas
//  *  - SUPER_COMMITEND: Se vació el ROB
//  *  - SUPER_COMMITMISS: Se vacío el ROB a causa de un fallo de predicción de
//  *    salto
//  * Comentarios: La graduación se realiza de manera secuencial, para asegurar el
//  * orden del programa.
//  ******************************************************************************/
// TCommitStatus TMaquinaSuper::ticCommit() {
//     for (int i = 0; i < emision; i++) {
//         if (ROB.isEmpty())
//             return SUPER_COMMITEND;
//         else if (!ROB.top() ->listo)
//             return SUPER_COMMITNO;
//         else {
//             int h = ROB.getFirst();
//             TEntradaROB * aux = ROB.remove();
//             switch (aux ->instruccion ->getOpcode()) {
//                 case TCodigo::SW:
//                 case TCodigo::SF:
//                     memoria.setDato(aux ->direccion, aux ->valor);
//                     break;
//                 case TCodigo::BEQ:
//                 case TCodigo::BNE:
//                     if (!chkSalto(aux))
//                         return SUPER_COMMITMISS;
//                     break;
//                 case TCodigo::ADD:
//                 case TCodigo::ADDI:
//                 case TCodigo::MULT:
//                 case TCodigo::LW:
//                     gpr.setReg(aux ->destino, aux ->valor, false);
//                     // Pase lo que pase R0 vale 0
//                     gpr.setReg(0, 0, false);
//                     if (ROBGpr[aux ->destino] == h)
//                         gpr.setBusy(aux ->destino, false);
//                     break;
//                 case TCodigo::ADDF:
//                 case TCodigo::MULTF:
//                 case TCodigo::LF:
//                     fpr.setReg(aux ->destino, aux ->valor, false);
//                     if (ROBFpr[aux ->destino] == h)
//                         fpr.setBusy(aux ->destino, false);
//                     break;
//                 default:
//                     break;
//             }
//             // Importante: Elimino la instrucción copia de la original
//             delete aux ->instruccion;
//             delete aux;
//         }
//     }
//     return SUPER_COMMITOK;
// }
// /******************************************************************************
//  * tic: Avanza un ciclo el reloj de la máquina y realiza la simulación
//  * Devuelve:
//  *  - SUPER_ENDEXE: Finalizó la ejecución del programa.
//  *  - SUPER_BREAKPOINT: La ejecución se encontró con un breakpoint
//  *  - SUPER_OK: Este ciclo de reloj finalizo sin problemas
//  ******************************************************************************/
// TSuperscalarStatus TMaquinaSuper::tic() {
//     status.ciclo++;
//     // ETAPA DE COMMIT
//     TCommitStatus comm = ticCommit();
//     if ((comm != SUPER_COMMITEND) && (comm != SUPER_COMMITMISS)) {
//         // ETAPA DE WRITE RESULT
//         ticWriteResult();
//         // ETAPA DE EXECUTE
//         ticExecute();
//     }
//     // ETAPA DE ISSUE
//     int resulIssue = ticIssue();
//     // ETAPA DE DECODER
//     int resulDecoder = ticDecoder();
//     // ETAPA DE PREFETCH
//     int resulPrefetch = ticPrefetch();
//     if ((resulIssue + resulDecoder + resulPrefetch == 0) && (comm == SUPER_COMMITEND))
//         return SUPER_ENDEXE;
//     TPrefetchUnit::iterator it = prefetchUnit.begin();
//     for (; it != prefetchUnit.end(); it++)
//         if (it ->instruccion ->getBreakPoint()) {
//             status.breakPoint = true;
//             return SUPER_BREAKPOINT;
//         }
//     return SUPER_OK;
// }
}