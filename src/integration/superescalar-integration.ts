import { Superescalar } from "../core/Superescalar/Superescalar";
import { ExecutionStatus } from "./utils";
import { store } from "../store";
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
  nextTotalCommited,
  nextInstructionsCommited,
  nextUnitsUsage,
  nextInstructionsStatusesAverageCycles,
  nextStatusesCount,
  setCyclesPerReplication,
  clearCyclesPerReplication,
} from "../interface/actions";

import { displayBatchResults } from "../interface/actions/modals";

import { FunctionalUnitType } from "../core/Common/FunctionalUnit";

import {
  pushHistory,
  takeHistory,
  resetHistory,
} from "../interface/actions/history";
import { MAX_HISTORY_SIZE } from "../interface/reducers/machine";

import { t } from "i18next";
import { Code } from "../core/Common/Code";
import { SuperescalarStatus } from "../core/Superescalar/SuperescalarEnums";

import { Stats } from "../stats/stats";
import { StatsAgregator } from "../stats/aggregator";

import { MachineIntegration } from "./machine-integration";

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
  stats = new Stats();
  batchStats = new StatsAgregator();

  /*
   * This call all the components to update the state
   * if there is a step param, the components will use
   * their history to set the appropiate content
   */
  dispatchAllSuperescalarActions = (step?: number) => {
    // Code should only be setted on the first iteration
    const robMap = this.superescalar.reorderBuffer.getVisualInstructionMap();
    store.dispatch(
      batchActions(
        nextJumpTableCycle(this.superescalar.jumpPrediction.getVisualTable()),
        nextPrefetchCycle(this.superescalar.prefetchUnit.getVisualData()),
        nextDecoderCycle(this.superescalar.decoder.getVisualData()),
        nextFunctionalUnitCycle([
          ...this.superescalar.functionalUnit,
          this.superescalar.aluMem,
        ]),
        nextReserveStationCycle([
          {
            data: this.superescalar.getReserveStation(0).getVisualData(robMap),
            size: this.superescalar.getReserveStationSize(0),
          },
          {
            data: this.superescalar.getReserveStation(1).getVisualData(robMap),
            size: this.superescalar.getReserveStationSize(1),
          },
          {
            data: this.superescalar.getReserveStation(2).getVisualData(robMap),
            size: this.superescalar.getReserveStationSize(2),
          },
          {
            data: this.superescalar.getReserveStation(3).getVisualData(robMap),
            size: this.superescalar.getReserveStationSize(3),
          },
          {
            data: this.superescalar.getReserveStation(4).getVisualData(robMap),
            size: this.superescalar.getReserveStationSize(4),
          },
          {
            data: this.superescalar.getReserveStation(5).getVisualData(robMap),
            size: this.superescalar.getReserveStationSize(5),
          },
        ]),
        nextReorderBufferMapperCycle([
          this.superescalar.reorderBuffer.getVisualRegisterMap(false),
          this.superescalar.reorderBuffer.getVisualRegisterMap(true),
        ]),
        nextReorderBufferCycle(this.superescalar.reorderBuffer),
        nextRegistersCycle([
          this.superescalar.gpr.content,
          this.superescalar.fpr.content,
        ]),
        nextMemoryCycle(
          Array.from(this.superescalar.memory).map((d) => d.value),
        ),
        nextCycle(this.superescalar.status.cycle),
        nextTotalCommited(this.stats.getCommitedAndDiscarded()),
        nextInstructionsCommited(
          this.stats.getCommitedPercentagePerInstruction(),
        ),
        nextUnitsUsage(this.stats.getUnitsUsage()),
        nextStatusesCount(this.stats.getPerStatusCountAtCycle()),
        nextInstructionsStatusesAverageCycles(
          this.stats.getInstructionsStatusesAverage(),
        ),
        pushHistory(),
      ),
    );
  };

  collectStats = () => {
    const prefetchInstrs = this.superescalar.prefetchUnit.getVisualData();
    this.stats.collectPrefetchUids(prefetchInstrs.map((data) => data.uid));
    this.stats.collectDecodeUids(
      this.superescalar.decoder.getVisualData().map((data) => data.uid),
    );
    this.stats.collectIssuedUids(
      this.superescalar.reorderBuffer
        .getVisualData()
        .filter((data) => data.superStage === "ISSUE")
        .map((data) => data.instruction.uid),
    );
    this.stats.collectExecutingUids(
      this.superescalar.reorderBuffer
        .getVisualData()
        .filter((data) => data.superStage === "EXECUTE")
        .map((data) => data.instruction.uid),
    );
    this.stats.collectWriteBackUids(
      this.superescalar.reorderBuffer
        .getVisualData()
        .filter((data) => data.superStage === "WRITE")
        .map((data) => data.instruction.uid),
    );
    this.stats.collectCommitUids(this.superescalar.currentCommitedInstrs);

    this.stats.collectUnitUsage(
      "prefetch",
      this.superescalar.prefetchUnit.usage,
    );
    this.stats.collectUnitUsage("decode", this.superescalar.decoder.usage);
    this.stats.collectUnitUsage("rob", this.superescalar.reorderBuffer.usage);
    for (let i = 0; i < 6; i++) {
      this.stats.collectUnitUsage(
        `rs${i}`,
        this.superescalar.getReserveStation(i).usage,
      );
    }
    for (let i = 0; i < 6; i++) {
      this.stats.collectMultipleUnitUsage(
        `fu${i}`,
        this.superescalar.functionalUnit[i].map((fu) => fu.usage),
      );
    }

    for (const instr of prefetchInstrs) {
      this.stats.associateUidWithInstruction(instr.uid, instr.id);
    }

    this.stats.advanceCycle();
  };

  superExe = (reset = true) => {
    this.superescalar.init(reset);
  };

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
        const code = Object.assign(new Code(), this.superescalar.code);
        this.superExe();
        this.superescalar.code = code;

        // Load memory content
        if (this.contentIntegration) {
          this.setFpr(this.contentIntegration.FPRContent);
          this.setGpr(this.contentIntegration.GPRContent);
          this.setMemory(this.contentIntegration.MEMContent);
        }

        this.stats = new Stats();
      }
      const machineStatus = this.superescalar.tic();
      this.collectStats();
      this.dispatchAllSuperescalarActions();

      return machineStatus;
    }
  };

  loadCode = (code: Code) => {
    this.superescalar.code = code;
    this.resetMachine();
    // There is no need to update the code with the rest,
    // it should remain the same during all the program execution
    store.dispatch(superescalarLoad(code.instructions));
  };

  play = () => {
    if (!this.superescalar.code) {
      return;
    }

    this.stopCondition = ExecutionStatus.EXECUTABLE;
    this.backStep = 0;
    this.executing = true;
    const speed = this.calculateSpeed();

    if (this.finishedExecution) {
      this.finishedExecution = false;
      const code = Object.assign(new Code(), this.superescalar.code);
      this.superExe();
      this.superescalar.code = code;

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
      while (this.superescalar.tic() !== SuperescalarStatus.SUPER_ENDEXE) {
        this.collectStats();
      }
      this.collectStats();
      this.dispatchAllSuperescalarActions();
      this.finishedExecution = true;
      alert(t("execution.finished"));
    }
  };

  makeBatchExecution = () => {
    if (!this.superescalar.code) {
      return;
    }

    const results = [];
    this.batchStats = new StatsAgregator();
    for (let i = 0; i < this.replications; i++) {
      const code = Object.assign(new Code(), this.superescalar.code);
      this.superExe();
      this.superescalar.code = code;
      //TODO: check this data, seems to be inverted
      this.superescalar.memory.faultChance = this.cacheFailPercentage / 100;
      this.superescalar.memoryFailLatency = this.cacheFailLatency;

      // Load memory content
      if (this.contentIntegration) {
        this.setFpr(this.contentIntegration.FPRContent);
        this.setGpr(this.contentIntegration.GPRContent);
        this.setMemory(this.contentIntegration.MEMContent);
      }

      // tslint:disable-next-line:no-empty
      while (this.superescalar.tic() !== SuperescalarStatus.SUPER_ENDEXE) {
        this.collectStats();
      }
      this.collectStats();
      this.batchStats.agragate(this.stats);
      results.push(this.superescalar.status.cycle);
      this.stats = new Stats();
    }

    this.clearBatchStateEffects();
    store.dispatch(
      batchActions(
        setCyclesPerReplication(results),
        nextTotalCommited(this.batchStats.getAvgCommitedAndDiscarded()),
        nextUnitsUsage(this.batchStats.getAvgUnitsUsage()),
        nextInstructionsCommited(
          this.batchStats.getAvgCommitedPercentagePerInstruction(),
        ),
        nextStatusesCount(this.batchStats.getPerStatusCountAtCycle()),
        nextInstructionsStatusesAverageCycles(
          this.batchStats.getAvgInstructionsStatusesAverage(),
        ),
        displayBatchResults(this.batchStats.export()),
      ),
    );
    this.batchStats = new StatsAgregator();
  };

  pause = () => {
    this.stopCondition = ExecutionStatus.PAUSE;
    this.executing = false;
  };

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
  };

  stepBack = () => {
    // There is no time travelling for batch mode and initial mode
    if (
      this.superescalar.status.cycle > 0 &&
      this.backStep < MAX_HISTORY_SIZE &&
      this.superescalar.status.cycle - this.backStep > 0
    ) {
      this.backStep++;
      store.dispatch(takeHistory(this.backStep));
    }
  };

  setMemory = (data: { [k: number]: number }) => {
    if (this.superescalar.status.cycle > 0) {
      return;
    }
    for (const key in data) {
      this.superescalar.memory.setDatum(+key, data[key]);
    }
  };

  setFpr = (data: { [k: number]: number }) => {
    if (this.superescalar.status.cycle > 0) {
      return;
    }
    for (const key in data) {
      this.superescalar.fpr.setContent(+key, data[key], false);
    }
  };

  setGpr = (data: { [k: number]: number }) => {
    if (this.superescalar.status.cycle > 0) {
      return;
    }
    for (const key in data) {
      this.superescalar.gpr.setContent(+key, data[key], false);
    }
  };

  executionLoop = (speed) => {
    if (!this.stopCondition) {
      setTimeout(() => {
        const machineStatus = this.stepForward();
        if (
          !(
            machineStatus === SuperescalarStatus.SUPER_BREAKPOINT ||
            machineStatus === SuperescalarStatus.SUPER_ENDEXE
          )
        ) {
          this.executionLoop(speed);
        } else {
          if (machineStatus === SuperescalarStatus.SUPER_BREAKPOINT) {
            alert(t("execution.stopped"));
          } else if (machineStatus === SuperescalarStatus.SUPER_ENDEXE) {
            this.finishedExecution = true;
            alert(t("execution.finished"));
          }
        }
      }, speed);
    } else if (this.stopCondition === ExecutionStatus.STOP) {
      this.resetMachine();
    }
  };

  saveSuperConfig = (superConfig) => {
    // TODO: enforce this through a unique map so that we can overwrite the config directly
    this.superescalar.changeFunctionalUnitNumber(
      FunctionalUnitType.INTEGERSUM,
      +superConfig.integerSumQuantity,
    );
    this.superescalar.changeFunctionalUnitLatency(
      FunctionalUnitType.INTEGERSUM,
      +superConfig.integerSumLatency,
    );

    this.superescalar.changeFunctionalUnitNumber(
      FunctionalUnitType.INTEGERMULTIPLY,
      +superConfig.integerMultQuantity,
    );
    this.superescalar.changeFunctionalUnitLatency(
      FunctionalUnitType.INTEGERMULTIPLY,
      +superConfig.integerMultLatency,
    );

    this.superescalar.changeFunctionalUnitNumber(
      FunctionalUnitType.FLOATINGSUM,
      +superConfig.floatingSumQuantity,
    );
    this.superescalar.changeFunctionalUnitLatency(
      FunctionalUnitType.FLOATINGSUM,
      +superConfig.floatingSumLatency,
    );

    this.superescalar.changeFunctionalUnitNumber(
      FunctionalUnitType.FLOATINGSUM,
      +superConfig.floatingSumQuantity,
    );
    this.superescalar.changeFunctionalUnitLatency(
      FunctionalUnitType.FLOATINGSUM,
      +superConfig.floatingSumLatency,
    );

    this.superescalar.changeFunctionalUnitNumber(
      FunctionalUnitType.FLOATINGMULTIPLY,
      +superConfig.floatingMultQuantity,
    );
    this.superescalar.changeFunctionalUnitLatency(
      FunctionalUnitType.FLOATINGMULTIPLY,
      +superConfig.floatingMultLatency,
    );

    this.superescalar.changeFunctionalUnitNumber(
      FunctionalUnitType.JUMP,
      +superConfig.jumpQuantity,
    );
    this.superescalar.changeFunctionalUnitLatency(
      FunctionalUnitType.JUMP,
      +superConfig.jumpLatency,
    );

    this.superescalar.changeFunctionalUnitNumber(
      FunctionalUnitType.MEMORY,
      +superConfig.memoryQuantity,
    );
    this.superescalar.changeFunctionalUnitLatency(
      FunctionalUnitType.MEMORY,
      +superConfig.memoryLatency,
    );

    this.superescalar.issue = +superConfig.issueGrade;
    this.resetMachine();
  };

  setBatchMode = (
    replications: number,
    cacheFailLatency,
    cacheFailPercentage,
  ) => {
    this.replications = replications;
    this.cacheFailLatency = cacheFailLatency;
    this.cacheFailPercentage = cacheFailPercentage;
  };

  private resetMachine() {
    const code = Object.assign(new Code(), this.superescalar.code);
    this.superExe(true);
    this.superescalar.code = code;

    // Reload memory content
    if (this.contentIntegration) {
      this.setFpr(this.contentIntegration.FPRContent);
      this.setGpr(this.contentIntegration.GPRContent);
      this.setMemory(this.contentIntegration.MEMContent);
    }

    this.stats = new Stats();

    this.dispatchAllSuperescalarActions();
    store.dispatch(resetHistory());
    store.dispatch(clearCyclesPerReplication());
  }

  private clearBatchStateEffects() {
    // Post launch machine clean
    this.superescalar.memory.faultChance = 0;
    this.superescalar.memoryFailLatency = 0;
    this.resetMachine();
  }
}

export default new SuperescalarIntegration();
