import * as React from 'react';
declare var window: any;

export class SuperescalarConfigModalComponent extends React.Component<any, any> {
   loadSuper() {
      window.loadSuper();
   }

   render() {
      return (<div id='superConfigModal' className='modal fade' role='dialog'>
         <div className='modal-dialog'>
            <div className='modal-content'>
               <div className='modal-header'>
                  <button type='button' className='close' data-dismiss='modal'>&times;</button>
                  <h4 className='modal-title'>Configuración Superescalar</h4>
               </div>
               <div className='modal-body'>
               </div>
               <div className='modal-footer'>
                  <button type='button' className='btn btn-default' data-dismiss='modal'>Close</button>
                  <button type='button' className='btn btn-primary'>Save</button>
               </div>
            </div>

         </div>
      </div>);
   }
}
