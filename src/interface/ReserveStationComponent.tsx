import * as React from 'react';
import { BaseComponent } from './BaseComponent';

import { translate } from 'react-i18next';
import { t } from 'i18next';

import './ReserveStationComponent.scss';
declare var window: any;

class ReserveStationComponent extends BaseComponent {

   constructor(props: any) {
      super(props);
   }

   buildShowableContent(content: { data: any, size: number }): any {
      let toReturnObject = {
         showableContent: []
      };
      let data = content.data;
      let toReturn = [];
      let i;
      for (i = 0; i < data.length; i++) {
         let aux = {
            instruction: { id: '' },
            Qj: '',
            Vj: '',
            Qk: '',
            Vk: '',
            A: '',
            ROB: ''
         };
         if (data[i] != null) {
            aux = {
               instruction: { id: '' },
               Qj: data[i].Qj,
               Vj: data[i].Vj,
               Qk: data[i].Qk,
               Vk: data[i].Vk,
               A: data[i].A,
               ROB: data[i].ROB
            };
            if (data[i].instruction != null) {
               aux.instruction.id = data[i].instruction.id;
            }
         }

         toReturn.push(aux);
      }

      for (let j = i; j < content.size; j++) {
         toReturn.push({
            instruction: { id: '' },
            Qj: '',
            Vj: '',
            Qk: '',
            Vk: '',
            A: '',
            ROB: ''
         });
      }
      toReturnObject.showableContent = toReturn;
      return toReturnObject;
   }


   render() {
      return (
         <div className='panel panel-default'>
            <div className='panel-heading'>{t(this.props.title)}</div>
            <div className='panel-body'>
               <table className='table table-bordered'>
                  <thead>
                     <tr>
                        <td>Inst</td>
                        <td>Qj</td>
                        <td>Vj</td>
                        <td>Qk</td>
                        <td>Vk</td>
                        <td>A</td>
                        <td>ROB</td>
                     </tr>
                  </thead>
                  <tbody>
                     {
                        this.state.showableContent.map((row, i) => <tr key={`${this.props.title + i}`}>
                           <td>{row.instruction.id}</td>
                           <td>{row.Qj}</td>
                           <td>{row.Vj}</td>
                           <td>{row.Qk}</td>
                           <td>{row.Vk}</td>
                           <td>{row.A}</td>
                           <td>{row.ROB}</td>
                        </tr>)
                     }
                  </tbody>
               </table>
            </div>
         </div>);
   }
}

export default translate('common', { wait: true })(ReserveStationComponent);
