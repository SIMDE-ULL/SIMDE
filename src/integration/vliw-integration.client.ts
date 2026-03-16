import {
  batchActions,
  currentPC,
  nextCycle,
  nextFunctionalUnitCycle,
  nextMemoryCycle,
  nextRegistersCycle,
  nextUnitsUsage,
  nextVLIWExecutionTableCycle,
  nextVLIWHeaderTableCycle,
  setCyclesPerReplication,
  superscalarLoad,
} from "../interface/actions";
import { store } from "../store";
import { ExecutionStatus } from "./utils";

import {
  pushHistory,
  resetHistory,
  takeHistory,
} from "../interface/actions/history";
import { MAX_HISTORY_SIZE } from "../interface/reducers/machine";

import i18n from "../i18n";

import { createCache } from "../core/Common/Cache";
import { VLIW } from "../core/VLIW/VLIW";
import { VLIWCode } from "../core/VLIW/VLIWCode";
import { VLIWError } from "../core/VLIW/VLIWError";
import { VLIWOperation } from "../core/VLIW/VLIWOperation";
import { displayBatchResults } from "../interface/actions/modals";
import {
  nextNatFprCycle,
  nextNatGprCycle,
  nextPredicateCycle,
} from "../interface/actions/predicate-nat-actions";
import { MachineIntegration } from "./machine-integration.client";

