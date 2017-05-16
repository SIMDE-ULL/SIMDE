import * as React from 'react';
import { Superescalar } from '../core/Superescalar';

import { FileBarComponent } from './navbar/FileBarComponent';
import { AccessBarComponent } from './navbar/AccessBarComponent';

import { GeneralTabComponent } from './tab/GeneralTabComponent';
import { RegisterTabComponent } from './tab/RegistersTabComponent';

import { LoadModalComponent } from './modal/LoadModalComponent';
import { SuperescalarConfigModalComponent } from './modal/SuperescalarConfigModalComponent';
declare var window: any;

class App extends React.Component<any, any> {

   constructor(props: Superescalar) {
      super(props);
   }

   render() {
      return (
         <div className='App'>
            <div className='container-fluid'>
               <FileBarComponent />
               <AccessBarComponent />
               <div className='tab-content'>
                  <GeneralTabComponent />
                  <RegisterTabComponent />
               </div>
            </div>
            < LoadModalComponent />
            <SuperescalarConfigModalComponent />
         </div >
      );
   }
}

export default App;
