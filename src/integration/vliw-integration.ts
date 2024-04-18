import { ExecutionStatus } from './utils';
import { store } from '../store';
import {
    nextFunctionalUnitCycle,
    nextVLIWHeaderTableCycle,
    nextVLIWExecutionTableCycle,
    nextRegistersCycle,
    nextMemoryCycle,
    nextCycle,
    currentPC,
    superescalarLoad,
    batchActions,
    nextUnitsUsage,
    setCyclesPerReplication
} from '../interface/actions';

import { pushHistory, takeHistory, resetHistory } from '../interface/actions/history';
import { MAX_HISTORY_SIZE } from '../interface/reducers/machine';

import { t } from 'i18next';

import { MachineIntegration } from './machine-integration';
import { VLIW } from '../core/VLIW/VLIW';
import { VLIWCode } from '../core/VLIW/VLIWCode';
import { VLIWError } from '../core/VLIW/VLIWError';
import { VLIWOperation } from '../core/VLIW/VLIWOperation';
import { CacheType, DirectCache, NoCache, RandomCache } from '../core/Common/Cache';
import { nextNatFprCycle, nextNatGprCycle, nextPredicateCycle } from '../interface/actions/predicate-nat-actions';
import { displayBatchResults } from '../interface/actions/modals';

import { Stats } from '../stats/stats';
import { StatsAgregator } from '../stats/aggregator';
import { FunctionalUnitType } from '@/core/Common/FunctionalUnit';

export class VLIWIntegration extends MachineIntegration {
    // Global objects for binding React to the View
    vliw = new VLIW();
    codeLoaded = false;
    interval = null;
    backStep = 0;
    stopCondition = ExecutionStatus.EXECUTABLE;
    finishedExecution = false;
    executing = false;
    replications = 0;
    stats = new Stats();
    batchStats = new StatsAgregator();

    /*
    * This call all the components to update the state
    * if there is a step param, the components will use
    * their history to set the appropiate content
    */

    dispatchAllVLIWActions = (step?: number) => {
        // Code should only be setted on the first iteration
        store.dispatch(
            batchActions(
                nextFunctionalUnitCycle([...this.vliw.functionalUnit]),
                nextVLIWHeaderTableCycle(this.vliw.functionalUnitNumbers),
                nextVLIWExecutionTableCycle(this.vliw.code.instructions, this.vliw.functionalUnitNumbers),
                nextRegistersCycle([this.vliw.gpr.content, this.vliw.fpr.content]),
                nextMemoryCycle(this.vliw.cache.memory),
                nextCycle(this.vliw.status.cycle),
                currentPC(this.vliw.pc),
                nextNatFprCycle(this.vliw.getNaTFP()),
                nextNatGprCycle(this.vliw.getNaTGP()),
                nextPredicateCycle(this.vliw.getPredReg()),
                nextUnitsUsage(this.stats.getUnitsUsage()),
                pushHistory()
            )
        );
    }

    collectStats = () => {
        for (let i = 0; i < 6; i++) {
            this.stats.collectMultipleUnitUsage(`fu${i}`, this.vliw.functionalUnit[i].map((fu) => fu.usage));
        }

        this.stats.advanceCycle();
    }

    vliwExe = () => {
        this.vliw.init(true);
    }

    stepForward = () => {

        if (!this.vliw.code) {
            return;
        }

        if (this.backStep > 0) {
            this.backStep--;
            store.dispatch(takeHistory(this.backStep));
        } else {
            if (this.finishedExecution) {
                this.finishedExecution = false;
                let code = Object.assign(new VLIWCode(), this.vliw.code);
                this.vliwExe();
                this.vliw.code = code;

                // Load memory content
                if (this.contentIntegration) {
                    this.setFpr(this.contentIntegration.FPRContent);
                    this.setGpr(this.contentIntegration.GPRContent);
                    this.setMemory(this.contentIntegration.MEMContent);
                }
            }
            let machineStatus = this.vliw.tic();
            this.collectStats();
            this.dispatchAllVLIWActions();

            return machineStatus;
        }
    }

    loadCode = (vliwCode: VLIWCode) => {
        this.vliw.code = vliwCode;
        this.resetMachine();
        // There is no need to update the code with the rest,
        // it should remain the same during all the program execution
        store.dispatch(nextVLIWHeaderTableCycle(this.vliw.functionalUnitNumbers));
        store.dispatch(nextVLIWExecutionTableCycle(this.vliw.code.instructions,
            this.vliw.functionalUnitNumbers));
        store.dispatch(superescalarLoad(vliwCode.superescalarCode.instructions));
    }

