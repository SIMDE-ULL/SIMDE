import * as React from 'react';
import { RegisterComponent } from '../RegisterComponent';
import * as _ from 'lodash';

import './RegistersTabComponent.scss';

export class RegisterTabComponent extends React.Component<any, any> {

   render() {
      return (<div id='menu1' className='tab-pane fade'>
         <div className='row'>
            <div className='col-sm-4'>
               <RegisterComponent title='Memoria' />
            </div>
            <div className='col-sm-4'>
               <RegisterComponent title='Registros generales' />
            </div>
            <div className='col-sm-4'>
               <RegisterComponent title='Registros de punto flotante' />
            </div>
         </div>
      </div>);
   };
}
