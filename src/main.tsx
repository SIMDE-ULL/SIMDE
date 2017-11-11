import { Code } from './core/Common/Code';
import { Superescalar } from './core/Superescalar/Superescalar';
import { SuperescalarStatus } from './core/Superescalar/SuperescalarEnums';
import { FunctionalUnitType } from './core/Common/FunctionalUnit';
import { ExecutionStatus } from './main-consts';

import 'jquery';
import 'bootstrap/dist/js/bootstrap.min.js';

import * as React from 'react';
import * as ReactDOM from 'react-dom';
import i18n from './i18n'; // initialized i18next instance
import { I18nextProvider } from 'react-i18next'; // as we build ourself via webpack

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
window.backStep = 0;

/*
 * These functions matches the component name with the 
 * appropiate function content.
 * Parameter: the title of the component.
 * Returns: Component content.
 */
let componentContent = (title: string): any => {
   let result;
   /* tslint:disable */
   switch (title) {
      case 'Prefetch':
         result = superescalar.prefetchUnit;
         break;
      case 'Decoder':
         result = superescalar.decoder;
         break;
      case 'ROB<->GPR':
         result = superescalar.ROBGpr;
         break;
      case 'ROB<->FPR':
         result = superescalar.ROBFpr;
         break;
      case 'Jump table':
         result = superescalar.jumpPrediction;
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
      case 'Memory':
         result = {
            data: superescalar.reserveStationEntry[4],
            size: superescalar.getReserveStationSize(4)
         };
         break;
      case 'Jump':
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
      case 'JumpUF':
         result = superescalar.functionalUnit[5];
         break;
      case 'AluMem':
         result = superescalar.aluMem;
         break;
      case 'cycle':
         result = superescalar.status.cycle;
         break;
   }
   /* tslint:enable */
   return result;
};

/*
 * This call all the components to update the state
 * if there is a step param, the components will use
 * their history to set the appropiate content
 */
let callAllCallbacks = (step?: number) => {
   // Code should only be setted on the first iteration
   if (step) {
      for (let callbackName in state) {
         if (callbackName !== 'Code') {
            state[callbackName]({
               step: step
            });
         }
      }
   } else {
      for (let callbackName in state) {
         if (callbackName !== 'Code') {
            state[callbackName]({
               content: componentContent(callbackName)
            });
         }
      }
   }
};

let superExe = () => {
   superescalar.init(true);
};

let superStep = () => {
   if (window.backStep > 0) {
      window.backStep--;
      callAllCallbacks(window.backStep);
   } else {
      if (window.finishedExecution) {
         window.finishedExecution = false;
         callAllCallbacks(-1);
         superescalar.status.cycle = 0;
      }
      if (superescalar.status.cycle === 0) {
         let code = Object.assign(new Code(), superescalar.code);
         superExe();
         superescalar.code = code;
      }
      let resul = superescalar.tic();
      callAllCallbacks();
      return resul;
   }
};

let loadSuper = () => {
   let code = new Code();
   try {
      code.load(document.getElementById('codeInput').value);
      superExe();
      superescalar.code = code;

      // There is no need to update the code with the rest,
      // it should remain the same during all the program execution
      state['Code']({ code: superescalar.code.instructions, content: superescalar.code });
      callAllCallbacks();
   } catch (err) {
      alert(err);
   }
};

let play = () => {
   window.stopCondition = ExecutionStatus.EXECUTABLE;
   window.backStep = 0;
   window.executing = true;
   let speed = calculateSpeed();

   // Check if the execution has finished 
   if (window.finishedExecution) {
      window.finishedExecution = false;
      callAllCallbacks(-1);
      superescalar.status.cycle = 0;
   }
   if (superescalar.status.cycle === 0) {
      let code = Object.assign(new Code(), superescalar.code);
      superExe();
      superescalar.code = code;
   }
   if (speed) {
      executionLoop(speed);
   } else {
      // tslint:disable-next-line:no-empty
      while (superescalar.tic() !== SuperescalarStatus.SUPER_ENDEXE) { }
      callAllCallbacks();
      window.finishedExecution = true;
      window.alert('Done');
   }

};

let pause = () => {
   window.stopCondition = ExecutionStatus.PAUSE;
   window.executing = false;
};

let stop = () => {

   // In normal execution I have to avoid the asynchrnous way of
   // js entering in the interval, the only way I have is to check this
   window.stopCondition = ExecutionStatus.STOP;

   if (!window.executing) {
      window.executing = false;
      callAllCallbacks(-1);
      superescalar.status.cycle = 0;
      let code = Object.assign(new Code(), superescalar.code);
      superExe();
      superescalar.code = code;
   }
};

let stepBack = () => {
   // There is no time travelling for batch mode and initial mode
   if (superescalar.status.cycle > 0 && window.backStep < 10 &&
      (superescalar.status.cycle - window.backStep > 0)) {
      window.backStep++;
      callAllCallbacks(window.backStep);
   }
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

function executionLoop(speed) {
   if (!window.stopCondition) {
      setTimeout(() => {
         let result = superStep();
         if (!(result === SuperescalarStatus.SUPER_BREAKPOINT || result === SuperescalarStatus.SUPER_ENDEXE)) {
            executionLoop(speed);
         } else {
            if (result === SuperescalarStatus.SUPER_BREAKPOINT) {
               alert('Ejecución detenida, breakpoint');
            } else if (result === SuperescalarStatus.SUPER_ENDEXE) {
               window.finishedExecution = true;
               alert('Ejecución finalizada');
            }
         }
      }, speed);
   } else if (window.stopCondition === ExecutionStatus.STOP) {
      let code = Object.assign(new Code(), superescalar.code);
      superExe();
      superescalar.code = code;
      callAllCallbacks(-1);
   }
}

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
};

let setOptions = (cacheFailPercentage: number) => {
   superescalar.memory.failProbability = cacheFailPercentage;
};

let colorBlocks = (color) => {
   state['Code']({ color: color });
};

let setBreakpoint = (i) => {
   superescalar.code.instructions[i].breakPoint = !superescalar.code.instructions[i].breakPoint;
   state['Code']({ code: superescalar.code.instructions, content: superescalar.code });
};

/*
 * For exposing the functions to react and the ts code
 * we need to attach them to the Windows object, so
 * in runtime they will be visible from anywhere.
 */
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
window.setBreakpoint = setBreakpoint;
window.stopCondition = ExecutionStatus.EXECUTABLE;
window.finishedExecution = false;
window.executing = false;

/*
 * Here is where the react endpoint appears
 *
 */
ReactDOM.render(
   <I18nextProvider i18n={i18n}><App machine={superescalar} /></I18nextProvider>,
   document.getElementById('app')
);
