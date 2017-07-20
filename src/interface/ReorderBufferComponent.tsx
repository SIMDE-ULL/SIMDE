import * as React from 'react';
import { BaseComponent } from './BaseComponent';
import { stageToString } from '../core/Superescalar/SuperescalarEnums';

import { translate } from 'react-i18next';
import { t } from 'i18next';

declare var window: any;

class ReorderBufferComponent extends BaseComponent {

   constructor(props: any) {
      super(props);
   }

   buildShowableContent(data): any {
      let toReturnObject = {
         showableContent: []
      };
      let toReturn = new Array();
      for (let i = 0; i < data.length; i++) {
         let aux = {
            instruction: { id: '' },
            destinyRegister: '',
            value: '',
            address: '',
            superStage: ''
         };
         if (data[i] != null) {
            aux = {
               instruction: { id: '' },
               destinyRegister: data[i].destinyRegister,
               value: data[i].value,
               address: data[i].address,
               superStage: stageToString(data[i].superStage)
            };
            if (data[i].instruction != null) {
               aux.instruction.id = data[i].instruction.id;
            }
         };
         toReturn.push(aux);
      }
      toReturnObject.showableContent = toReturn;
      return toReturnObject;
   }


   render() {
      return (
         <div className='panel panel-default reorder-zone'>
            <div className='panel-heading'>{'ReorderBuffer'}</div>
            <div className='panel-body'>
               <table className='table table-bordered'>
                  <thead>
                     <tr>
                        <td>#</td>
                        <td>Inst</td>
                        <td>{t('reorderBuffer.Destiny')}</td>
                        <td>{t('reorderBuffer.Value')}</td>
                        <td>{t('reorderBuffer.A')}</td>
                        <td>{t('reorderBuffer.Stage')}</td>
                     </tr>
                  </thead>
                  <tbody>
                     {
                        this.state.showableContent.map((row, i) => <tr key={'ReorderBuffer' + i}>
                           <td>{i}</td>
                           <td>{row.instruction.id}</td>
                           <td>{row.destinyRegister}</td>
                           <td>{row.value}</td>
                           <td>{row.address}</td>
                           <td>{row.superStage}</td>
                        </tr>)
                     }
                  </tbody>
               </table>
            </div>
         </div>);
   }
}

export default translate('common', { wait: true })(ReorderBufferComponent);
