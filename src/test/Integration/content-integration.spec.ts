import test from 'ava';
import { ContentIntegration } from '../../integration/content-integration';

const input = `
#FPR
[40] 1 1
`;

const input2 = `
[40] 1 1
`;

const input3 = `
#GPR
[1] 5 1 2 3 4 5 
#MEM
[33] 5 6 7 8 9 10 
`

const input4= `
#MEM
[1023] 2 6 7
`

// const input5= `
// #MEM
// 1023 2 6 7
// `


test('Current content is selected properly', t => {
    let contentIntegration = new ContentIntegration(input);
    t.is(contentIntegration.FPRContent[40], 1 , 'Should be 1 at position 40');
    t.is(contentIntegration.FPRContent[41], 1 , 'Should be 1 at position 41');
});

test('Throws error if no content is selected', t => {
	let error = t.throws(() => new ContentIntegration(input2));
	t.is(error.message, 'The data has no content (MEM, REG) associated');
});


test('Fills proper data', t => {
    let contentIntegration = new ContentIntegration(input3);
    t.is(contentIntegration.GPRContent[1], 5 , 'Should be 1 at position 1');
    t.is(contentIntegration.GPRContent[2], 1 , 'Should be 2 at position 2');
    t.is(contentIntegration.GPRContent[3], 2 , 'Should be 3 at position 3');
    t.is(contentIntegration.GPRContent[4], 3 , 'Should be 4 at position 4');
    t.is(contentIntegration.GPRContent[5], 4 , 'Should be 5 at position 5');
    t.is(contentIntegration.GPRContent[6], 5 , 'Should be 5 at position 6');

    t.is(contentIntegration.MEMContent[33], 5 , 'Should be 6 at position 33');
    t.is(contentIntegration.MEMContent[34], 6 , 'Should be 7 at position 34');
    t.is(contentIntegration.MEMContent[35], 7 , 'Should be 8 at position 35');
    t.is(contentIntegration.MEMContent[36], 8 , 'Should be 9 at position 36');
    t.is(contentIntegration.MEMContent[37], 9 , 'Should be 10 at position 37');
    t.is(contentIntegration.MEMContent[38], 10  , 'Should be 10 at position 38');
});

test('Throws error when exceeding bounds', t=> {
    let error = t.throws(() => new ContentIntegration(input4));
    t.is(error.message, 'Setted data out of bounds');
});

// test ('Throws error when memory address line isnt wrapped in brackets', t => {
//     let error = t.throws(() => new ContentIntegration(input5));
//     t.is(error.message, 'Unexpected line format at line 1');
// });