import { Superscalar } from "../core/Superscalar/Superscalar";
import {
  batchActions,
  clearCyclesPerReplication,
  nextCycle,
  nextDecoderCycle,
  nextFunctionalUnitCycle,
  nextInstructionsCommited,
  nextInstructionsStatusesAverageCycles,
  nextJumpTableCycle,
  nextMemoryCycle,
  nextPrefetchCycle,
  nextRegistersCycle,
  nextReorderBufferCycle,
  nextReorderBufferMapperCycle,
  nextReserveStationCycle,
  nextStatusesCount,
  nextTotalCommited,
  nextUnitsUsage,
  setCyclesPerReplication,
  superscalarLoad,
} from "../interface/actions";
import { store } from "../store";
import { ExecutionStatus } from "./utils";

import { displayBatchResults } from "../interface/actions/modals";

import { FunctionalUnitType } from "../core/Common/FunctionalUnit";

import {
  pushHistory,
  resetHistory,
  takeHistory,
} from "../interface/actions/history";
import { MAX_HISTORY_SIZE } from "../interface/reducers/machine";

import { type CacheType, createCache } from "../core/Common/Cache";
import { Code } from "../core/Common/Code";
import { SuperscalarStatus } from "../core/Superscalar/SuperscalarEnums";
import i18n from "../i18n";
import {
  clearNotification,
  showNotification,
} from "../interface/reducers/notification";

import { StatsAgregator } from "../stats/aggregator";
import { Stats } from "../stats/stats";

import { MachineIntegration } from "./machine-integration.client";

