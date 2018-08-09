import { LargeInstruction } from './LargeInstructions';
import { Code } from '../Common/Code';
import { VLIWOperation } from './VLIWOperation';
import { Opcodes } from '../Common/Opcodes';

export class VLIWParser {

    public static Parse(input: string, code: Code): LargeInstruction[] {
        const splittedInputInRows: string[] = input.split('\n');

        let linesNumber: number, operationsAmount: number, index: number, predicate: number;

        let functionalUnitType: number, functionalUnitIndex: number;

        let destination: number, predicateTrue: number, predicateFalse: number;

        // Let's extract the amount of lines
        linesNumber = +splittedInputInRows[0];
        let instructions: LargeInstruction[] = new Array<LargeInstruction>(linesNumber);

        splittedInputInRows.shift();
        
        if (linesNumber != splittedInputInRows.length)
        {
            throw new Error('The lines number does not match the program amount of lines');
        }

        for (let i = 0; i < splittedInputInRows.length; i++)
        {
            instructions[i] = new LargeInstruction();
            // TODO replace this for the proper regexp
            const splittedRow: string[] = splittedInputInRows[i].trim().split(/[\t+|\s+]/);

            let instructionsAmount = +splittedRow[0];
            if (instructionsAmount > 0) {
                let acc = 0;
                for (let j = 0; j < instructionsAmount; j++) {

                    index = +splittedRow[j*4+1+acc];
                    functionalUnitType = +splittedRow[j*4+2+acc];
                    functionalUnitIndex = +splittedRow[j*4+3+acc];
                    predicate = +splittedRow[j*4+4];

                    if (code.getFunctionalUnitType(index) != functionalUnitType ) {
                        throw new Error(`Functional unit type at line ${i + 1} mismatch, expected ${code.getFunctionalUnitType(index)} got ${functionalUnitType}`)
                    }
                    let operation = new VLIWOperation(null, code.instructions[index], functionalUnitType, functionalUnitIndex);
                    operation.setPred(predicate);

                    // TODO y el bgt?
                    if (operation.isJump()) {
                        let destiny, predTrue, predFalse;
                        destiny = +splittedRow[j*4+5+acc];
                        operation.setOperand(2, destiny, '');
                        predTrue = +splittedRow[j*4+6+acc];
                        predFalse = +splittedRow[j*4+7+acc];
                        operation.setPredTrue(predTrue);
                        operation.setPredFalse(predFalse);
                        acc += 3;
                    }

                    instructions[i].addOperation(operation);

                }
            }      
        }

        return instructions;
    }

    public static ExportAsString(_instructionNumber: number, _instructions: LargeInstruction[]): string {       
        
        let outputString: string;
        outputString += _instructionNumber;

        for (let i = 0; i < _instructionNumber; i++) {
            let operationAmount = _instructions[i].getNOper();
            outputString += operationAmount;
        
            for (let j = 0; j < operationAmount; j++) {
        
                let operation = _instructions[i].getOperation(j);
                outputString += '\t'; 
                outputString += operation.id;
                outputString += ' ';
                outputString += operation.getFunctionalUnitType();
                outputString += ' ';
                outputString += operation.getFunctionalUnitType();   
                outputString += ' ';
                outputString += operation.getPred();

                if(operation.isJump()) {
                    outputString += ' ';
                    outputString += operation.getOperand(2);
                    outputString += ' ';
                    outputString += operation.getPredTrue();
                    outputString += ' ';
                    outputString += operation.getPredFalse();      
                }
            }
            outputString += '\n';
        }
        return outputString;
    }
}
