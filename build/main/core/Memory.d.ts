export interface DatumWithSuccess {
    datum?: number;
    fail?: boolean;
}
export declare class Memory {
    private static NUMBER_OF_WORDS;
    private _data;
    private _fails;
    private _failProbability;
    constructor();
    getDatum(address: number, datum?: number): DatumWithSuccess | Number;
    setDatum(address: number, datum: number): void;
    failProbability: number;
}
