import * as React from 'react';
import { BaseComponent } from './BaseComponent';
import './ReserveStationComponent.scss';

declare var window: any;

export class ReserveStationComponent extends BaseComponent {

   constructor(props: any) {
      super(props);
   }

   buildShowableContent(content: { data: any, size: number }): any[] {
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

      return toReturn;
   }


   render() {
      return (
         <div className='panel panel-default'>
            <div className='panel-heading'>{this.props.title}</div>
            <div className='panel-body'>
               <table className='table table-bordered'>
                  <thead>
                     <tr>
                        <td width='14.28%'>Inst</td>
                        <td width='14.28%'>Qj</td>
                        <td width='14.28%'>Vj</td>
                        <td width='14.28%'>Qk</td>
                        <td width='14.28%'>Vk</td>
                        <td width='14.28%'>A</td>
                        <td width='14.28%'>ROB</td>
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
