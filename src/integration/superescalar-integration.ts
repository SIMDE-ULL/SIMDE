import { Superescalar } from '../core/Superescalar/Superescalar';
import { ExecutionStatus } from '../main-consts';
import { store } from '../store';
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
    batchActions,
    colorCell
} from '../interface/actions';

import { FunctionalUnitType } from '../core/Common/FunctionalUnit';

import { pushHistory, takeHistory, resetHistory } from '../interface/actions/history';
import { MAX_HISTORY_SIZE } from '../interface/reducers/machine';

import { t } from 'i18next';
import { Code } from '../core/Common/Code';
import { SuperescalarStatus } from '../core/Superescalar/SuperescalarEnums';
import { displayBatchResults } from '../interface/actions/modals';

import { MachineIntegration } from './machine-integration';

export class SuperescalarIntegration extends MachineIntegration {
    // Global objects for binding React to the View
    superescalar = new Superescalar();
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
                        }]
                    ),
                    nextReorderBufferMapperCycle([this.superescalar.ROBGpr, this.superescalar.ROBFpr]),
                    nextReorderBufferCycle(this.superescalar.reorderBuffer.elements),
                    nextRegistersCycle([this.superescalar.gpr.content, this.superescalar.fpr.content]),
                    nextMemoryCycle(this.superescalar.memory.data),
                    nextCycle(this.superescalar.status.cycle),
                    pushHistory()
                )
        );
    }

    superExe = (reset: boolean = true) => {
        this.superescalar.init(reset);
    }

    stepForward = () => {

        if (!this.superescalar.code) {
            return;
        }

        if (this.backStep > 0) {
            this.backStep--;
            store.dispatch(takeHistory(this.backStep));
        } else {
            if (this.finishedExecution) {
                this.finishedExecution = false;
                let code = Object.assign(new Code(), this.superescalar.code);
                this.superExe();
                this.superescalar.code = code;

                // Load memory content
                if (this.contentIntegration) {
                    this.setFpr(this.contentIntegration.FPRContent);
                    this.setGpr(this.contentIntegration.GPRContent);
                    this.setMemory(this.contentIntegration.MEMContent);
                }
            }
            let machineStatus = this.superescalar.tic();
            this.dispatchAllSuperescalarActions();

            return machineStatus;
        }
    }

    loadCode = (code: Code) => {
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

        if (this.finishedExecution) {
            this.finishedExecution = false;
            let code = Object.assign(new Code(), this.superescalar.code);
            this.superExe();
            this.superescalar.code = code;

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
            while (this.superescalar.tic() !== SuperescalarStatus.SUPER_ENDEXE) { }
            this.dispatchAllSuperescalarActions();
            this.finishedExecution = true;
            alert(t('execution.finished'));
        }
    }

    makeBatchExecution = () => {
        if (!this.superescalar.code) {
            return;
        }

        const results = [];
        for (let i = 0; i < this.replications; i++) {
            let code = Object.assign(new Code(), this.superescalar.code);
            this.superExe();
            this.superescalar.code = code;
            this.superescalar.memory.failProbability = this.cacheFailPercentage;
            this.superescalar.memoryFailLatency = this.cacheFailLatency;

            // Load memory content
            if (this.contentIntegration) {
                this.setFpr(this.contentIntegration.FPRContent);
                this.setGpr(this.contentIntegration.GPRContent);
                this.setMemory(this.contentIntegration.MEMContent);
            }

            // tslint:disable-next-line:no-empty
            while (this.superescalar.tic() !== SuperescalarStatus.SUPER_ENDEXE) { }
            results.push(this.superescalar.status.cycle);
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

    colorCell = (instructionId, color) => {
        this.superescalar.reorderBuffer.elements.filter(e => e != null && e.instruction.id === +instructionId)[0].instruction.color = color.hex;
        this.superescalar.reserveStationEntry = this.superescalar.reserveStationEntry.map(ree => ree.map(reserveStationEntry => {
            if (reserveStationEntry.instruction.id === +instructionId) {
                reserveStationEntry.instruction.color = color.hex;
            }
            return reserveStationEntry;
        }));
        this.superescalar.functionalUnit = this.superescalar.functionalUnit.map(functionalUnit => functionalUnit.map(fu => {
            fu.flow = fu.flow.map(instruction => {
                if (instruction && instruction.id === +instructionId) {
                    instruction.color = color.hex;
                }
                return instruction;
            });
            return fu;
        }));
        store.dispatch(
            batchActions(
                nextReorderBufferCycle(this.superescalar.reorderBuffer.elements),
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
                    }]
                ),
                colorCell(instructionId, color.hex)
            )
        );
    }

    stepBack = () => {
        // There is no time travelling for batch mode and initial mode
        if (this.superescalar.status.cycle > 0 && this.backStep < MAX_HISTORY_SIZE &&
            (this.superescalar.status.cycle - this.backStep > 0)) {
            this.backStep++;
            store.dispatch(takeHistory(this.backStep));
        }
    }

    setMemory = (data: { [k: number]: number }) => {
        if (this.superescalar.status.cycle > 0) {
            return;
        }
        Object.keys(data).forEach(key => {
            this.superescalar.memory.setDatum(+key, data[key]);
        });
    }

    setFpr = (data: { [k: number]: number }) => {
        if (this.superescalar.status.cycle > 0) {
            return;
        }
        Object.keys(data).forEach(key => {
            this.superescalar.fpr.setContent(+key, data[key], false);
        });
    }

    setGpr = (data: { [k: number]: number }) => {
        if (this.superescalar.status.cycle > 0) {
            return;
        }
        Object.keys(data).forEach(key => {
            this.superescalar.gpr.setContent(+key, data[key], false);
        });
    }

    executionLoop = (speed) => {
        if (!this.stopCondition) {
            setTimeout(() => {
                let machineStatus = this.stepForward();
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
        // TODO: enforce this through a unique map so that we can overwrite the config directly

        this.superescalar.setFunctionalUnitNumber(FunctionalUnitType.INTEGERSUM,+superConfig["integerSumQuantity"]);
        this.superescalar.setFunctionalUnitLatency(FunctionalUnitType.INTEGERSUM,+superConfig["integerSumLatency"]);

        this.superescalar.setFunctionalUnitNumber(FunctionalUnitType.INTEGERMULTIPLY,+superConfig["integerMultQuantity"]);
        this.superescalar.setFunctionalUnitLatency(FunctionalUnitType.INTEGERMULTIPLY,+superConfig["integerMultLatency"]);

        this.superescalar.setFunctionalUnitNumber(FunctionalUnitType.FLOATINGSUM,+superConfig["floatingSumQuantity"]);
        this.superescalar.setFunctionalUnitLatency(FunctionalUnitType.FLOATINGSUM,+superConfig["floatingSumLatency"]);

        this.superescalar.setFunctionalUnitNumber(FunctionalUnitType.FLOATINGSUM,+superConfig["floatingSumQuantity"]);
        this.superescalar.setFunctionalUnitLatency(FunctionalUnitType.FLOATINGSUM,+superConfig["floatingSumLatency"]);

        this.superescalar.setFunctionalUnitNumber(FunctionalUnitType.FLOATINGMULTIPLY,+superConfig["floatingMultQuantity"]);
        this.superescalar.setFunctionalUnitLatency(FunctionalUnitType.FLOATINGMULTIPLY,+superConfig["floatingMultLatency"]);
        
        this.superescalar.setFunctionalUnitNumber(FunctionalUnitType.JUMP,+superConfig["jumpQuantity"]);
        this.superescalar.setFunctionalUnitLatency(FunctionalUnitType.JUMP,+superConfig["jumpLatency"]);
        
        this.superescalar.setFunctionalUnitNumber(FunctionalUnitType.MEMORY,+superConfig["memoryQuantity"]);
        this.superescalar.setFunctionalUnitLatency(FunctionalUnitType.MEMORY,+superConfig["memoryLatency"]);
        
        this.superescalar.issue = +superConfig.issueGrade;
        this.resetMachine();
    }

    setBatchMode = (replications: number, cacheFailLatency, cacheFailPercentage) => {
        this.replications = replications;
        this.cacheFailLatency = cacheFailLatency;
        this.cacheFailPercentage = cacheFailPercentage;
    }

    private resetMachine() {
        let code = Object.assign(new Code(), this.superescalar.code);
        this.superExe(true);
        this.superescalar.code = code;

        // Reload memory content
        if (this.contentIntegration) {
            this.setFpr(this.contentIntegration.FPRContent);
            this.setGpr(this.contentIntegration.GPRContent);
            this.setMemory(this.contentIntegration.MEMContent);
        }
        this.dispatchAllSuperescalarActions();
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
        this.superescalar.memory.failProbability = 0;
        this.superescalar.memoryFailLatency = 0;
        this.resetMachine();
    }
}

export default new SuperescalarIntegration();
