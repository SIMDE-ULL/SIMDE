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

// Declare browser vars for Typescript
declare var document;
declare var window;

// Global objects for binding React to the View
let superescalar = new Superescalar();
let state: any = {};
window.state = state;

/*
 * Callbacks for allowing the global state to refresh the components
 *
 */
let componentContent = (title: string): any => {
   let result;
   /* tslint:disable */
   switch (title) {
      case 'GPR':
         result = superescalar.gpr.content;
         break;
      case 'FPR':
         result = superescalar.fpr.content;
         break;
      case 'RS +Entera':
         result = superescalar.reserveStationEntry[0];
         break;
      case 'FU +Entera':
         result = superescalar.functionalUnit[FunctionalUnitType.INTEGERSUM];
         break;
      case 'FU xEntera':
         result = superescalar.functionalUnit[FunctionalUnitType.INTEGERMULTIPLY];
   }
   /* tslint:enable */
   return result;
};


let callAllCallbacks = () => {

   // TODO DO NOT CALL CODE!
   for (let callbackName in state) {
      if (callbackName !== 'Code') {
         state[callbackName]({
            content: componentContent(callbackName)
         });
      }
   }
};


// Always use arrow functions for not losing this
let load = (id) => {
   console.debug('Time to load the code');
   let input = document.getElementById(id);
   let code: Code = new Code();
   try {
      code.load(input.value);
   } catch (err) {
      window.alert(err);
   }
};

let superExe = () => {
   superescalar.init(true);
};

let superStep = () => {
   console.debug('Super step!');
   console.debug(state);
   let resul = superescalar.tic();;
   callAllCallbacks();

   if (resul === SuperescalarStatus.SUPER_ENDEXE) {
      window.alert('Done');
   }
};

let loadSuper = () => {
   let code = new Code();
   try {
      code.load(document.getElementById('codeInput').value);
      superExe();
      superescalar.code = code;

      // There is no need to update the code with the rest, it should remain the same during all the program execution
      state['Code']({ code: superescalar.code.instructions, content: superescalar.code });
      superescalar.memory.setDatum(0, 20);
   } catch (err) {
      alert(err);
   }
};




window.load = load;
window.loadSuper = loadSuper;
window.superStep = superStep;
window.superExe = superExe;
window.callAllCallbacks = callAllCallbacks;

ReactDOM.render(
   <App machine={superescalar} />,
   document.getElementById('app')
);

console.debug('Main entry point achieved');
