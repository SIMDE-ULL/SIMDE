import { Code } from './core/Code';
import { Superescalar } from './core/Superescalar';
import { SuperescalarStatus } from './core/SuperescalarEnums';
import { FunctionalUnitType } from './core/FunctionalUnit';
import 'jquery';
import 'bootstrap/dist/js/bootstrap.min.js';

import * as React from 'react';
import * as ReactDOM from 'react-dom';

import App from './interface/App';

const styles = require('./main.scss');

// Declare browser vars for Typescript
declare var document;
declare var window;

// Global objects for binding React to the View
let superescalar = new Superescalar();
let state: any = {};
window.interval = null;
window.state = state;

/*
 * This functions relates the component name with the 
 * approtiate fucntion content.
 * Parameter: the title of the component.
 * Returns: Component content.
 */
let componentContent = (title: string): any => {
   let result;
   /* tslint:disable */
   switch (title) {
      case 'Prefetch':
         result = superescalar.prefetchUnit.elements;
         break;
      case 'Decoder':
         result = superescalar.decoder.elements;
         break;
      case 'ROB<->GPR':
         result = superescalar.ROBGpr;
         break;
      case 'ROB<->FPR':
         result = superescalar.ROBFpr;
         break;
      case 'Jump':
         result = superescalar.$jumpPrediction;
         break;
      case 'ReorderBuffer':
         result = superescalar.reorderBuffer.elements;
         break;
      case 'Registros generales':
         result = superescalar.gpr.content;
         break;
      case 'Registros de punto flotante':
         result = superescalar.fpr.content;
         break;
      case 'Memoria':
         result = superescalar.memory.data;
         break;
      case 'Integer +':
         result = {
            data: superescalar.reserveStationEntry[0],
            size: superescalar.getReserveStationSize(0)
         };

         break;
      case 'Integer x':
         result = {
            data: superescalar.reserveStationEntry[1],
            size: superescalar.getReserveStationSize(1)
         };

         break;
      case 'Floating +':
         result = {
            data: superescalar.reserveStationEntry[2],
            size: superescalar.getReserveStationSize(2)
         };

         break;
      case 'Floating x':
         result = {
            data: superescalar.reserveStationEntry[3],
            size: superescalar.getReserveStationSize(3)
         };

         break;
      case 'Memoru':
         result = {
            data: superescalar.reserveStationEntry[4],
            size: superescalar.getReserveStationSize(4)
         };

         break;
      case 'Jumpito':
         result = {
            data: superescalar.reserveStationEntry[5],
            size: superescalar.getReserveStationSize(5)
         };

         break;
      case '+Entera':
         result = superescalar.functionalUnit[0];
         break;
      case 'xEntera':
         result = superescalar.functionalUnit[1];
         break;
      case '+Flotante':
         result = superescalar.functionalUnit[2];
         break;
      case 'xFlotante':
         result = superescalar.functionalUnit[3];
         break;
      case 'Mem':
         result = superescalar.functionalUnit[4];
         break;
      case 'Jumputo':
         result = superescalar.functionalUnit[5];
         break;
      case 'cycle':
         result = superescalar.status.cycle;
         break;
   }
   /* tslint:enable */
   return result;
};


let callAllCallbacks = () => {
   for (let callbackName in state) {
      // Code should only be setted on the first iteration
      if (callbackName !== 'Code') {
         state[callbackName]({
            content: componentContent(callbackName)
         });
      }
   }
};


// Always use arrow functions for not losing "this"
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
   let resul = superescalar.tic();
   callAllCallbacks();

   if (resul === SuperescalarStatus.SUPER_ENDEXE) {
      throw 'Done';
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

let play = () => {
   let speed = calculateSpeed();
   if (superescalar.status.cycle === 0) {
      let code = Object.assign(new Code(), superescalar.code);
      superExe();
      superescalar.code = code;
   }
   if (speed) {
      window.interval = setInterval(() => {
         try {
            superStep();
         } catch (err) {
            window.alert(err);
            clearInterval(window.interval);
         }
      }, speed);
   } else {
      // Continuous execution mode;
      // tslint:disable-next-line:no-empty
      while (superescalar.tic() !== SuperescalarStatus.SUPER_ENDEXE) { }
      callAllCallbacks();
      window.alert('Done');
   }
};

let pause = () => {
   clearInterval(window.interval);
};

let stop = () => {
   clearInterval(window.interval);
   // TODO clean reboot the machine and clean the interface
   let code = Object.assign(new Code(), superescalar.code);
   superExe();
   superescalar.code = code;
   callAllCallbacks();
};

let stepBack = () => {
   console.log('This is just for time travellers');
};

function calculateSpeed() {
   let speed = +document.getElementById('velocidad').value;
   let calculatedSpeed = 2000;
   if (speed) {
      calculatedSpeed /= speed;
   } else {
      calculatedSpeed = 0;
   }

   return calculatedSpeed;
};

let saveSuperConfig = (superConfig) => {
   const superConfigKeys = Object.keys(superConfig);
   for (let i = 0; i < (superConfigKeys.length - 2); i++) {
      if (i % 2 === 0) {
         superescalar.setFunctionalUnitNumber(i,
            +superConfig[superConfigKeys[i]]);
      } else {
         superescalar.setFunctionalUnitLatency(i,
            +superConfig[superConfigKeys[i]]);
      }
   }
   superescalar.memoryFailLatency = +superConfig.cacheFailLatency;
   superescalar.issue = +superConfig.issueGrade;
   console.log(superescalar);
};

let colorBlocks = () => {
   state['Code']({ color: true });
};

/*
 * For exposing the functions to react and the ts code
 * we need to attach them to the Windows object, so
 * in runtime they will be visible from anywhere.
 */
window.load = load;
window.loadSuper = loadSuper;
window.superStep = superStep;
window.superExe = superExe;
window.play = play;
window.stop = stop;
window.pause = pause;
window.stepBack = stepBack;
window.saveSuperConfig = saveSuperConfig;
window.callAllCallbacks = callAllCallbacks;
window.colorBlocks = colorBlocks;

ReactDOM.render(
   <App machine={superescalar} />,
   document.getElementById('app')
);
