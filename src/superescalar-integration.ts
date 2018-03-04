import { Superescalar } from './core/Superescalar/Superescalar';
import { ExecutionStatus } from './main-consts';
import { store } from './store';
import { 
    nextPrefetchCycle,
    nextDecoderCycle,
    nextJumpTableCycle,
    nextFunctionalUnitCycle,
    nextReserveStationCycle,
    nextReorderBufferCycle,
    nextRegistersCycle,
    nextMemoryCycle,
    nextReorderBufferMapperCycle,
    nextCycle,
    superescalarLoad,
    batchActions
} from './interface/actions';

import { pushHistory, takeHistory, resetHistory } from './interface/actions/history';
import { MAX_HISTORY_SIZE } from './interface/reducers';

import { t } from 'i18next';
import { Code } from './core/Common/Code';
import { SuperescalarStatus } from './core/Superescalar/SuperescalarEnums';
import { FunctionalUnitType } from './core/Common/FunctionalUnit';

export class SuperescalarIntegration {
    // Global objects for binding React to the View
    superescalar = new Superescalar();
    codeLoaded = false;
    interval = null;
    backStep = 0;
    stopCondition = ExecutionStatus.EXECUTABLE;
    finishedExecution = false;
    executing = false;

    /*
    * This call all the components to update the state
    * if there is a step param, the components will use
    * their history to set the appropiate content
    */
    dispatchAllSuperescalarActions = (step?: number) => {
        // Code should only be setted on the first iteration
        store.dispatch(
                batchActions(
                    nextJumpTableCycle(this.superescalar.jumpPrediction),
                    nextPrefetchCycle(this.superescalar.prefetchUnit),
                    nextDecoderCycle(this.superescalar.decoder),
                    nextFunctionalUnitCycle([...this.superescalar.functionalUnit, this.superescalar.aluMem]),
                    nextReserveStationCycle(
                            [{
                                data: this.superescalar.reserveStationEntry[0],
                                size: this.superescalar.getReserveStationSize(0)
                            },

                            {
                                data: this.superescalar.reserveStationEntry[1],
                                size: this.superescalar.getReserveStationSize(1)
                            },

                            {
                                data: this.superescalar.reserveStationEntry[2],
                                size: this.superescalar.getReserveStationSize(2)
                            },

                            {
                                data: this.superescalar.reserveStationEntry[3],
                                size: this.superescalar.getReserveStationSize(3)
                            },

                            {
                                data: this.superescalar.reserveStationEntry[4],
                                size: this.superescalar.getReserveStationSize(4)
                            },

                            {
                                data: this.superescalar.reserveStationEntry[5],
                                size: this.superescalar.getReserveStationSize(5)
                            }
                    ]),
                    nextReorderBufferMapperCycle([this.superescalar.ROBGpr, this.superescalar.ROBFpr]),
                    nextReorderBufferCycle(this.superescalar.reorderBuffer.elements),
                    nextRegistersCycle([this.superescalar.gpr.content, this.superescalar.fpr.content]),
                    nextMemoryCycle(this.superescalar.memory.data),
                    nextCycle(this.superescalar.status.cycle),
                    pushHistory()
                )
        );
    }

    superExe = () => {
        this.superescalar.init(true);
    }

    superStep = () => {

        if (!this.superescalar.code) {
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
            if (this.superescalar.status.cycle === 0) {
                  let code = Object.assign(new Code(), this.superescalar.code);
                  this.superExe();
                  this.superescalar.code = code;
            }
            let machineStatus = this.superescalar.tic();
            this.dispatchAllSuperescalarActions();

            return machineStatus;
        }
    }

    loadSuper = (code: Code) => {
      this.superescalar.code = code;
      this.resetMachine();
      // There is no need to update the code with the rest,
      // it should remain the same during all the program execution
      store.dispatch(superescalarLoad(code.instructions));
    }

    play = () => {

        if (!this.superescalar.code) {
            return;
        }

        this.stopCondition = ExecutionStatus.EXECUTABLE;
        this.backStep = 0;
        this.executing = true;
        let speed = this.calculateSpeed();

        // Check if the execution has finished 
        if (this.finishedExecution) {
            this.finishedExecution = false;
            this.resetMachine();
        }

        if (this.superescalar.status.cycle === 0) {
            let code = Object.assign(new Code(), this.superescalar.code);
            this.superExe();
            this.superescalar.code = code;
        }

        if (speed) {
            this.executionLoop(speed);
        } else {
            // tslint:disable-next-line:no-empty
            while (this.superescalar.tic() !== SuperescalarStatus.SUPER_ENDEXE) { }
            this.dispatchAllSuperescalarActions();
            this.finishedExecution = true;
            alert(t('execution.finished'));
        }
    }

    pause = () => {
        this.stopCondition = ExecutionStatus.PAUSE;
        this.executing = false;
    }

    stop = () => {
        if (!this.superescalar.code) {
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
        if (this.superescalar.status.cycle > 0 && this.backStep < MAX_HISTORY_SIZE &&
            (this.superescalar.status.cycle - this.backStep > 0)) {
            this.backStep++;
            store.dispatch(takeHistory(this.backStep));
        }
    }

    calculateSpeed() {
        let speed = parseInt((<HTMLInputElement>document.getElementById('velocidad')).value);

        let calculatedSpeed = 2000;
        calculatedSpeed = speed ?  calculatedSpeed / speed : 0;

        return calculatedSpeed;
    }

    executionLoop = (speed) => {
        if (!this.stopCondition) {
                setTimeout(() => {
                    let machineStatus = this.superStep();
                    if (!(machineStatus === SuperescalarStatus.SUPER_BREAKPOINT || machineStatus === SuperescalarStatus.SUPER_ENDEXE)) {
                            this.executionLoop(speed);
                    } else {
                            if (machineStatus === SuperescalarStatus.SUPER_BREAKPOINT) {
                                alert(t('execution.stopped'));
                            } else if (machineStatus === SuperescalarStatus.SUPER_ENDEXE) {
                                this.finishedExecution = true;
                                alert(t('execution.finished'));
                            }
                    }
                }, speed);
        } else if (this.stopCondition === ExecutionStatus.STOP) {
            this.resetMachine();
        }
    }

    saveSuperConfig = (superConfig) => {
        const superConfigKeys = Object.keys(superConfig);

        for (let i = 0; i < (superConfigKeys.length - 2); i++) {
            if (i % 2 === 0) {
                this.superescalar.setFunctionalUnitNumber(i,
                    +superConfig[superConfigKeys[i]]);
            } else {
                this.superescalar.setFunctionalUnitLatency(i,
                    +superConfig[superConfigKeys[i]]);
            }
        }
        this.superescalar.memoryFailLatency = +superConfig.cacheFailLatency;
        this.superescalar.issue = +superConfig.issueGrade;
    }

    setOptions = (cacheFailPercentage: number) => {
        this.superescalar.memory.failProbability = cacheFailPercentage;
    }

    private resetMachine() {
        let code = Object.assign(new Code(), this.superescalar.code);
        this.superExe();
        this.superescalar.code = code;
        this.dispatchAllSuperescalarActions();
        store.dispatch(resetHistory());
    }
}

export default new SuperescalarIntegration();