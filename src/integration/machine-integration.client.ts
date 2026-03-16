import type { ContentIntegration } from "./content-integration";

/**
 * Abstract base for machine integration layers (Superscalar, VLIW).
 * Bridges the simulation engine with the Redux store and UI.
 * Client-only — browser APIs (DOM, alert, setTimeout) are used by subclasses.
 */
export abstract class MachineIntegration {
  public contentIntegration!: ContentIntegration;

  /** Speed value sourced from UI. Set by components before calling play(). */
  public speedValue = 0;

  abstract loadCode: (code: any) => void;

  abstract makeBatchExecution: () => void;

  abstract play: () => void;

  abstract pause: () => void;

  abstract stop: () => void;

  abstract stepBack: () => void;

  abstract stepForward: () => void;

  abstract setBatchMode: (replications: number) => void;

  abstract setMemory: (data: { [k: number]: number }) => void;
  abstract setFpr: (data: { [k: number]: number }) => void;
  abstract setGpr: (data: { [k: number]: number }) => void;

  /**
   * Calculates the execution delay from the speed value.
   * Speed value is set by the UI component via `speedValue` property,
   * avoiding direct DOM access (document.getElementById).
   */
  calculateSpeed(): number {
    const defaultStep = 2000;
    return this.speedValue ? defaultStep / this.speedValue : 0;
  }

  calculateStandardDeviation(average: number, values: number[]): number {
    const diffs = values.map((value) => value - average);
    const squareDiffs = diffs.map((diff) => diff * diff);

    const averageSquareDiff =
      squareDiffs.reduce((a, b) => a + b) / squareDiffs.length;

    return Math.sqrt(averageSquareDiff);
  }
}
