import * as React from 'react';
import { CodeComponent } from './CodeComponent';
import { RegisterComponent } from './RegisterComponent';
import { ReserveStationComponent } from './ReserveStationComponent';
import { FileBarComponent } from './FileBarComponent';
import { AccessBarComponent } from './AccessBarComponent';
import { Superescalar } from '../core/Superescalar';
import { FunctionalUnitComponent } from './FunctionalUnitComponent';

class App extends React.Component<any, any> {

   constructor(props: Superescalar) {
      super(props);
   }

   render() {
      return (
         <div className='App'>
            <div className='fluid-container'>
               <FileBarComponent />
               <AccessBarComponent />
               <div className='row'>
                  <div className='col-sm-6'>
                     <CodeComponent content={this.props.machine.code} />
                  </div>
                  <div className='col-sm-6'>
                     <FunctionalUnitComponent title='FU +Entera' content={this.props.machine.functionalUnit[0]} />
                  </div>
               </div>
               <div className='row'>
                  <ReserveStationComponent title='RS +Entera' content={this.props.machine.reserveStationEntry[0]} />
               </div>
               <div className='col-row'>
                  <div className='col-sm-4'>
                     <div className='row'>
                        <RegisterComponent title='GPR' content={this.props.machine.gpr.content} />
                     </div>
                  </div>
                  <div className='col-sm-4'>
                     <div className='row'>
                        <RegisterComponent title='FPR' content={this.props.machine.fpr.content} />
                     </div>
                  </div>
                  <div className='col-sm-4'>
                     <div className='row'>
                        <RegisterComponent title='MEM' content={this.props.machine.memory.data} />
                     </div>
                  </div>
               </div>

            </div>
         </div >
      );
   }
}

export default App;