    setOperation = (codeInstructionIdx, position: [number, number]) => {
        // Block VLIW operation setting if machine is executing
        if (this.vliw.status.cycle > 0) {
            throw new Error('Cannot set operations in the middle of an execution');
        }

        let { loc } = codeInstructionIdx;
        let [instructionIdx, operationIdx] = position;
        let functionalUnitType = this.vliw.code.superescalarCode.getFunctionalUnitType(loc);
        let functionalUnitIdx = 0;

        for (let i = 0; i < this.vliw.functionalUnitNumbers.length; i++) {
            if (functionalUnitIdx >= operationIdx) {
                // Reset functional unit number index to previous in order to check
                // if the functional unit type corresponds to the VLIW operand
                if (functionalUnitIdx != operationIdx) {
                    i -= 1;
                }

                // In case it does not correspond, throw exception and abort
                if (i !== functionalUnitType) {
                    throw new Error('VLIW operand does not match with Functional Unit');
                }

                functionalUnitIdx -= operationIdx;
                break;
            }
            functionalUnitIdx += this.vliw.functionalUnitNumbers[i];
        }

        let operation = new VLIWOperation(null,
            this.vliw.code.superescalarCode.instructions[loc],
            functionalUnitType, functionalUnitIdx
        );

        // Pop out any former operations in the same slot
        let popIdx = this.vliw.code.instructions[instructionIdx].operations
            .findIndex(op => op.getFunctionalUnitType() === functionalUnitType &&
                op.getFunctionalUnitIndex() === functionalUnitIdx);
        if (popIdx >= 0) {
            this.vliw.code.instructions[instructionIdx].operations.splice(popIdx, 1);
        }

        this.vliw.code.instructions[instructionIdx].addOperation(operation);
        store.dispatch(nextVLIWExecutionTableCycle(this.vliw.code.instructions,
            this.vliw.functionalUnitNumbers));
    }

    play = () => {

        if (!this.vliw.code) {
            return;
        }

        this.stopCondition = ExecutionStatus.EXECUTABLE;
        this.backStep = 0;
        this.executing = true;
        let speed = this.calculateSpeed();

        if (this.finishedExecution) {
            this.finishedExecution = false;
            let code = Object.assign(new VLIWCode(), this.vliw.code); // asignar tambien el codigo superescalar?
            this.vliwExe();
            this.vliw.code = code;

            // Load memory content
            if (this.contentIntegration) {
                this.setFpr(this.contentIntegration.FPRContent);
                this.setGpr(this.contentIntegration.GPRContent);
                this.setMemory(this.contentIntegration.MEMContent);
            }
        }

        if (speed) {
            this.executionLoop(speed);
        } else {
            // tslint:disable-next-line:no-empty
            //TODO: Should we show VLIWErrors and stop execution?
            let err = VLIWError.OK;
            while (err !== VLIWError.ENDEXE) {
                err = this.vliw.tic();
                this.collectStats();
                if (err !== VLIWError.OK && err !== VLIWError.ENDEXE && err !== VLIWError.PCOUTOFRANGE) {
                    alert(t('execution.error') + ": " + VLIWError[err]);
                    err = VLIWError.ENDEXE;
                }
            }
            this.collectStats();
            this.dispatchAllVLIWActions();
            this.finishedExecution = true;
            alert(t('execution.finished'));
        }
    }

    makeBatchExecution = () => {
        if (!this.vliw.code) {
            return;
        }

        const results = [];
        for (let i = 0; i < this.replications; i++) {
            let code = Object.assign(new VLIWCode(), this.vliw.code);
            this.vliwExe();
            this.vliw.code = code;

            // Load memory content
            if (this.contentIntegration) {
                this.setFpr(this.contentIntegration.FPRContent);
                this.setGpr(this.contentIntegration.GPRContent);
                this.setMemory(this.contentIntegration.MEMContent);
            }

            // tslint:disable-next-line:no-empty
            //TODO: Should we show VLIWErrors and stop execution?
            let err = VLIWError.OK;
            while (err !== VLIWError.ENDEXE) {
                err = this.vliw.tic();
                this.collectStats();
                if (err !== VLIWError.OK && err !== VLIWError.ENDEXE && err !== VLIWError.PCOUTOFRANGE) {
                    alert(t('execution.error') + ": " + VLIWError[err]);
                    err = VLIWError.ENDEXE;
                }
            }
            this.batchStats.agragate(this.stats);
            results.push(this.vliw.status.cycle);
            this.stats = new Stats();
        }

        this.clearBatchStateEffects();
        store.dispatch(
            batchActions(
                setCyclesPerReplication(results),
                nextUnitsUsage(this.batchStats.getAvgUnitsUsage()),
                displayBatchResults(this.batchStats.export())
                ));
    }

    pause = () => {
        this.stopCondition = ExecutionStatus.PAUSE;
        this.executing = false;
    }

    stop = () => {
        if (!this.vliw.code) {
            return;
        }
        // In normal execution I have to avoid the asynchrnous way of
        // js entering in the interval, the only way I have is to using a semaphore
        this.stopCondition = ExecutionStatus.STOP;

        if (!this.executing) {
            this.executing = false;
            this.resetMachine();
        }
    }

    stepBack = () => {
        // There is no time travelling for batch mode and initial mode
        if (this.vliw.status.cycle > 0 && this.backStep < MAX_HISTORY_SIZE &&
            (this.vliw.status.cycle - this.backStep > 0)) {
            this.backStep++;
            store.dispatch(takeHistory(this.backStep));
        }
    }

    setMemory = (data: { [k: number]: number }) => {
        if (this.vliw.status.cycle > 0) {
            return;
        }
        for (const key in data) {
            this.vliw.cache.memory.setData(+key, data[key]);
        }
    }

