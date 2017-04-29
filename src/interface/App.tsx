import * as React from 'react';
import { Register } from './RegisterComponent';
import { Superescalar } from '../core/Superescalar';

class App extends React.Component<any, any> {

   constructor(props: Superescalar) {
      console.log(props);
      super(props);
   }

   render() {
      return (
         <div className='App'>
            <div className='fluid-container'>

               <div className='col-row'>
                  <div className='col-sm-4'>
                     <div className='row'>
                        <Register title='RGP' content={this.props.machine.gpr.content} />
                     </div>
                  </div>
                  <div className='col-sm-4'>
                     <div className='row'>
                        {/*<Register title='RFP' content={this.props.machine.fpr.content} />*/}
                     </div>
                  </div>
                  <div className='col-sm-4'>
                     <div className='row'>
                        {/*<Register title='MEM' content={this.props.machine.memory.data} />*/}
                     </div>
                  </div>
               </div>
            </div>
         </div>
      );
   }
}

export default App;
