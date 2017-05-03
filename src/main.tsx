import { Code } from './core/Code';
import { Superescalar } from './core/Superescalar';
import { SuperescalarStatus } from './core/SuperescalarEnums';
import { FunctionalUnitType } from './core/FunctionalUnit';
import 'jquery';
import 'bootstrap/dist/js/bootstrap.min.js';

import * as React from 'react';
import * as ReactDOM from 'react-dom';

import App from './interface/App';

const styles = require('./main.css');


declare var document;
declare var window;
let superescalar = new Superescalar();
let state: any = {};
window.state = state;

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
   document.getElementById('registrosf').innerText = superescalar.fpr.content;
   document.getElementById('pc').innerText = superescalar.status.cycle;
   // state.callback({
   //    title: 'GPR',
   //    content: superescalar.gpr.content
   // });
   state['GPR']({ content: superescalar.gpr.content });
   state['FPR']({ content: superescalar.fpr.content });
   state['MEM']({ content: superescalar.gpr.content });
   state['RS +Entera']({ content: superescalar.reserveStationEntry[0] });
   state['FU +Entera']({ content: superescalar.functionalUnit[FunctionalUnitType.INTEGERSUM] });

   if (resul === SuperescalarStatus.SUPER_ENDEXE) {
      window.alert('SE ACABOOO');
   }
}
let loadSuper = () => {
   let code = new Code();

   code.load(document.getElementById('demo_super').value);
   superexe();
   superescalar.code = code;
   state['Code']({ code: superescalar.code.instructions, content: superescalar.code });
   superescalar.memory.setDatum(0, 20);
};



window.load = load;
window.loadSuper = loadSuper;
window.pasoSuper = pasoSuper;
window.superexe = superexe;


ReactDOM.render(
   <App machine={superescalar} />,
   document.getElementById('app')
);
