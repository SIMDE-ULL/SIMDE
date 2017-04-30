import * as React from 'react';
import { Code } from '../core/Code';
declare var window: any;

export class CodeComponent extends React.Component<any, any> {

   constructor(props: any) {
      super(props);
      this.state = {
         content: [],
         code: []
      };
      window.state['Code'] = (data) => {
         this.setState(data);
      };
   }

   render() {
      return (
         <div className='panel panel-default'>
            <div className='panel-heading'>{'Code'}</div>
            <div className='panel-body'>
               <table className='table table-bordered'>
                  <thead>
                     <tr>
                        <th>#</th>
                        <th>OPCODE</th>
                        <th>OP1</th>
                        <th>OP2</th>
                        <th>OP3</th>
                     </tr>
                  </thead>
                  <tbody>
                     {
                        this.state.code.map((row, i) => <tr key={`${'Code' + i}`}>
                           <td>{i}</td>
                           <td>{Code.OpcodesNames[row.opcode]}</td>
                           <td>{row.operands[0]}</td>
                           <td>{row.operands[1]}</td>
                           <td>{row.operands[2]}</td>
                        </tr>)
                     }
                  </tbody>
               </table>
            </div>
         </div>);
   }
}
