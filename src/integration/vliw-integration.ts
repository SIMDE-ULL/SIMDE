import { ExecutionStatus } from '../main-consts';
import { store } from '../store';
import {
    nextFunctionalUnitCycle,
    nextVLIWHeaderTableCycle,
    nextVLIWExecutionTableCycle,
    nextRegistersCycle,
    nextMemoryCycle,
    nextCycle,
    superescalarLoad,
    batchActions
} from '../interface/actions';

import { pushHistory, takeHistory, resetHistory } from '../interface/actions/history';
import { MAX_HISTORY_SIZE } from '../interface/reducers/machine';

import { t } from 'i18next';

import { MachineIntegration } from './machine-integration';
import { VLIW, VLIWCode, VLIWError } from '../core/VLIW';
import { VLIWOperation } from '../core/VLIW/VLIWOperation';
import { nextNatFprCycle, nextNatGprCycle, nextPredicateCycle } from '../interface/actions/predicate-nat-actions';
import { displayBatchResults } from '../interface/actions/modals';

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
    cacheFailPercentage = 0;
    cacheFailLatency = 0;

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
                nextVLIWHeaderTableCycle(this.vliw._functionalUnitNumbers),
                nextVLIWExecutionTableCycle(this.vliw.code.instructions, this.vliw._functionalUnitNumbers),
                nextRegistersCycle([this.vliw.gpr.content, this.vliw.fpr.content]),
                nextMemoryCycle(this.vliw.memory.data),
                nextCycle(this.vliw.status.cycle),
                nextNatFprCycle(this.vliw.getNaTFP()),
                nextNatGprCycle(this.vliw.getNaTGP()),
                nextPredicateCycle(this.vliw.getPredReg()),
                pushHistory()
            )
        );
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
            this.dispatchAllVLIWActions();

            return machineStatus;
        }
    }

    loadCode = (vliwCode: VLIWCode) => {
        this.vliw.code = vliwCode;
        this.resetMachine();
        // There is no need to update the code with the rest,
        // it should remain the same during all the program execution
        store.dispatch(nextVLIWHeaderTableCycle(this.vliw._functionalUnitNumbers));
        store.dispatch(nextVLIWExecutionTableCycle(this.vliw.code.instructions,
                                                   this.vliw._functionalUnitNumbers));
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
                                                   this.vliw._functionalUnitNumbers));
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
            while (this.vliw.tic() !== VLIWError.ENDEXE) { }
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
            this.vliw.memory.failProbability = this.cacheFailPercentage;
            this.vliw.memoryFailLatency = this.cacheFailLatency;

            // Load memory content
            if (this.contentIntegration) {
                this.setFpr(this.contentIntegration.FPRContent);
                this.setGpr(this.contentIntegration.GPRContent);
                this.setMemory(this.contentIntegration.MEMContent);
            }

            // tslint:disable-next-line:no-empty
            while (this.vliw.tic() !== VLIWError.ENDEXE) { }
            results.push(this.vliw.status.cycle);
        }

        const statistics = this.calculateBatchStatistics(results);
        this.clearBatchStateEffects();
        store.dispatch(displayBatchResults(statistics));
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
        Object.keys(data).forEach(key => {
            this.vliw.memory.setDatum(+key, data[key]);
        });
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
                if (!(machineStatus === VLIWError.BREAKPOINT || machineStatus === VLIWError.ENDEXE)) {
                    this.executionLoop(speed);
                } else {
                    if (machineStatus === VLIWError.BREAKPOINT) {
                        alert(t('execution.stopped'));
                    } else if (machineStatus === VLIWError.ENDEXE) {
                        this.finishedExecution = true;
                        alert(t('execution.finished'));
                    }
                }
            }, speed);
        } else if (this.stopCondition === ExecutionStatus.STOP) {
            this.resetMachine();
        }
    }

    saveVliwConfig = (vliwConfig) => {
        const vliwConfigKeys = Object.keys(vliwConfig);

        for (let i = 0; i < vliwConfigKeys.length; i++) {
            if (i % 2 === 0) {
                this.vliw.setFunctionalUnitNumber(i / 2,
                    +vliwConfig[vliwConfigKeys[i]]);
            } else {
                this.vliw.setFunctionalUnitLatency(i / 2,
                    +vliwConfig[vliwConfigKeys[i]]);
            }
        }
    }

    setBatchMode = (replications: number, cacheFailLatency, cacheFailPercentage) => {
        this.replications = replications;
        this.cacheFailLatency = cacheFailLatency;
        this.cacheFailPercentage = cacheFailPercentage;
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

    private calculateBatchStatistics(results: number[]) {
        const average = (results.reduce((a,b) => a + b) / results.length);
        return {
            replications:  this.replications,
            average: average.toFixed(2),
            standardDeviation: this.calculateStandardDeviation(average, results).toFixed(2),
            worst: Math.max(...results),
            best: Math.min(...results)
        };
    }

    private clearBatchStateEffects() {
        // Post launch machine clean
        this.vliw.memory.failProbability = 0;
        this.vliw.memoryFailLatency = 0;
        this.resetMachine();
    }
}

export default new VLIWIntegration();
