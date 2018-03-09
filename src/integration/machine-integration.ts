export abstract class MachineIntegration {
    abstract loadCode: ( code: any) => void;
  
    abstract makeBatchExecution: () => void;

    abstract play: () => void;

    abstract pause: () => void;
  
    abstract stop: () => void;
    
    abstract stepBack: () => void;
  
    abstract stepForward: () => void;

    abstract setBatchMode: (...config) => void
    
    calculateSpeed() {
         let speed = parseInt((<HTMLInputElement>document.getElementById('velocidad')).value);
 
         let calculatedSpeed = 2000;
         calculatedSpeed = speed ?  calculatedSpeed / speed : 0;
 
         return calculatedSpeed;
   }
    calculateStandardDeviation(average, values): number {
        const diffs = values.map((value) => value - average);
        const squareDiffs = diffs.map(diff => diff * diff);

        const averageSquareDiff = squareDiffs.reduce( (a,b) => a + b) / squareDiffs.length;

        return Math.sqrt(averageSquareDiff);
    }
}