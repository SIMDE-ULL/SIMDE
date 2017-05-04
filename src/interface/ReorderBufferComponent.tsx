import * as React from 'react';
declare var window: any;

export class ReorderBufferComponent extends React.Component<any, any> {

   constructor(props: any) {
      super(props);
      this.state = {
         content: []
      };
      window.state['ROB'] = (data) => {
         this.setState(data);
      };
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
                        this.state.content.map((row, i) => <tr>
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
