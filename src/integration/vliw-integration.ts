import { ExecutionStatus } from '../main-consts';
import { store } from '../store';
import {
    nextPrefetchCycle,
    nextDecoderCycle,
    nextJumpTableCycle,
    nextFunctionalUnitCycle,
    nextRegistersCycle,
    nextMemoryCycle,
    nextCycle,
    superescalarLoad,
    batchActions,
    colorCell
} from '../interface/actions';

import { pushHistory, takeHistory, resetHistory } from '../interface/actions/history';
import { MAX_HISTORY_SIZE } from '../interface/reducers';

import { t } from 'i18next';
import { Code } from '../core/Common/Code';
import { displayBatchResults } from '../interface/actions/modals';

import { MachineIntegration } from './machine-integration';
import { VLIW, VLIWCode, VLIWError} from '../core/VLIW';
import { nextNatFprCycle, nextNatGprCycle, nextPredicateCycle } from '../interface/actions/predicate-nat-actions';

export class VLIWIntegration extends MachineIntegration {

    static makeBatchExecution(): any {
        throw new Error("Method not implemented.");
    }
    static setBatchMode(arg0: any, arg1: any, arg2: any): any {
        throw new Error("Method not implemented.");
    }

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
                nextRegistersCycle([this.vliw.gpr.content, this.vliw.fpr.content]),
                nextMemoryCycle(this.vliw.memory.data),
                nextCycle(this.vliw.status.cycle),
                nextNatFprCycle({content: this.vliw.getNaTFP() }),
                nextNatGprCycle({content: this.vliw.getNaTGP() }),
                nextPredicateCycle({content: this.vliw.getPredReg() })
            )
        );
    }
    
    vliwExe = () => {
        this.vliw.init(true);
    }
    
    setBatchMode: (...config: any[]) => void;

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
                this.resetMachine();
            }
            if (this.vliw.status.cycle === 0) {
                let code = Object.assign(new VLIWCode(), this.vliw.code);
                this.vliwExe();
                this.vliw.code = code;
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
        store.dispatch(superescalarLoad(vliwCode.superescalarCode.instructions));
    }

    play = () => {

        // if (!this.superescalar.code) {
        //     return;
        // }

        // this.stopCondition = ExecutionStatus.EXECUTABLE;
        // this.backStep = 0;
        // this.executing = true;
        // let speed = this.calculateSpeed();

        // // Check if the execution has finished
        // if (this.finishedExecution) {
        //     this.finishedExecution = false;
        //     this.resetMachine();
        // }

        // if (this.superescalar.status.cycle === 0) {
        //     let code = Object.assign(new Code(), this.superescalar.code);
        //     this.superExe();
        //     this.vliw.code = code;
        // }

        // if (speed) {
        //     this.executionLoop(speed);
        // } else {
        //     // tslint:disable-next-line:no-empty
        //     while (this.vliw.tic() !== VLIWStatus.SUPER_ENDEXE) { }
        //     this.dispatchAllSuperescalarActions();
        //     this.finishedExecution = true;
        //     alert(t('execution.finished'));
        // }
    }

    makeBatchExecution = () => {
        // if (!this.vliw.code) {
        //     return;
        // }

        // const results = [];
        // for (let i = 0; i < this.replications; i++) {
        //     let code = Object.assign(new Code(), this.superescalar.code);
        //     this.superExe();
        //     this.vliw.code = code;
        //     this.vliw.memory.failProbability = this.cacheFailPercentage;
        //     this.superescalar.memoryFailLatency = this.cacheFailLatency;

        //     // tslint:disable-next-line:no-empty
        //     while (this.superescalar.tic() !== SuperescalarStatus.SUPER_ENDEXE) { }
        //     results.push(this.superescalar.status.cycle);
        // }

        // const statistics = this.calculateBatchStatistics(results);
        // this.clearBatchStateEffects();
        // store.dispatch(displayBatchResults(statistics));
    }

    pause = () => {
        this.stopCondition = ExecutionStatus.PAUSE;
        this.executing = false;
    }

    stop = () => {
        // if (!this.superescalar.code) {
        //     return;
        // }
        // // In normal execution I have to avoid the asynchrnous way of
        // // js entering in the interval, the only way I have is to using a semaphore
        // this.stopCondition = ExecutionStatus.STOP;

        // if (!this.executing) {
        //     this.executing = false;
        //     this.resetMachine();
        // }
    }


    stepBack = () => {
        // // There is no time travelling for batch mode and initial mode
        // if (this.superescalar.status.cycle > 0 && this.backStep < MAX_HISTORY_SIZE &&
        //     (this.superescalar.status.cycle - this.backStep > 0)) {
        //     this.backStep++;
        //     store.dispatch(takeHistory(this.backStep));
        // }
    }

    executionLoop = (speed) => {
        // if (!this.stopCondition) {
        //     setTimeout(() => {
        //         let machineStatus = this.stepForward();
        //         if (!(machineStatus === SuperescalarStatus.SUPER_BREAKPOINT || machineStatus === SuperescalarStatus.SUPER_ENDEXE)) {
        //             this.executionLoop(speed);
        //         } else {
        //             if (machineStatus === SuperescalarStatus.SUPER_BREAKPOINT) {
        //                 alert(t('execution.stopped'));
        //             } else if (machineStatus === SuperescalarStatus.SUPER_ENDEXE) {
        //                 this.finishedExecution = true;
        //                 alert(t('execution.finished'));
        //             }
        //         }
        //     }, speed);
        // } else if (this.stopCondition === ExecutionStatus.STOP) {
        //     this.resetMachine();
        // }
    }


    // setBatchMode = (replications: number, cacheFailLatency, cacheFailPercentage) => {
    //     this.replications = replications;
    //     this.cacheFailLatency = cacheFailLatency;
    //     this.cacheFailPercentage = cacheFailPercentage;
    // }

    private resetMachine() {
        let code = Object.assign(new VLIWCode(), this.vliw.code);
        this.vliwExe();
        this.vliw.code = code;
        this.dispatchAllVLIWActions();
    }
}

export default new VLIWIntegration();
