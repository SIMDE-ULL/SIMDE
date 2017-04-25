import { Code } from './core/Code';
import { Superescalar } from './core/Superescalar';

declare var document;
declare var window;

function load(id) {

   let input = document.getElementById(id);
   let code: Code = new Code();
   // let superescalar: Superescalar = new Superescalar();
   // superescalar.code = code;
   try {
      code.load(input.value);
   } catch (err) {
      window.alert(err);
   }
   // let lines = document.getElementById('lines');
   // let numberOfBlocks = document.getElementById('numberOfBlocks');
   // let basicBlocks = document.getElementById('basicBlocks');
   // let instructions = document.getElementById('instructions');
   // lines.innerText = 'Lines: ' + code.lines;
   // numberOfBlocks.innerText = 'Number of blocks: ' + code.numberOfBlocks;
   // basicBlocks.innerText = 'Basic Blocks \n' + JSON.stringify(code.basicBlocks);
   // instructions.innerText = 'Instructions \n' + JSON.stringify(code.instructions);
}
window.load = load;