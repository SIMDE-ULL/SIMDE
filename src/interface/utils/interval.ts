export function generateIntervalFromImput(input: string, max: number): number[] {
        
    let newInterval = new Set<number>();

    if(!input) {
        throw 'noEmptyInput';
    }

    input.split(',').map((value: string) => {
        
        if (value.includes('-')) {
            let range = value.split('-');

            let num1 = parseInt(range[0]);
            let num2 = parseInt(range[1]);

            if (isNaN(num1) || isNaN(num2)) {
                throw 'noInputNumber';
            }

            if (num1 >= max || num2 >= max)
            {
                throw `inputOutOfRange`;
            }

            if (num1 >= max) {
                num1 = max - 1;
            }
            if (num2 >= max) {
                num2 = max - 1;
            }
            if (num1 < num2) {
                for (; num1 <= num2; num1++) {
                    newInterval.add(num1);
                }
            } else {
                for (; num2 <= num1; num2++) {
                    newInterval.add(num2);
                }
            }
        } else {
            let num = parseInt(value);

            if (isNaN(num)) {
                throw 'noInputNumber';
            }

            if (num >= max) {
                throw `inputOutOfRange`;
            }
            
            newInterval.add(num);
        }
    });

    return Array.from(newInterval);
}

export function generateRangeArray(size) {
    if (size < 0) {
        throw 'Invalid array range';
    }

    let range = [];
    for (let i = 0; i < size; i++) {
        range.push(i);
    }

    return range;
}