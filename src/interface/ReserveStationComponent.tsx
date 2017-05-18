import * as React from 'react';
declare var window: any;

export class ReserveStationComponent extends React.Component<any, any> {

   constructor(props: any) {
      super(props);
      this.state = {
         title: null,
         content: [],
         showableContent: []
      };
      window.state[this.props.title] = (data) => {
         let newState = {
            content: data.content,
            showableContent: this.buildShowable(data.content.data, data.content.size)
         };
         this.setState(newState);
      };
   }

   buildShowable(data, size): any[] {
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

      for (let j = i; j < size; j++) {
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
