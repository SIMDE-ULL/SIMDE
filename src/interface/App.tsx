import * as React from 'react';
import { Superescalar } from '../core/Superescalar';

import { FileBarComponent } from './FileBarComponent';
import { AccessBarComponent } from './AccessBarComponent';

import { GeneralTabComponent } from './tab/GeneralTabComponent';
import { RegisterTabComponent } from './tab/RegistersTabComponent';
import { LoadModalComponent } from './modal/LoadModalComponent';

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
               <div className='row'>
                  <AccessBarComponent />
               </div>
               <div className='tab-content'>
                  <GeneralTabComponent />
                  <RegisterTabComponent />
               </div>
            </div>
            < LoadModalComponent />
         </div >
      );
   }
}

export default App;
