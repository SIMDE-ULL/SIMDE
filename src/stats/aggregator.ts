import type { Stats, InstructionStatsEntry } from "./stats";

export interface StatEntry {
  replication: number;
  stats: object;
}

export class StatsAgregator {
  private _stats: Array<Stats> = new Array();

  public agragate(stats: Stats) {
    this._stats.push(stats);
  }

  public export(): Array<StatEntry> {
    const result = [];

    for (let i = 0; i < this._stats.length; i++) {
      result.push({
        replication: i,
        stats: this._stats[i].exportStats(),
      });
    }

    return result;
  }

  public getAvgUnitsUsage(): Map<string, number[]> {
    const result = new Map();

    for (const stat of this._stats) {
      const usages = stat.getUnitsUsage();
      for (const key of usages.keys()) {
        if (!result.has(key)) {
          result.set(key, []);
        }
        result.get(key).push(usages.get(key));
      }
    }

    for (const key of result.keys()) {
      result.set(key, this.avgOfArrays(result.get(key)));
    }

    return result;
  }

  public getAvgCommitedAndDiscarded(): { commited: number; discarded: number } {
    let commited = 0;
    let discarded = 0;

    for (const stat of this._stats) {
      const stats = stat.getCommitedAndDiscarded();
      commited += stats.commited;
      discarded += stats.discarded;
    }

    return {
      commited: commited / this._stats.length,
      discarded: discarded / this._stats.length,
    };
  }

  public getAvgCommitedPercentagePerInstruction(): Map<number, number> {
    const result = new Map<number, number>();

    for (const stat of this._stats) {
      const stats = stat.getCommitedPercentagePerInstruction();
      for (const [key, value] of stats) {
        if (!result.has(key)) {
          result.set(key, 0);
        }
        result.set(key, result.get(key) + value);
      }
    }

    for (const [key, value] of result) {
      result.set(key, value / this._stats.length);
    }

    return result;
  }

  public getAvgInstructionsStatusesAverage(): Map<
    number,
    InstructionStatsEntry
  > {
    const result = new Map<number, InstructionStatsEntry>();

    for (const stat of this._stats) {
      const stats = stat.getInstructionsStatusesAverage();
      for (const [key, value] of stats) {
        if (!result.has(key)) {
          result.set(key, value);
        } else {
          //iterate over the properties of the object
          for (const prop in value) {
            result.get(key)[prop] += value[prop];
          }
        }
      }
    }

    for (const [, value] of result) {
      for (const prop in value) {
        value[prop] = value[prop] / this._stats.length;
      }
    }

    return result;
  }

  public getPerStatusCountAtCycle(): Map<string, number[]> {
    const result = new Map();

    for (const stat of this._stats) {
      const stats = stat.getPerStatusCountAtCycle();
      for (const key of stats.keys()) {
        if (!result.has(key)) {
          result.set(key, []);
        }
        result.get(key).push(stats.get(key));
      }
    }

    for (const key of result.keys()) {
      result.set(key, this.avgOfArrays(result.get(key)));
    }

    return result;
  }

  private avgOfArrays(arr: number[][]): number[] {
    const result = [];
    const maxlen = arr.reduce((max, arr) => Math.max(max, arr.length), 0);
    for (let i = 0; i < maxlen; i++) {
      let sum = 0;
      for (let j = 0; j < arr.length; j++) {
        if (i >= arr[j].length) {
          continue;
        }

        sum += arr[j][i];
      }
      result.push(sum / arr.length);
    }
    return result;
  }
}
