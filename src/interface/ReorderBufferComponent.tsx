import * as React from 'react';
import { BaseComponent } from './BaseComponent';
import { stageToString } from '../core/SuperescalarEnums';

declare var window: any;

export class ReorderBufferComponent extends BaseComponent {

   constructor(props: any) {
      super(props);
   }

   buildShowableContent(data): any[] {
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

      return toReturn;
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
                        <td>Destino</td>
                        <td>Valor</td>
                        <td>Dir</td>
                        <td>Etapa</td>
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
