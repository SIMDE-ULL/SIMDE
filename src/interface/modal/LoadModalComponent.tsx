import * as React from 'react';
declare var window: any;

export class LoadModalComponent extends React.Component<any, any> {
   loadSuper() {
      window.loadSuper();
   }

   render() {
      return (<div id='codeModal' className='modal fade' role='dialog'>
         <div className='modal-dialog'>
            <div className='modal-content'>
               <div className='modal-header'>
                  <button type='button' className='close' data-dismiss='modal'>&times;</button>
                  <h4 className='modal-title'>Introducir código</h4>
               </div>
               <div className='modal-body'>
                  <textarea id='codeInput' defaultValue={`5
        LF F1 (R2)
        ADDI R5 R0 #3
        LOOP:
        ADDF F2 F1 F0
        ADDI R2 R2 #1
        BNE	R2 R5 LOOP`}>
                  </textarea>
               </div>
               <div className='modal-footer'>
                  <button type='button' className='btn btn-default' data-dismiss='modal'>Close</button>
                  <button type='button' className='btn btn-primary' onClick={this.loadSuper}>Load</button>
               </div>
            </div>

         </div>
      </div>);
   }
}