export class SuperscalarIntegration extends MachineIntegration {
  // Global objects for binding React to the View
  superscalar = new Superscalar();
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
   * Dispatches all component state updates.
   * If a step parameter is provided, components use
   * their history to set the appropriate content.
   */
  dispatchAllSuperscalarActions = (_step?: number) => {
    // Code is only set on the first iteration
    const robMap = this.superscalar.reorderBuffer.getVisualInstructionMap();
    store.dispatch(
      batchActions(
        nextJumpTableCycle(this.superscalar.jumpPrediction.getVisualTable()),
        nextPrefetchCycle(this.superscalar.prefetchUnit.getVisualData()),
        nextDecoderCycle(this.superscalar.decoder.getVisualData()),
        nextFunctionalUnitCycle([
          ...this.superscalar.functionalUnit,
          this.superscalar.aluMem,
        ]),
        nextReserveStationCycle([
          {
            data: this.superscalar.getReserveStation(0).getVisualData(robMap),
            size: this.superscalar.getReserveStationSize(0),
          },
          {
            data: this.superscalar.getReserveStation(1).getVisualData(robMap),
            size: this.superscalar.getReserveStationSize(1),
          },
          {
            data: this.superscalar.getReserveStation(2).getVisualData(robMap),
            size: this.superscalar.getReserveStationSize(2),
          },
          {
            data: this.superscalar.getReserveStation(3).getVisualData(robMap),
            size: this.superscalar.getReserveStationSize(3),
          },
          {
            data: this.superscalar.getReserveStation(4).getVisualData(robMap),
            size: this.superscalar.getReserveStationSize(4),
          },
          {
            data: this.superscalar.getReserveStation(5).getVisualData(robMap),
            size: this.superscalar.getReserveStationSize(5),
          },
        ]),
        nextReorderBufferMapperCycle([
          this.superscalar.reorderBuffer.getVisualRegisterMap(false),
          this.superscalar.reorderBuffer.getVisualRegisterMap(true),
        ]),
        nextReorderBufferCycle(this.superscalar.reorderBuffer),
        nextRegistersCycle([
          this.superscalar.gpr.content,
          this.superscalar.fpr.content,
        ]),
        nextMemoryCycle(Array.from(this.superscalar.memory)),
        nextCycle(this.superscalar.status.cycle),
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
    const prefetchInstrs = this.superscalar.prefetchUnit.getVisualData();
    this.stats.collectPrefetchUids(prefetchInstrs.map((data) => data.uid));
    this.stats.collectDecodeUids(
      this.superscalar.decoder.getVisualData().map((data) => data.uid),
    );
    this.stats.collectIssuedUids(
      this.superscalar.reorderBuffer
        .getVisualData()
        .filter((data) => data.superStage === "ISSUE")
        .map((data) => data.instruction.uid),
    );
    this.stats.collectExecutingUids(
      this.superscalar.reorderBuffer
        .getVisualData()
        .filter((data) => data.superStage === "EXECUTE")
        .map((data) => data.instruction.uid),
    );
    this.stats.collectWriteBackUids(
      this.superscalar.reorderBuffer
        .getVisualData()
        .filter((data) => data.superStage === "WRITE")
        .map((data) => data.instruction.uid),
    );
    this.stats.collectCommitUids(this.superscalar.currentCommitedInstrs);

    this.stats.collectUnitUsage(
      "prefetch",
      this.superscalar.prefetchUnit.usage,
    );
    this.stats.collectUnitUsage("decode", this.superscalar.decoder.usage);
    this.stats.collectUnitUsage("rob", this.superscalar.reorderBuffer.usage);
    for (let i = 0; i < 6; i++) {
      this.stats.collectUnitUsage(
        `rs${i}`,
        this.superscalar.getReserveStation(i).usage,
      );
    }
    for (let i = 0; i < 6; i++) {
      this.stats.collectMultipleUnitUsage(
        `fu${i}`,
        this.superscalar.functionalUnit[i].map((fu) => fu.usage),
      );
    }

    for (const instr of prefetchInstrs) {
      this.stats.associateUidWithInstruction(instr.uid, instr.id);
    }

    this.stats.advanceCycle();
  };

  superExe = (reset = true) => {
    this.superscalar.init(reset);
  };

  stepForward = () => {
    if (!this.superscalar.code) {
      return;
    }

    if (this.backStep > 0) {
      this.backStep--;
      store.dispatch(takeHistory(this.backStep));
    } else {
      if (this.finishedExecution) {
        this.finishedExecution = false;
        const code = Object.assign(new Code(), this.superscalar.code);
        this.superExe();
        this.superscalar.code = code;

        // Load memory content
        if (this.contentIntegration) {
          this.setFpr(this.contentIntegration.FPRContent);
          this.setGpr(this.contentIntegration.GPRContent);
          this.setMemory(this.contentIntegration.MEMContent);
        }

        this.stats = new Stats();
      }
      const machineStatus = this.superscalar.tic();
      this.collectStats();
      this.dispatchAllSuperscalarActions();

      return machineStatus;
    }
  };

  loadCode = (code: Code) => {
    this.superscalar.code = code;
    this.resetMachine();
    // The code remains the same during the entire program execution,
    // so it does not need to be updated with the rest of the state.
    store.dispatch(superscalarLoad(code.instructions));
  };

  play = () => {
    if (!this.superscalar.code) {
      return;
    }

    this.stopCondition = ExecutionStatus.EXECUTABLE;
    this.backStep = 0;
    this.executing = true;
    const speed = this.calculateSpeed();

    if (this.finishedExecution) {
      this.finishedExecution = false;
      const code = Object.assign(new Code(), this.superscalar.code);
      this.superExe();
      this.superscalar.code = code;

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
      while (this.superscalar.tic() !== SuperscalarStatus.SUPER_ENDEXE) {
        this.collectStats();
      }
      this.collectStats();
      this.dispatchAllSuperscalarActions();
      this.finishedExecution = true;
      store.dispatch(showNotification(i18n.t("execution.finished")));
    }
  };

  makeBatchExecution = () => {
    if (!this.superscalar.code) {
      return;
    }

    const results = [];
    this.batchStats = new StatsAgregator();
    for (let i = 0; i < this.replications; i++) {
      const code = Object.assign(new Code(), this.superscalar.code);
      this.superExe();
      this.superscalar.code = code;

      // Load memory content
      if (this.contentIntegration) {
        this.setFpr(this.contentIntegration.FPRContent);
        this.setGpr(this.contentIntegration.GPRContent);
        this.setMemory(this.contentIntegration.MEMContent);
      }

      while (this.superscalar.tic() !== SuperscalarStatus.SUPER_ENDEXE) {
        this.collectStats();
      }
      this.collectStats();
      this.batchStats.agragate(this.stats);
      results.push(this.superscalar.status.cycle);
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
    store.dispatch(clearNotification());
  };

  stop = () => {
    if (!this.superscalar.code) {
      return;
    }
    // During normal execution, a semaphore prevents the asynchronous
    // interval callback from re-entering the execution loop.
    this.stopCondition = ExecutionStatus.STOP;
    store.dispatch(clearNotification());

    if (!this.executing) {
      this.executing = false;
      this.resetMachine();
    }
  };

  stepBack = () => {
    // Time travel is unavailable in batch mode and initial mode
    if (
      this.superscalar.status.cycle > 0 &&
      this.backStep < MAX_HISTORY_SIZE &&
      this.superscalar.status.cycle - this.backStep > 0
    ) {
      this.backStep++;
      store.dispatch(takeHistory(this.backStep));
    }
  };

  setMemory = (data: { [k: number]: number }) => {
    if (this.superscalar.status.cycle > 0) {
      return;
    }

    for (const key in data) {
      this.superscalar.memory.setData(+key, data[key]);
    }
  };

  setFpr = (data: { [k: number]: number }) => {
    if (this.superscalar.status.cycle > 0) {
      return;
    }
    for (const key of Object.keys(data)) {
      this.superscalar.fpr.setContent(+key, data[+key], false);
    }
  };

  setGpr = (data: { [k: number]: number }) => {
    if (this.superscalar.status.cycle > 0) {
      return;
    }
    for (const key of Object.keys(data)) {
      this.superscalar.gpr.setContent(+key, data[+key], false);
    }
  };

  executionLoop = (speed: number) => {
    if (!this.stopCondition) {
      setTimeout(() => {
        const machineStatus = this.stepForward();
        if (
          !(
            machineStatus === SuperscalarStatus.SUPER_BREAKPOINT ||
            machineStatus === SuperscalarStatus.SUPER_ENDEXE
          )
        ) {
          this.executionLoop(speed);
        } else {
          if (machineStatus === SuperscalarStatus.SUPER_BREAKPOINT) {
            store.dispatch(showNotification(i18n.t("execution.stopped")));
          } else if (machineStatus === SuperscalarStatus.SUPER_ENDEXE) {
            this.finishedExecution = true;
            store.dispatch(showNotification(i18n.t("execution.finished")));
          }
        }
      }, speed);
    } else if (this.stopCondition === ExecutionStatus.STOP) {
      this.resetMachine();
    }
  };

  saveSuperConfig = (superConfig: {
    integerSumQuantity: number;
    integerSumLatency: number;
    integerMultQuantity: number;
    integerMultLatency: number;
    floatingSumQuantity: number;
    floatingSumLatency: number;
    floatingMultQuantity: number;
    floatingMultLatency: number;
    memoryQuantity: number;
    memoryLatency: number;
    jumpQuantity: number;
    jumpLatency: number;
    issueGrade: number;
    cacheType: CacheType;
    cacheFailPercentage: number;
    cacheFailLatency: number;
    cacheBlocks: number;
    cacheLines: number;
  }) => {
    this.superscalar.changeFunctionalUnitNumber(
      FunctionalUnitType.INTEGERSUM,
      superConfig.integerSumQuantity,
    );
    this.superscalar.changeFunctionalUnitLatency(
      FunctionalUnitType.INTEGERSUM,
      superConfig.integerSumLatency,
    );

    this.superscalar.changeFunctionalUnitNumber(
      FunctionalUnitType.INTEGERMULTIPLY,
      superConfig.integerMultQuantity,
    );
    this.superscalar.changeFunctionalUnitLatency(
      FunctionalUnitType.INTEGERMULTIPLY,
      superConfig.integerMultLatency,
    );

    this.superscalar.changeFunctionalUnitNumber(
      FunctionalUnitType.FLOATINGSUM,
      superConfig.floatingSumQuantity,
    );
    this.superscalar.changeFunctionalUnitLatency(
      FunctionalUnitType.FLOATINGSUM,
      superConfig.floatingSumLatency,
    );

    this.superscalar.changeFunctionalUnitNumber(
      FunctionalUnitType.FLOATINGMULTIPLY,
      superConfig.floatingMultQuantity,
    );
    this.superscalar.changeFunctionalUnitLatency(
      FunctionalUnitType.FLOATINGMULTIPLY,
      superConfig.floatingMultLatency,
    );

    this.superscalar.changeFunctionalUnitNumber(
      FunctionalUnitType.JUMP,
      superConfig.jumpQuantity,
    );
    this.superscalar.changeFunctionalUnitLatency(
      FunctionalUnitType.JUMP,
      superConfig.jumpLatency,
    );

    this.superscalar.changeFunctionalUnitNumber(
      FunctionalUnitType.MEMORY,
      superConfig.memoryQuantity,
    );
    this.superscalar.changeFunctionalUnitLatency(
      FunctionalUnitType.MEMORY,
      superConfig.memoryLatency,
    );

    this.superscalar.issue = superConfig.issueGrade;

    this.superscalar.cache = createCache(
      superConfig.cacheType,
      superConfig.cacheBlocks,
      superConfig.cacheLines,
      superConfig.cacheFailPercentage / 100,
    );
    this.superscalar.memoryFailLatency = superConfig.cacheFailLatency;

    this.resetMachine();
  };

  setBatchMode = (replications: number) => {
    this.replications = replications;
  };

  private resetMachine() {
    const code = Object.assign(new Code(), this.superscalar.code);
    this.superExe(true);
    this.superscalar.code = code;

    // Reload memory content
    if (this.contentIntegration) {
      this.setFpr(this.contentIntegration.FPRContent);
      this.setGpr(this.contentIntegration.GPRContent);
      this.setMemory(this.contentIntegration.MEMContent);
    }

    this.stats = new Stats();

    this.dispatchAllSuperscalarActions();
    store.dispatch(resetHistory());
    store.dispatch(clearCyclesPerReplication());
  }

  private clearBatchStateEffects() {
    // Post launch machine clean
    this.resetMachine();
  }
}

export default new SuperscalarIntegration();