import { FunctionalUnitType } from "@/core/Common/FunctionalUnit";
import {
  clearNotification,
  showNotification,
} from "../interface/reducers/notification";
import { StatsAgregator } from "../stats/aggregator";
import { Stats } from "../stats/stats";

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
   * Dispatches all component state updates.
   * If a step parameter is provided, components use
   * their history to set the appropriate content.
   */

  dispatchAllVLIWActions = (_step?: number) => {
    // Code is only set on the first iteration
    store.dispatch(
      batchActions(
        nextFunctionalUnitCycle([...this.vliw.functionalUnit]),
        nextVLIWHeaderTableCycle(this.vliw.functionalUnitNumbers),
        nextVLIWExecutionTableCycle(
          this.vliw.code.instructions,
          this.vliw.functionalUnitNumbers,
        ),
        nextRegistersCycle([this.vliw.gpr.content, this.vliw.fpr.content]),
        nextMemoryCycle(Array.from(this.vliw.memory)),
        nextCycle(this.vliw.status.cycle),
        currentPC(this.vliw.pc),
        nextNatFprCycle(this.vliw.getNaTFP() as boolean[]),
        nextNatGprCycle(this.vliw.getNaTGP() as boolean[]),
        nextPredicateCycle(this.vliw.getPredReg() as boolean[]),
        nextUnitsUsage(this.stats.getUnitsUsage()),
        pushHistory(),
      ),
    );
  };

  collectStats = () => {
    for (let i = 0; i < 6; i++) {
      this.stats.collectMultipleUnitUsage(
        `fu${i}`,
        this.vliw.functionalUnit[i].map((fu) => fu.usage),
      );
    }

    this.stats.advanceCycle();
  };

  vliwExe = () => {
    this.vliw.init(true);
  };

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
        const code = Object.assign(new VLIWCode(), this.vliw.code);
        this.vliwExe();
        this.vliw.code = code;

        // Load memory content
        if (this.contentIntegration) {
          this.setFpr(this.contentIntegration.FPRContent);
          this.setGpr(this.contentIntegration.GPRContent);
          this.setMemory(this.contentIntegration.MEMContent);
        }
      }
      const machineStatus = this.vliw.tic();
      this.collectStats();
      this.dispatchAllVLIWActions();

      return machineStatus;
    }
  };

  loadCode = (vliwCode: VLIWCode) => {
    this.vliw.code = vliwCode;
    this.resetMachine();
    // The code remains the same during the entire program execution,
    // so it does not need to be updated with the rest of the state.
    store.dispatch(nextVLIWHeaderTableCycle(this.vliw.functionalUnitNumbers));
    store.dispatch(
      nextVLIWExecutionTableCycle(
        this.vliw.code.instructions,
        this.vliw.functionalUnitNumbers,
      ),
    );
    store.dispatch(superscalarLoad(vliwCode.superscalarCode.instructions));
  };

  setOperation = (
    codeInstructionIdx: { loc: number },
    position: [number, number],
  ) => {
    // Block VLIW operation setting if machine is executing
    if (this.vliw.status.cycle > 0) {
      throw new Error("Cannot set operations in the middle of an execution");
    }

    const { loc } = codeInstructionIdx;
    const [instructionIdx, operationIdx] = position;
    const functionalUnitType =
      this.vliw.code.superscalarCode.getFunctionalUnitType(loc);
    let functionalUnitIdx = 0;

    for (let i = 0; i < this.vliw.functionalUnitNumbers.length; i++) {
      if (functionalUnitIdx >= operationIdx) {
        // Reset functional unit number index to previous in order to check
        // if the functional unit type corresponds to the VLIW operand
        if (functionalUnitIdx !== operationIdx) {
          i -= 1;
        }

        // In case it does not correspond, throw exception and abort
        if (i !== functionalUnitType) {
          throw new Error("VLIW operand does not match with Functional Unit");
        }

        functionalUnitIdx -= operationIdx;
        break;
      }
      functionalUnitIdx += this.vliw.functionalUnitNumbers[i];
    }

    const operation = new VLIWOperation(
      undefined,
      this.vliw.code.superscalarCode.instructions[loc],
      functionalUnitType,
      functionalUnitIdx,
    );

    // Pop out any former operations in the same slot
    const popIdx = this.vliw.code.instructions[
      instructionIdx
    ].operations.findIndex(
      (op) =>
        op.getFunctionalUnitType() === functionalUnitType &&
        op.getFunctionalUnitIndex() === functionalUnitIdx,
    );
    if (popIdx >= 0) {
      this.vliw.code.instructions[instructionIdx].operations.splice(popIdx, 1);
    }

    this.vliw.code.instructions[instructionIdx].addOperation(operation);
    store.dispatch(
      nextVLIWExecutionTableCycle(
        this.vliw.code.instructions,
        this.vliw.functionalUnitNumbers,
      ),
    );
  };

  play = () => {
    if (!this.vliw.code) {
      return;
    }

    this.stopCondition = ExecutionStatus.EXECUTABLE;
    this.backStep = 0;
    this.executing = true;
    const speed = this.calculateSpeed();

    if (this.finishedExecution) {
      this.finishedExecution = false;
      const code = Object.assign(new VLIWCode(), this.vliw.code);
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
      // TODO: Consider displaying VLIWErrors and stopping execution.
      let err = VLIWError.OK;
      while (err !== VLIWError.ENDEXE) {
        err = this.vliw.tic();
        this.collectStats();
        if (
          err !== VLIWError.OK &&
          err !== VLIWError.ENDEXE &&
          err !== VLIWError.PCOUTOFRANGE
        ) {
          store.dispatch(
            showNotification(`${i18n.t("execution.error")}: ${VLIWError[err]}`),
          );
          err = VLIWError.ENDEXE;
        }
      }
      this.collectStats();
      this.dispatchAllVLIWActions();
      this.finishedExecution = true;
      store.dispatch(showNotification(i18n.t("execution.finished")));
    }
  };

  makeBatchExecution = () => {
    if (!this.vliw.code) {
      return;
    }

    const results = [];
    for (let i = 0; i < this.replications; i++) {
      const code = Object.assign(new VLIWCode(), this.vliw.code);
      this.vliwExe();
      this.vliw.code = code;

      // Load memory content
      if (this.contentIntegration) {
        this.setFpr(this.contentIntegration.FPRContent);
        this.setGpr(this.contentIntegration.GPRContent);
        this.setMemory(this.contentIntegration.MEMContent);
      }

      // TODO: Consider displaying VLIWErrors and stopping execution.
      let err = VLIWError.OK;
      while (err !== VLIWError.ENDEXE) {
        err = this.vliw.tic();
        this.collectStats();
        if (
          err !== VLIWError.OK &&
          err !== VLIWError.ENDEXE &&
          err !== VLIWError.PCOUTOFRANGE
        ) {
          store.dispatch(
            showNotification(`${i18n.t("execution.error")}: ${VLIWError[err]}`),
          );
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
        displayBatchResults(this.batchStats.export()),
      ),
    );
  };

  pause = () => {
    this.stopCondition = ExecutionStatus.PAUSE;
    this.executing = false;
    store.dispatch(clearNotification());
  };

  stop = () => {
    if (!this.vliw.code) {
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
      this.vliw.status.cycle > 0 &&
      this.backStep < MAX_HISTORY_SIZE &&
      this.vliw.status.cycle - this.backStep > 0
    ) {
      this.backStep++;
      store.dispatch(takeHistory(this.backStep));
    }
  };

  setMemory = (data: { [k: number]: number }) => {
    if (this.vliw.status.cycle > 0) {
      return;
    }
    for (const key in data) {
      this.vliw.memory.setData(+key, data[key]);
    }
  };

  setFpr = (data: { [k: number]: number }) => {
    if (this.vliw.status.cycle > 0) {
      return;
    }
    Object.keys(data).forEach((key) => {
      this.vliw.fpr.setContent(+key, data[+key], false);
    });
  };

  setGpr = (data: { [k: number]: number }) => {
    if (this.vliw.status.cycle > 0) {
      return;
    }
    Object.keys(data).forEach((key) => {
      this.vliw.gpr.setContent(+key, data[+key], false);
    });
  };

  executionLoop = (speed: number) => {
    if (!this.stopCondition) {
      setTimeout(() => {
        const machineStatus = this.stepForward();
        let stop = true;
        switch (machineStatus) {
          case VLIWError.OK:
          case VLIWError.PCOUTOFRANGE: //TODO: is this really an error? We always go out of range when we finish the execution or there is a branch at the end
            stop = false;
            break;
          case VLIWError.BREAKPOINT:
            store.dispatch(showNotification(i18n.t("execution.stopped")));
            break;
          case VLIWError.ENDEXE:
            this.finishedExecution = true;
            store.dispatch(showNotification(i18n.t("execution.finished")));
            break;
          default:
            store.dispatch(
              showNotification(
                `${i18n.t("execution.error")}: ${VLIWError[machineStatus!]}`,
              ),
            );
            break;
        }

        if (!stop) {
          this.executionLoop(speed);
        }
      }, speed);
    } else if (this.stopCondition === ExecutionStatus.STOP) {
      this.resetMachine();
    }
  };

  saveVliwConfig = (vliwConfig: Record<string, any>) => {
    this.vliw.changeFunctionalUnitNumber(
      FunctionalUnitType.INTEGERSUM,
      +vliwConfig.integerSumQuantity,
    );
    this.vliw.changeFunctionalUnitLatency(
      FunctionalUnitType.INTEGERSUM,
      +vliwConfig.integerSumLatency,
    );

    this.vliw.changeFunctionalUnitNumber(
      FunctionalUnitType.INTEGERMULTIPLY,
      +vliwConfig.integerMultQuantity,
    );
    this.vliw.changeFunctionalUnitLatency(
      FunctionalUnitType.INTEGERMULTIPLY,
      +vliwConfig.integerMultLatency,
    );

    this.vliw.changeFunctionalUnitNumber(
      FunctionalUnitType.FLOATINGSUM,
      +vliwConfig.floatingSumQuantity,
    );
    this.vliw.changeFunctionalUnitLatency(
      FunctionalUnitType.FLOATINGSUM,
      +vliwConfig.floatingSumLatency,
    );

    this.vliw.changeFunctionalUnitNumber(
      FunctionalUnitType.FLOATINGMULTIPLY,
      +vliwConfig.floatingMultQuantity,
    );
    this.vliw.changeFunctionalUnitLatency(
      FunctionalUnitType.FLOATINGMULTIPLY,
      +vliwConfig.floatingMultLatency,
    );

    this.vliw.changeFunctionalUnitNumber(
      FunctionalUnitType.JUMP,
      +vliwConfig.jumpQuantity,
    );
    this.vliw.changeFunctionalUnitLatency(
      FunctionalUnitType.JUMP,
      +vliwConfig.jumpLatency,
    );

    this.vliw.changeFunctionalUnitNumber(
      FunctionalUnitType.MEMORY,
      +vliwConfig.memoryQuantity,
    );
    this.vliw.changeFunctionalUnitLatency(
      FunctionalUnitType.MEMORY,
      +vliwConfig.memoryLatency,
    );

    this.vliw.cache = createCache(
      vliwConfig.cacheType,
      +vliwConfig.cacheBlocks,
      +vliwConfig.cacheLines,
      +vliwConfig.cacheFailPercentage / 100,
    );
    this.vliw.memoryFailLatency = +vliwConfig.cacheFailLatency;

    this.resetMachine();
  };

  setBatchMode = (replications: number) => {
    this.replications = replications;
  };

  private resetMachine() {
    const code = Object.assign(new VLIWCode(), this.vliw.code);
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
