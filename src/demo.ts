import { Code } from './core/Code';
// import { Superescalar } from './core/Superescalar';

declare var document;
declare var window;

function load() {

  let input = document.getElementById('input_code');
  console.log('Input', input.value);
  let code: Code = new Code();
  // let superescalar: Superescalar = new Superescalar();
  code.load(input.value);
  let resultObject: any = {
    'lines': code.lines,
    'numberOfBlocks': code.numberOfBlocks,
    'basicBlocks': code.basicBlocks,
    'instructions': code.instructions
  }
  debugger;
  let lines = document.getElementById('lines');
  let numberOfBlocks = document.getElementById('numberOfBlocks');
  let basicBlocks = document.getElementById('basicBlocks');
  let instructions = document.getElementById('instructions');
  lines.innerText = 'Lines: ' + code.lines;
  numberOfBlocks.innerText = 'Number of blocks: ' + code.numberOfBlocks;
  basicBlocks.innerText = 'Basic Blocks \n' + JSON.stringify(code.basicBlocks);
  instructions.innerText = 'Instructions \n' + JSON.stringify(code.instructions);
}
window.load = load;