    setFpr = (data: { [k: number]: number }) => {
        if (this.vliw.status.cycle > 0) {
            return;
        }
        Object.keys(data).forEach(key => {
            this.vliw.fpr.setContent(+key, data[key], false);
        });
    }

    setGpr = (data: { [k: number]: number }) => {
        if (this.vliw.status.cycle > 0) {
            return;
        }
        Object.keys(data).forEach(key => {
            this.vliw.gpr.setContent(+key, data[key], false);
        });
    }

    executionLoop = (speed) => {
        if (!this.stopCondition) {
            setTimeout(() => {
                let machineStatus = this.stepForward();
                let stop: boolean = true;
                switch (machineStatus) {
                    case VLIWError.OK:
                    case VLIWError.PCOUTOFRANGE: //TODO: is this really an error? We always go out of range when we finish the execution or there is a branch at the end
                        stop = false;
                        break;
                    case VLIWError.BREAKPOINT:
                        alert(t('execution.stopped'));
                        break;
                    case VLIWError.ENDEXE:
                        this.finishedExecution = true;
                        alert(t('execution.finished'));
                        break;
                    default:
                        alert(t('execution.error') + ": " + VLIWError[machineStatus]);
                        break;
                }

                if (!stop) {
                    this.executionLoop(speed);
                }
            }, speed);
        } else if (this.stopCondition === ExecutionStatus.STOP) {
            this.resetMachine();
        }
    }

    saveVliwConfig = (vliwConfig) => {
        this.vliw.changeFunctionalUnitNumber(FunctionalUnitType.INTEGERSUM, +vliwConfig.integerSumQuantity);
        this.vliw.changeFunctionalUnitLatency(FunctionalUnitType.INTEGERSUM, +vliwConfig.integerSumLatency);

        this.vliw.changeFunctionalUnitNumber(FunctionalUnitType.INTEGERMULTIPLY, +vliwConfig.integerMultQuantity);
        this.vliw.changeFunctionalUnitLatency(FunctionalUnitType.INTEGERMULTIPLY, +vliwConfig.integerMultLatency);

        this.vliw.changeFunctionalUnitNumber(FunctionalUnitType.FLOATINGSUM, +vliwConfig.floatingSumQuantity);
        this.vliw.changeFunctionalUnitLatency(FunctionalUnitType.FLOATINGSUM, +vliwConfig.floatingSumLatency);

        this.vliw.changeFunctionalUnitNumber(FunctionalUnitType.FLOATINGSUM, +vliwConfig.floatingSumQuantity);
        this.vliw.changeFunctionalUnitLatency(FunctionalUnitType.FLOATINGSUM, +vliwConfig.floatingSumLatency);

        this.vliw.changeFunctionalUnitNumber(FunctionalUnitType.FLOATINGMULTIPLY, +vliwConfig.floatingMultQuantity);
        this.vliw.changeFunctionalUnitLatency(FunctionalUnitType.FLOATINGMULTIPLY, +vliwConfig.floatingMultLatency);

        this.vliw.changeFunctionalUnitNumber(FunctionalUnitType.JUMP, +vliwConfig.jumpQuantity);
        this.vliw.changeFunctionalUnitLatency(FunctionalUnitType.JUMP, +vliwConfig.jumpLatency);

        this.vliw.changeFunctionalUnitNumber(FunctionalUnitType.MEMORY, +vliwConfig.memoryQuantity);
        this.vliw.changeFunctionalUnitLatency(FunctionalUnitType.MEMORY, +vliwConfig.memoryLatency);

        switch (vliwConfig.cacheType) {
            case CacheType.NO_CACHE:
              this.vliw.cache = new NoCache(
                this.vliw.cache.memory,
              );
              break;
            case CacheType.RANDOM_CACHE:
              this.vliw.cache = new RandomCache(
                this.vliw.cache.memory,
                +vliwConfig.cacheFailPercentage / 100,
              );
              break;
            case CacheType.DIRECT_CACHE:
              this.vliw.cache = new DirectCache(
                this.vliw.cache.memory,
                +vliwConfig.cacheBlocks,
                +vliwConfig.cacheLines,
              );
              break;
          }
          this.vliw.memoryFailLatency = +vliwConfig.cacheFailLatency;
  
          this.resetMachine();
    }

    setBatchMode = (replications: number) => {
        this.replications = replications;
    }

    private resetMachine() {
        let code = Object.assign(new VLIWCode(), this.vliw.code);
        this.vliwExe();
        this.vliw.code = code;

        // Reload memory content
        if (this.contentIntegration) {
            this.setFpr(this.contentIntegration.FPRContent);
            this.setGpr(this.contentIntegration.GPRContent);
            this.setMemory(this.contentIntegration.MEMContent);
        }
        this.dispatchAllVLIWActions();
        store.dispatch(resetHistory());
    }

    private clearBatchStateEffects() {
        // Post launch machine clean
        this.vliw.memoryFailLatency = 0;
        this.resetMachine();
    }
}

export default new VLIWIntegration();
