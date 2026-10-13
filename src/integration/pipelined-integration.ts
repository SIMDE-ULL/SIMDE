import { MachineIntegration } from './machine-integration';
import { Pipelined } from '../core/Pipelined/Pipelined';
import { ExecutionStatus } from './utils';
import { StatsAgregator } from '../stats/aggregator';
import { Stats } from '../stats/stats';
import { PipelinedStatus } from '../core/Pipelined/PipelinedEnums';
import { store } from '../store';
import { displayBatchResults } from '../interface/actions/modals';
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
    pipelinedLoad,
    batchActions,
    nextTotalCommited,
    nextInstructionsCommited,
    nextUnitsUsage,
    nextInstructionsStatusesAverageCycles,
    nextStatusesCount,
    setCyclesPerReplication,
    clearCyclesPerReplication
} from '../interface/actions';

export class PipelinedIntegration extends MachineIntegration {
  pipelined = new Pipelined();
  codeLoaded = false;
  interval = null;
  backStep = 0;
  stopCondition = ExecutionStatus.EXECUTABLE;
  finishedExecution = false;
  executing = false;
  replications = 0;
  stats = new Stats();
  batchStats = new StatsAgregator();

  loadCode = (code: Code) => {
      this.pipelined.code = code;
      this.resetMachine();
      // There is no need to update the code with the rest,
      // it should remain the same during all the program execution
      store.dispatch(pipelinedLoad(code.instructions));
  }

  private clearBatchStateEffects() {
      // Post launch machine clean
      this.resetMachine();
  }

  makeBatchExecution = () => {
      if (!this.pipelined.code) {
          return;
      }

      const results = [];
      this.batchStats = new StatsAgregator();
      for (let i = 0; i < this.replications; i++) {
          const code = Object.assign(new Code(), this.pipelined.code);
          this.pipeExe();
          this.pipelined.code = code;


          // Load memory content
          if (this.contentIntegration) {
              this.setFpr(this.contentIntegration.FPRContent);
              this.setGpr(this.contentIntegration.GPRContent);
              this.setMemory(this.contentIntegration.MEMContent);
          }

          // tslint:disable-next-line:no-empty
          while (this.pipelined.tic() !== PipelinedStatus.PIPE_ENDEXE) { 
              this.collectStats();
          }
          this.collectStats();
          this.batchStats.agragate(this.stats);
          results.push(this.pipelined.status.cycle);
          this.stats = new Stats();
      }
      this.clearBatchStateEffects();
      store.dispatch(
          batchActions(
              setCyclesPerReplication(results),
              nextTotalCommited(this.batchStats.getAvgCommitedAndDiscarded()),
              nextUnitsUsage(this.batchStats.getAvgUnitsUsage()),
              nextInstructionsCommited(this.batchStats.getAvgCommitedPercentagePerInstruction()),
              nextStatusesCount(this.batchStats.getPerStatusCountAtCycle()),
              nextInstructionsStatusesAverageCycles(this.batchStats.getAvgInstructionsStatusesAverage()),
              displayBatchResults(this.batchStats.export())
              ));
      this.batchStats = new StatsAgregator();
    }


    play = () => {
        if (!this.pipelined.code) {
            return;
        }

        this.stopCondition = ExecutionStatus.EXECUTABLE;
        this.backStep = 0;
        this.executing = true;
        let speed = this.calculateSpeed();

        if (this.finishedExecution) {
            this.finishedExecution = false;
            let code = Object.assign(new Code(), this.pipelined.code);
            this.pipeExe();
            this.pipelined.code = code;

            // Load memory content
            if (this.contentIntegration) {
                this.setFpr(this.contentIntegration.FPRContent);
                this.setGpr(this.contentIntegration.GPRContent);
                this.setMemory(this.contentIntegration.MEMContent);
            }

            this.stats = new Stats();
        }

        if (speed) {
            this.executionLoop(speed);
        } else {
            // tslint:disable-next-line:no-empty
            while (this.pipelined.tic() !== pipelinedStatus.SUPER_ENDEXE) {
                this.collectStats();
            }
            this.collectStats();
            this.dispatchAllpipelinedActions();
            this.finishedExecution = true;
            alert(t('execution.finished'));
        }

    }
    pause = () => {
      this.stopCondition = ExecutionStatus.PAUSE;
      this.executing = false;
    }
    stop = () => {
        if (!this.pipelined.code) {
            return;
        }
        // In normal execution I have to avoid the asynchrnous way of
        // js entering in the interval, the only way I have is to using a semaphore
        this.stopCondition = ExecutionStatus.STOP;

        if (!this.executing) {
            this.executing = false;
            this.resetMachine();
        }
    }        // There is no time travelling for batch mode and initial mode

    stepBack = (data: { [k: number]: number }) => {
        if (this.pipelined.status.cycle > 0 && this.backStep < MAX_HISTORY_SIZE &&
            (this.pipelined.status.cycle - this.backStep > 0)) {
            this.backStep++;
            store.dispatch(takeHistory(this.backStep));
        }
    }
    setFpr = (data: { [k: number]: number }) => {
            if (this.pipelined.status.cycle > 0) {
                return;
            }
            Object.keys(data).forEach(key => {
                this.pipelined.fpr.setContent(+key, data[key], false);
            });
        }
      
    setGpr = (data: { [k: number]: number }) => {
        if (this.pipelined.status.cycle > 0) {
            return;
        }
        Object.keys(data).forEach(key => {
            this.pipelined.gpr.setContent(+key, data[key], false);
        });
    }
}

export default new PipelinedIntegration();