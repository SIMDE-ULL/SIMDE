import { Code } from './core/Code';
import { Superescalar } from './core/Superescalar';
import { SuperescalarStatus } from './core/SuperescalarEnums';

declare var document;
declare var window;
let superescalar = new Superescalar();
let load = (id) => {

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

let superexe = () => {
   superescalar.init(true);
}

let pasoSuper = () => {
   let resul = superescalar.tic();
   document.getElementById('registros').innerText = superescalar.gpr.content;
   if (resul === SuperescalarStatus.SUPER_ENDEXE) {
      window.alert('SE ACABOOO');
   }
}
let loadSuper = () => {
   let code = new Code();

   code.load(document.getElementById('demo_super').value);
   superexe();
   superescalar.code = code;
}


window.load = load;
window.loadSuper = loadSuper;
window.pasoSuper = pasoSuper;
window.superexe = superexe;
