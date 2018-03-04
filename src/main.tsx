import { Code } from './core/Common/Code';
import { Superescalar } from './core/Superescalar/Superescalar';
import { SuperescalarStatus } from './core/Superescalar/SuperescalarEnums';
import { FunctionalUnitType } from './core/Common/FunctionalUnit';
import { ExecutionStatus } from './main-consts';

import { 
      nextPrefetchCycle,
      nextDecoderCycle,
      nextJumpTableCycle,
      nextFunctionalUnitCycle,
      nextReserveStationCycle,
      nextReorderBufferCycle,
      nextRegistersCycle,
      nextMemoryCycle,
      nextReorderBufferMapperCycle,
      nextCycle,
      superescalarLoad,
      batchActions
} from './interface/actions';

import { SuperescalarReducers } from './interface/reducers';
import { enableBatching } from './interface/reducers/batching';

import * as React from 'react';
import * as ReactDOM from 'react-dom';
import i18n from './i18n'; // initialized i18next instance
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import { I18nextProvider } from 'react-i18next'; // as we build ourself via webpack

import App from './interface/App';
import { pushHistory, takeHistory } from './interface/actions/history';

const styles = require('./main.scss');


// Global objects for binding React to the View
export let superescalar = new Superescalar();
let interval = null;
let backStep = 0;
let stopCondition = ExecutionStatus.EXECUTABLE;
let finishedExecution = false;
let executing = false;

/*
 * This call all the components to update the state
 * if there is a step param, the components will use
 * their history to set the appropiate content
 */
let dispatchAllSuperescalarActions = (step?: number) => {
      // Code should only be setted on the first iteration
      store.dispatch(
            batchActions(
                  nextJumpTableCycle(superescalar.jumpPrediction),
                  nextPrefetchCycle(superescalar.prefetchUnit),
                  nextDecoderCycle(superescalar.decoder),
                  nextFunctionalUnitCycle([...superescalar.functionalUnit, superescalar.aluMem]),
                  nextReserveStationCycle(
                        [{
                              data: superescalar.reserveStationEntry[0],
                              size: superescalar.getReserveStationSize(0)
                        },

                        {
                              data: superescalar.reserveStationEntry[1],
                              size: superescalar.getReserveStationSize(1)
                        },

                        {
                              data: superescalar.reserveStationEntry[2],
                              size: superescalar.getReserveStationSize(2)
                        },

                        {
                              data: superescalar.reserveStationEntry[3],
                              size: superescalar.getReserveStationSize(3)
                        },

                        {
                              data: superescalar.reserveStationEntry[4],
                              size: superescalar.getReserveStationSize(4)
                        },

                        {
                              data: superescalar.reserveStationEntry[5],
                              size: superescalar.getReserveStationSize(5)
                        }
                  ]),
                  nextReorderBufferMapperCycle([superescalar.ROBGpr, superescalar.ROBFpr]),
                  nextReorderBufferCycle(superescalar.reorderBuffer.elements),
                  nextRegistersCycle([superescalar.gpr.content, superescalar.fpr.content]),
                  nextMemoryCycle(superescalar.memory.data),
                  nextCycle(superescalar.status.cycle),
                  pushHistory()
            )
      );
};

export let superExe = () => {
      superescalar.init(true);
};

// https://github.com/reactjs/redux/issues/911#issuecomment-149361073

export let superStep = () => {
      if (backStep > 0) {
            backStep--;
            store.dispatch(takeHistory(backStep));
      } else {
            if (finishedExecution) {
                  finishedExecution = false;
                  dispatchAllSuperescalarActions(-1);
                  superescalar.status.cycle = 0;
            }
            if (superescalar.status.cycle === 0) {
                  let code = Object.assign(new Code(), superescalar.code);
                  superExe();
                  superescalar.code = code;
            }
            let resul = superescalar.tic();
            dispatchAllSuperescalarActions();

            return resul;
      }
};

export let loadSuper = (code: Code) => {
      superExe();
      superescalar.code = code;

      // There is no need to update the code with the rest,
      // it should remain the same during all the program execution
      store.dispatch(superescalarLoad(superescalar.code.instructions));
      dispatchAllSuperescalarActions();
};

export let play = () => {
      stopCondition = ExecutionStatus.EXECUTABLE;
      backStep = 0;
      executing = true;
      let speed = calculateSpeed();

      // Check if the execution has finished 
      if (finishedExecution) {
            finishedExecution = false;
            dispatchAllSuperescalarActions(-1);
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
            dispatchAllSuperescalarActions();
            finishedExecution = true;
            alert('Done');
      }

};

export let pause = () => {
      stopCondition = ExecutionStatus.PAUSE;
      executing = false;
};

export let stop = () => {

      // In normal execution I have to avoid the asynchrnous way of
      // js entering in the interval, the only way I have is to check this
      stopCondition = ExecutionStatus.STOP;

      if (!executing) {
            executing = false;
            dispatchAllSuperescalarActions(-1);
            superescalar.status.cycle = 0;
            let code = Object.assign(new Code(), superescalar.code);
            superExe();
            superescalar.code = code;
      }
};

export let stepBack = () => {
      // There is no time travelling for batch mode and initial mode
      if (superescalar.status.cycle > 0 && backStep < 10 &&
            (superescalar.status.cycle - backStep > 0)) {
            backStep++;
            store.dispatch(takeHistory(backStep));
      }
};

function calculateSpeed() {
      let speed = parseInt((document.getElementById('velocidad') as HTMLInputElement).value);

      let calculatedSpeed = 2000;
      calculatedSpeed = speed ?  calculatedSpeed / speed : 0;

      return calculatedSpeed;
};

function executionLoop(speed) {
      if (!stopCondition) {
            setTimeout(() => {
                  let result = superStep();
                  if (!(result === SuperescalarStatus.SUPER_BREAKPOINT || result === SuperescalarStatus.SUPER_ENDEXE)) {
                        executionLoop(speed);
                  } else {
                        if (result === SuperescalarStatus.SUPER_BREAKPOINT) {
                              alert('Ejecución detenida, breakpoint');
                        } else if (result === SuperescalarStatus.SUPER_ENDEXE) {
                              finishedExecution = true;
                              alert('Ejecución finalizada');
                        }
                  }
            }, speed);
      } else if (stopCondition === ExecutionStatus.STOP) {
            let code = Object.assign(new Code(), superescalar.code);
            superExe();
            superescalar.code = code;
            dispatchAllSuperescalarActions(-1);
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



declare var window;
let store = createStore(
      enableBatching(SuperescalarReducers),
      window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
);


/*
 * Here is where the react endpoint appears
 *
 */
ReactDOM.render(
      <I18nextProvider i18n={i18n}>
            <Provider store={store}>
                  <App machine={superescalar} />
            </Provider>
      </I18nextProvider>,
      document.getElementById('app')
);
