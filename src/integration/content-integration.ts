import { start } from 'repl';
import { MEMORY_SIZE, MACHINE_REGISTER_SIZE } from '../core/Constants';

export class ContentIntegration {

    public FPRContent: { [k: number]: number } = {};
    public GPRContent: { [k: number]: number } = {};
    public MEMContent: { [k: number]: number } = {};

    private currentContent: string = '';

    private _currentSelected;

    constructor(private input: string) {
        input = this.normalizeBreakLines(input);
        this.proccessContent(input.split('\n'));
    }

    normalizeBreakLines(input: string): string {
        return input.replace(/(?:\r\n|\r)/g, '\n');
    }

    proccessContent(lines: string[]) {
        this.currentContent = '';

        for (let i = 0; i < lines.length; i++) {
            if (lines[i].match(/^#\w+/)) {
                this.parseContent(lines[i]);
            } else if (lines[i].match(/^\[\d+\]/)) {
                this.parseLine(lines[i]);
            } else if (lines[i].match(/^\/\//)) {
                continue;
            } else {
                throw new Error(`Unexpected line format at line ${i + 1}`);
            }
        }
    }

    parseContent(value: string) {
        switch (value) {
            case '#GPR':
                this.currentContent = 'GPRContent';
                break;
            case '#FPR':
                this.currentContent = 'FPRContent';
                break;
            case '#MEM':
                this.currentContent = 'MEMContent';
                break;
            default:
                throw new Error('Unexpected content type');
        }
    }

    parseLine(line: string) {
        if (this.currentContent === '') {
            throw new Error('The data has no content (MEM, REG) associated');
        }
        const startPosition = +line.match(/\[(\d+)\]/)[1];

        let values: string[] | number[] = line.split(' ');
        values.shift();

        // Not parsing the second value at the moment
        values.shift();

        this.validateInnerBounds(this.currentContent, startPosition, values.length);

        values = values.map(v => +v);
        for (let i = 0; i < values.length; i++) {
            this[this.currentContent][startPosition + i] = values[i];
        }
    }

    private validateInnerBounds(currentContent: string, startPosition: number, valuesLength: number) {
        if (currentContent === 'MEMContent' && startPosition + valuesLength >= MEMORY_SIZE ||
            currentContent !== 'MEMContent' && startPosition + valuesLength >= MACHINE_REGISTER_SIZE) {
            throw new Error('Setted data out of bounds');
        }
    }
}
