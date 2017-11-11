import * as React from 'react';
import { Superescalar } from '../core/Superescalar/Superescalar';

import FileBarComponent from './components/navbar/FileBarComponent';
import AccessBarComponent from './components/navbar/AccessBarComponent';

import GeneralTabComponent from './components/tab/GeneralTabComponent';
import { RegisterTabComponent } from './components/tab/RegistersTabComponent';

import LoadModalComponent from './components/modal/LoadModalComponent';
import SuperescalarConfigModalComponent from './components/modal/SuperescalarConfigModalComponent';
import OptionsModalComponent from './components/modal/OptionsModalComponent';
import AutorModalComponent from './components/modal/AutorModalComponent';

import { translate } from 'react-i18next';

class App extends React.Component<any, any> {

   constructor(props: Superescalar) {
      super(props);
   }

   render() {
      return (
         <div className='App'>
            <div className='container-fluid'>
               <div className='navigation-bars'>
                  <FileBarComponent />
                  <AccessBarComponent />
               </div>
               <div className='tab-content'>
                  <GeneralTabComponent />
                  <RegisterTabComponent />
               </div>
            </div>
            <LoadModalComponent />
            <SuperescalarConfigModalComponent />
            <OptionsModalComponent />
            <AutorModalComponent />
         </div >
      );
   }
}

export default App;
