import { LargeInstruction } from './LargeInstructions';
import { Code } from '../Common/Code';
import { VLIWOperation } from './VLIWOperation';
import { Opcodes } from '../Common/Opcodes';

export class VLIWParser {

    public static Parse(input: string, code: Code): LargeInstruction[] {
        const splittedInputInRows: string[] = input.split('\n');

        let linesNumber: number, operationsAmount: number, index: number, predicate: number;
        let functionalUnitType: number, functionalUnitAmount: number;
        let destination: number, predicateTrue: number, predicateFalse: number;

        // Let's extract the amount of lines
        linesNumber = +splittedInputInRows[0];
        let instructions: LargeInstruction[] = new Array<LargeInstruction>(linesNumber);
        instructions.fill(new LargeInstruction());

        splittedInputInRows.shift();
        
        if (linesNumber != splittedInputInRows.length)
        {
            throw new Error('The lines number does not match the program amount of lines');
        }

        for (let i = 0; i < splittedInputInRows.length; i++)
        {
            // TODO replace this for the proper regexp
            const splittedRow: string[] = splittedInputInRows[i].trim().split(/[\t+|\s+]/);

            let instructionsAmount = +splittedRow[0];
            if (instructionsAmount > 0) {
                index = +splittedRow[1];
                functionalUnitType = +splittedRow[2];
                functionalUnitAmount = +splittedRow[3];
                predicate = +splittedRow[4];
                if (code.getFunctionalUnitType(index) != functionalUnitType ) {
                    throw new Error(`Functional unit type at line ${i + 1} mismatch, expected ${code.getFunctionalUnitType(index)} got ${functionalUnitType}`)
                }
            }
            let operation = new VLIWOperation(null, code.instructions[index], functionalUnitType, functionalUnitAmount);
            operation.setPred(predicate);
            // TODO y el bgt?
            if (operation.isJump()) {
                let destiny, predTrue, predFalse;
                destiny = +splittedRow[5];
                operation.setOperand(2, destiny, '');
                predTrue = +splittedRow[6];
                predFalse = +splittedRow[7];
                operation.setPredTrue(predTrue);
                operation.setPredFalse(predFalse);
            }
            instructions[i].addOperation(operation);
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
                outputString += operation.getTipoUF();
                outputString += ' ';
                outputString += operation.getTipoUF();   
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
